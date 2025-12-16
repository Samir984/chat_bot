from ninja import NinjaAPI
from user.api import users as users_router
from chat.api import chat as chat_router
from chat.api import conversation as conversation_router
from chat.api import rag_collection as rag_collection_router
from django.http import JsonResponse
from django.db import connection

api = NinjaAPI(
    title="Chat Bot API", version="1.0.0", description="Chat Bot API", docs_url="/docs"
)


@api.get("/health/", auth=None)
def health_check(request):
    try:
        connection.ensure_connection()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return 503, {"status": "unhealthy", "error": str(e)}


api.add_router("users/", users_router, tags=["users"])
api.add_router("chat/", chat_router, tags=["chat"])
api.add_router("conversation/", conversation_router, tags=["conversation"])
api.add_router("rag_collection/", rag_collection_router, tags=["rag_collection"])
