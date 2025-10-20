from ninja import NinjaAPI
from user.api import users as users_router
from chat.api import chat as chat_router

api = NinjaAPI(title="Chat Bot API", version="1.0.0",description="Chat Bot API",docs_url="/docs")


api.add_router("users/", users_router, tags=["users"])
api.add_router("chat/", chat_router, tags=["chat"])




