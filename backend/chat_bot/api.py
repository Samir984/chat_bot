from ninja import NinjaAPI
from user.api import users as users_router
api = NinjaAPI()


api.add_router("users/", users_router, tags=["users"])





