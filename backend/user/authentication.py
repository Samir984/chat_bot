from ninja.security import APIKeyCookie

from ninja_jwt.tokens import AccessToken
from ninja.errors import HttpError
from django.http import HttpRequest
from user.models import User


class CookieJWTAuth:
    def __call__(self, request: HttpRequest):

        access_token = request.COOKIES.get("access_token")
        if not access_token:
            return None

        try:
            validated_token = AccessToken(access_token)
            user_id = validated_token.get("user_id")
            if not user_id:
                return None
            user = User.objects.get(id=user_id)
            return user
        except Exception as e:
            print(f"Authentication error: {e}")
            return None
