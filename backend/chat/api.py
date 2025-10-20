from django.http import HttpRequest
from langchain_core.runnables import history
from ninja import  Router


from chat_bot.settings import model


from chat.schema import PublicChatRequestSchema, PublicChatResponseSchema
from langchain_core.messages import HumanMessage, AIMessage
chat = Router()



# for unauthenticated users
@chat.post("/",response={200: PublicChatResponseSchema})
def public_send_message(request: HttpRequest,data: PublicChatRequestSchema):
    # Build LangChain messages from history and current prompt
    messages = []
    for history_item in data.history:
        if history_item.role == "user":
            messages.append(HumanMessage(content=history_item.content))
        else:
            messages.append(AIMessage(content=history_item.content))

  
    messages.append(HumanMessage(content=data.prompt))


    message = model.invoke(messages)
    return PublicChatResponseSchema(content=message.content)