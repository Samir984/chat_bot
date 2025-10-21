from typing import Optional
from ninja import Schema
from uuid import UUID
from chat.choices import RoleChoices

class ChatResponseSchema(Schema):
    conversation_id: Optional[UUID] = None
    content: str

class MessageSchema(Schema):
    role: RoleChoices
    content: str
   
class PublicChatRequestSchema(Schema):
    prompt: str
    history: list[MessageSchema] = []

class ChatRequestSchema(Schema):
    conversation_id: Optional[UUID] = None
    prompt: str
  
class SelectedConversationSchema(Schema):
    conversation_id: UUID
    history: list[MessageSchema]

class ConversationListResponseSchema(Schema):
    conversation_id: UUID
    conversation_title: str

class GenericSchema(Schema):
    detail: str