from ninja import NinjaAPI
from user.api import users as users_router
from chat.api import chat as chat_router
from chat.api import conversation as conversation_router
from chat.api import rag_collection as rag_collection_router

api = NinjaAPI(
    title="Chat Bot API", version="1.0.0", description="Chat Bot API", docs_url="/docs"
)
from typing import Any, Optional
@api.get("/weapons")
def list_weapons(request, limit: int = 10, offset: int = None):
    print("limit", limit)
    print("offset", offset)
    return 200, "nice"


api.add_router("users/", users_router, tags=["users"])
api.add_router("chat/", chat_router, tags=["chat"])
api.add_router("conversation/", conversation_router, tags=["conversation"])
api.add_router("rag_collection/", rag_collection_router, tags=["rag_collection"])
