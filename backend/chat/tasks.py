import tempfile
import os
from celery import shared_task
from django.core.files.storage import default_storage
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from chat.models import RAGCollection, RAGDocument
from chat.qdrant_client import get_or_create_vector_store



@shared_task
def start_indexing_documents(rag_collection_id: int, vector_collection_name: str):
    # Import vector_store inside the function to avoid initializing embeddings at import time

    print("Starting indexing documents")
    print(f"Rag collection ID: {rag_collection_id}")

    unindexed_documents = RAGDocument.objects.filter(
        rag_collection_id=rag_collection_id, is_indexed=False
    )
    vector_store = get_or_create_vector_store(vector_collection_name)
   
    print(f"Found {unindexed_documents.count()} unindexed documents")

    # Text splitter configuration
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
    )

    # Process each unindexed document
    for document in unindexed_documents:
        try:
            print(f"Processing document: {document.original_document_name}")

            # Download document from S3 to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_path = temp_file.name
                # Download from S3
                with default_storage.open(document.document_path.name, "rb") as s3_file:
                    temp_file.write(s3_file.read())

            try:
                # Load PDF document
                loader = PyPDFLoader(temp_path)
                print(f"Loading document: {temp_path},{loader}")
                pages = loader.load()
                print(
                    f"Loaded {pages} pages from document: {document.original_document_name}"
                )

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
                    print(
                        f"Indexed {len(chunks)} chunks from document: {document.original_document_name}"
                    )

                # Mark document as indexed
                document.is_indexed = True
                document.save()
                print(
                    f"Document {document.original_document_name} indexed successfully"
                )

            except Exception as e:
                print(
                    f"Error processing document {document.original_document_name}: {str(e)}"
                )
                # Don't mark as indexed if there was an error
                continue
            finally:
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.unlink(temp_path)

        except Exception as e:
            print(f"Error indexing document {document.id}: {str(e)}")
            continue

    print(f"Finished indexing documents for collection {rag_collection_id}")
