from typing import Optional

from ninja import Schema
from ninja import ModelSchema
from uuid import UUID

from chat.choices import RoleChoices
from chat.models import RAGCollection, RAGDocument


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


class CreateRAGCollectionSchema(Schema):
    rag_collection_name: str


class RAGDocumentListSchema(ModelSchema):
    class Meta:
        model = RAGDocument
        fields = ["id", "document_name", "document_path", "is_indexed"]


class RAGCollectionListSchema(ModelSchema):
    documents: list[RAGDocumentListSchema] = []

    class Meta:
        model = RAGCollection
        fields = ["id", "rag_collection_name"]


class GenericSchema(Schema):
    detail: str
