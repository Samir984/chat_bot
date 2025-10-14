from ninja import NinjaAPI

api = NinjaAPI()

@api.get("/ping/")
def hello_world(request):
    return "pong"