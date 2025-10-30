from celery import shared_task
from chat.models import RAGCollection, RAGDocument


@shared_task
def start_indexing_documents(rag_collection_id: int):
    # get all unindexed documents inside that rag collection
    print(f"Rag collection ID: {rag_collection_id}")
    unindexed_documents = RAGDocument.objects.filter(rag_collection_id=rag_collection_id, is_indexed=False)
    print(f"Unindexed documents: {unindexed_documents}")
   