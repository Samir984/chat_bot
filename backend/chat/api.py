from django.http import HttpRequest
from django.shortcuts import get_object_or_404

from uuid import UUID
from ninja import  Router
from ninja_jwt.authentication import JWTAuth
from chat.models import Conversation

from chat_bot.settings import model
from chat.schema import PublicChatRequestSchema, ChatResponseSchema, ChatRequestSchema, GenericSchema, SelectedConversationSchema, ConversationListResponseSchema               
from chat.utils import build_messages_from_history


chat = Router()

# For unauthenticated users
@chat.post("/public/", response={200: ChatResponseSchema})
def public_send_message(request: HttpRequest, data: PublicChatRequestSchema):
    messages = build_messages_from_history(data.history, data.prompt)
    message = model.invoke(messages)
    return ChatResponseSchema(content=message.content)

# For authenticated users
@chat.post("/", response={200: ChatResponseSchema, 400: GenericSchema}, auth=JWTAuth())
def send_message(request: HttpRequest, data: ChatRequestSchema):
    user = request.auth
    if data.conversation_id:
        conversation = Conversation.objects.get(id=data.conversation_id, user=user)
    else:
        conversation_title = data.prompt[:25]
        conversation = Conversation.objects.create(user=user, history=[], conversation_title=conversation_title)
  
    try:    
        messages = build_messages_from_history(conversation.history, data.prompt)
     
        message = model.invoke(messages)
  
        if message.content:
            conversation.history.append({"role": "user", "content": data.prompt})
            conversation.history.append({"role": "ai", "content": message.content})
            conversation.save()
            return 200, ChatResponseSchema(conversation_id=conversation.id, content=message.content)
       
    except Exception as e:
        return 400, GenericSchema(detail=str(e))


@chat.get("/conversations/list/", response={200: list[ConversationListResponseSchema]},auth=JWTAuth())
def get_user_conversations_list(request: HttpRequest):
    print("Entered get_user_conversations_list")
    conversations = Conversation.objects.filter(user=request.auth).values("id", "conversation_title")
    print(conversations)
    return [ConversationListResponseSchema(conversation_id=conversation["id"], conversation_title=conversation["conversation_title"]) for conversation in conversations]
   

@chat.get("/conversations/{conversation_id}/", response={200: SelectedConversationSchema}, auth=JWTAuth())
def get_conversation(request: HttpRequest, conversation_id: UUID):
    conversation = get_object_or_404(Conversation, id=conversation_id, user=request.auth)
    return SelectedConversationSchema(conversation_id=conversation.id, history=conversation.history)