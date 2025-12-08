from django.http import HttpRequest
from django.contrib.auth import authenticate
from ninja import Router
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
from user.authentication import CookieJWTAuth
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from chat_bot.env import ENV
from user.utils import set_auth_cookies

from ninja import NinjaAPI, Router

cookie_auth = CookieJWTAuth()
api = NinjaAPI()
users = Router()

print("cookie_auth", cookie_auth)

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

@users.post("/google-login/", response={200: UserSchema,400: GenericSchema})
def google_login(request: HttpRequest, data: GoogleLoginSchema):
    try:
        google_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            params={"access_token": data.credential},
        )

        if not google_response.ok:
            return 400, GenericSchema(detail="Invalid Google token")

        id_info = google_response.json()
        print("id_info", id_info)
   
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
                profile_picture=id_info.get("picture", None),
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
            profile_picture=id_info.get("picture", None),
        )
        response_obj = api.create_response(request, response, status=200)
        set_auth_cookies(response_obj, access_token, refresh_token)

        return response_obj

    except ValueError:
        return 400, GenericSchema(detail="Invalid Google token")


@users.get("/get-me/", response={200: UserSchema}, auth=cookie_auth)
def get_me(request: HttpRequest):
    print("request.auth", request.auth)
    print("request.auth", request)
    user = request.auth
    print(user)
    return UserSchema(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        profile_picture=user.profile_picture,
    )


@users.get("/logout/", auth=cookie_auth)
def logout_user(request: HttpRequest):
    user = request.auth
    refresh_token = RefreshToken.for_user(user)
    refresh_token.blacklist()

    # Create response with success message
    response_schema = GenericSchema(detail="User logged out successfully")
    response = api.create_response(request, response_schema, status=200)
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")

    return response
