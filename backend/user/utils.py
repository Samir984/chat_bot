from chat_bot.env import ENV


def set_auth_cookies(response, access_token: str, refresh_token: str):

    if ENV.DEBUG:
        secure = False
    else:
        secure = True

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="Lax",
        secure=secure,
        max_age=ENV.ACCESS_TOKEN_LIFETIME * 3600,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="Lax",
        secure=secure,
        max_age=ENV.REFRESH_TOKEN_LIFETIME * 24 * 3600,
    )
    return response
