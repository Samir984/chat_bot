from ninja import Schema


class UserRegisterSchema(Schema):
    first_name: str
    last_name: str
    email: str
    password: str


class UserLoginSchema(Schema):
    email: str
    password: str


class GoogleLoginSchema(Schema):
    credential: str 


class GenericSchema(Schema):
    detail: str


class UserSchema(Schema):
    id: int
    email: str
    first_name: str
    last_name: str


class LoginResponseSchema(Schema):
    user: UserSchema
