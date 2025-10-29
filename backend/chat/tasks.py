from celery import shared_task


@shared_task
def start_indexing_documents(rag_collection_id: int):
    print("Test task executed")
    return "Test task executed"
