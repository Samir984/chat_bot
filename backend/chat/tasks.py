import tempfile
import os
from celery import shared_task
from django.core.files.storage import default_storage
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from chat.models import RAGCollection, RAGDocument
from chat.qdrant_client import get_or_create_vector_store


@shared_task(bind=True)
def start_indexing_documents(
    self, rag_collection_id: int, qdrant_collection_name: str, document_id: int
):
    # Import vector_store inside the function to avoid initializing embeddings at import time
    print("Starting indexing documents")

    self.update_state(state="PROGRESS", meta={"progress": 0})

    unindexed_documents = RAGDocument.objects.filter(
        rag_collection_id=rag_collection_id, is_indexed=False, id=document_id
    )
    vector_store = get_or_create_vector_store(qdrant_collection_name)

    # Text splitter configuration
    # chunk_size is in CHARACTERS, not words
    # 1000 characters ≈ 150-200 words (more reasonable chunk size)
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )

    total_documents = unindexed_documents.count()
    each_document_progress_percentage = 100 / total_documents
    # Process each unindexed document

    for index, document in enumerate(unindexed_documents):
        try:
            # Download document from S3 to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_path = temp_file.name
                # Download from S3
                with default_storage.open(document.document_path.name, "rb") as s3_file:
                    temp_file.write(s3_file.read())

            try:
                # Load PDF document
                loader = PyPDFLoader(temp_path)
                pages = loader.load()

                # Split documents into chunks
                chunks = text_splitter.split_documents(pages)

                # Add metadata to each chunk
                for chunk in chunks:
                    chunk.metadata.update(
                        {
                            "rag_collection_id": rag_collection_id,
                            "document_id": document.id,
                            "document_name": document.original_document_name,
                            "collection_name": document.rag_collection.rag_collection_name,
                        }
                    )

                # Add documents to Qdrant vector store
                if chunks:
                    vector_store.add_documents(chunks)
                # Mark document as indexed
                document.is_indexed = True
                document.save()
                self.update_state(
                    state="PROGRESS",
                    meta={
                        "progress": ((index + 1) * each_document_progress_percentage)
                    },
                )

            except Exception as e:
                # Don't mark as indexed if there was an error
                self.update_state(state="FAILURE", meta={"message": str(e)})
                continue
            finally:

                if os.path.exists(temp_path):
                    os.unlink(temp_path)

        except Exception as e:
            print(f"Error indexing document {document.id}: {str(e)}")
            continue
    print("Indexing documents completed")
    self.update_state(state="SUCCESS", meta={"progress": 100})
