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
)
from user.models import User

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

    return LoginResponseSchema(user=user, access=access_token, refresh=refresh_token)


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
