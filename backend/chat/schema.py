from ninja import Schema
from chat.choices import RoleChoices
from datetime import datetime

class ChatHistorySchema(Schema):
    role: RoleChoices
    content: str
   

class PublicChatRequestSchema(Schema):
    prompt: str
    history: list[ChatHistorySchema] = []

class PublicChatResponseSchema(Schema):
    content: str