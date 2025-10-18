from ninja import Router


users = Router()



@users.get("/")
def get_users(request):
    return {"message": "Hello, World!"}
