from django.http import HttpRequest
from django.contrib.auth import authenticate
from ninja import Router
from ninja_jwt.authentication import JWTAuth
from ninja_jwt.tokens import RefreshToken
from ninja.errors import HttpError

from user.schema import (
    UserRegisterSchema,
    GenericSchema,
    UserLoginSchema,
    LoginResponseSchema,
    UserSchema,
    GoogleLoginSchema,
)
from user.models import User
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from chat_bot.env import ENV
from user.utils import set_auth_cookies

from ninja import NinjaAPI, Router

api = NinjaAPI()
users = Router()


@users.post("/register/")
def register_user(request: HttpRequest, data: UserRegisterSchema):
    if User.objects.filter(email=data.email).exists():
        raise HttpError(400, "User already exists")

    User.objects.create_user(
        email=data.email,
        password=data.password,
        first_name=data.first_name,
        last_name=data.last_name,
    )

    return {"detail": "User registered successfully"}


@users.post("/login/")
def login_user(request: HttpRequest, data: UserLoginSchema):

    user = authenticate(request, email=data.email, password=data.password)

    if user is None:
        raise HttpError(401, "Invalid credentials")

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    response = LoginResponseSchema(user=user)
    response_obj = api.create_response(request, response, status=200)
    set_auth_cookies(response_obj, access_token, refresh_token)

    return response_obj

import requests

@users.post("/google-login/")
def google_login(request: HttpRequest, data: GoogleLoginSchema):
    try:
        google_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            params={"access_token": data.credential},
        )
        
        if not google_response.ok:
            raise ValueError("Invalid Google token")

        id_info = google_response.json()
   
        email = id_info.get("email")
        first_name = id_info.get("given_name", "")
        last_name = id_info.get("family_name", "")

        # Check if user exists
        user = User.objects.filter(email=email).first()

        if not user:
            # Create user if not exists
            user = User.objects.create_user(
                email=email,
                password=None,
                first_name=first_name,
                last_name=last_name,
            )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response = UserSchema(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            profile_picture_url=id_info.get("picture", None),
        )
        response_obj = api.create_response(request, response, status=200)
        set_auth_cookies(response_obj, access_token, refresh_token)

        return response_obj

    except ValueError:
        raise HttpError(400, "Invalid Google token")


@users.get("/get-me/", auth=JWTAuth())
def get_me(request: HttpRequest):
    user = request.auth
    return UserSchema(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
    )


@users.get("/logout/", auth=JWTAuth())
def logout_user(request: HttpRequest):
    user = request.auth
    refresh_token = RefreshToken.for_user(user)
    refresh_token.blacklist()

    # Create response with success message
    response = GenericSchema(detail="User logged out successfully")
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return 200, response
