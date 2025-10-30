from typing import List
from uuid import UUID

from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from django.db import transaction

from ninja import Router, UploadedFile, File, Form
from ninja_jwt.authentication import JWTAuth
from chat.models import Conversation, RAGCollection, RAGDocument
from chat.schema import CreateRAGCollectionSchema, RAGCollectionListSchema
from chat.tasks import start_indexing_documents
from chat.llm_service import llm_model
from chat.schema import (
    PublicChatRequestSchema,
    ChatResponseSchema,
    ChatRequestSchema,
    GenericSchema,
    SelectedConversationSchema,
    ConversationListResponseSchema,
)
from chat.utils import build_messages_from_history, validate_documents

chat = Router()
conversation = Router()
rag_collection = Router()


# For unauthenticated users
@chat.post("/public/", response={200: ChatResponseSchema})
def public_send_message(request: HttpRequest, data: PublicChatRequestSchema):
    messages = build_messages_from_history(data.history, data.prompt)
    message = llm_model.invoke(messages)
    return ChatResponseSchema(content=message.content)


# For authenticated users
@chat.post("/", response={200: ChatResponseSchema, 400: GenericSchema}, auth=JWTAuth())
def send_message(request: HttpRequest, data: ChatRequestSchema):
    user = request.auth
    if data.conversation_id:
        conversation = Conversation.objects.get(id=data.conversation_id, user=user)
    else:
        conversation_title = data.prompt[:25]
        conversation = Conversation.objects.create(
            user=user, history=[], conversation_title=conversation_title
        )

    try:
        messages = build_messages_from_history(conversation.history, data.prompt)
        message = llm_model.invoke(messages)

        if message.content:
            conversation.history.append({"role": "user", "content": data.prompt})
            conversation.history.append({"role": "ai", "content": message.content})
            conversation.save()
            return 200, ChatResponseSchema(
                conversation_id=conversation.id, content=message.content
            )

    except Exception as e:
        return 400, GenericSchema(detail=str(e))


@conversation.get(
    "/list/", response={200: list[ConversationListResponseSchema]}, auth=JWTAuth()
)
def get_user_conversations_list(request: HttpRequest):
    conversations = Conversation.objects.filter(user=request.auth).values(
        "id", "conversation_title"
    )
    print(conversations)
    return [
        ConversationListResponseSchema(
            conversation_id=conversation["id"],
            conversation_title=conversation["conversation_title"],
        )
        for conversation in conversations
    ]


@conversation.get(
    "/{conversation_id}/", response={200: SelectedConversationSchema}, auth=JWTAuth()
)
def get_conversation(request: HttpRequest, conversation_id: UUID):
    conversation = get_object_or_404(
        Conversation, id=conversation_id, user=request.auth
    )
    return SelectedConversationSchema(
        conversation_id=conversation.id, history=conversation.history
    )


@conversation.delete(
    "/{conversation_id}/", response={200: GenericSchema}, auth=JWTAuth()
)
def delete_conversation(request: HttpRequest, conversation_id: UUID):
    conversation = get_object_or_404(
        Conversation, id=conversation_id, user=request.auth
    )
    conversation.delete()
    return GenericSchema(detail="Conversation deleted successfully")

   
@rag_collection.get(
    "/list/", response={200: list[RAGCollectionListSchema]}, auth=JWTAuth()
)
def list_user_rag_collections(request: HttpRequest):
    user = request.auth
    rag_collections = RAGCollection.objects.filter(user=user).prefetch_related(
        "documents"
    )
    return [
        RAGCollectionListSchema(
            id=rag_collection.id,
            rag_collection_name=rag_collection.rag_collection_name,
            documents=rag_collection.documents.all(),
        )
        for rag_collection in rag_collections
    ]


@rag_collection.post(
    "/", response={200: GenericSchema, 400: GenericSchema}, auth=JWTAuth()
)
def create_rag_collection(
    request: HttpRequest,
    data: CreateRAGCollectionSchema,
    files: List[UploadedFile] = File(...),
):
    try:
        user = request.auth

        # Validate documents before creating collection
        is_valid, error_message = validate_documents(files)
        if not is_valid:
            return 400, GenericSchema(detail=error_message)
        
        exits_rag_collection = RAGCollection.objects.filter(rag_collection_name=data.rag_collection_name, user=user).exists()
        if exits_rag_collection:
            return 400, GenericSchema(detail="RAG collection already exists. Please use a different name.")

        with transaction.atomic():
            rag_collection = RAGCollection.objects.create(
                rag_collection_name=data.rag_collection_name, user=user
            )
            for file in files:
                RAGDocument.objects.create(
                    rag_collection=rag_collection,
                    original_document_name=file.name,
                    document_path=file,
                    is_indexed=False,
                )

        return 200, GenericSchema(detail="RAG collection created successfully")

    except Exception as e:
        return 400, GenericSchema(detail=f"Error creating RAG collection: {str(e)}")

@rag_collection.put(
    "/{rag_collection_id}/", response={200: GenericSchema, 400: GenericSchema}, auth=JWTAuth()
)
def update_rag_collection(request: HttpRequest, rag_collection_id: int,files: List[UploadedFile] = File(...)):
        rag_collection = get_object_or_404(
            RAGCollection, id=rag_collection_id, user=request.auth
        )
        is_valid, error_message = validate_documents(files)
        if not is_valid:
            return 400, GenericSchema(detail=error_message)           
        with transaction.atomic():
            for file in files:
                RAGDocument.objects.create(
                    rag_collection=rag_collection,
                    original_document_name=file.name,
                    document_path=file,
                    is_indexed=False,
                )
        return 200, GenericSchema(detail="RAG collection updated successfully")

@rag_collection.get(
    "/start-indexing/{rag_collection_id}/",
    response={200: GenericSchema},
    auth=JWTAuth(),
)
def start_indexing(request: HttpRequest, rag_collection_id: int):
    rag_collection = get_object_or_404(
        RAGCollection, id=rag_collection_id, user=request.auth
    )
    is_all_documents_indexed = (
        rag_collection.documents.all().filter(is_indexed=False).count() == 0
    )

    if is_all_documents_indexed:
        return GenericSchema(detail="All documents are already indexed")

    # start indexing unindexed documents in background
    start_indexing_documents.delay(rag_collection_id)

    return GenericSchema(detail="Indexing started successfully")

