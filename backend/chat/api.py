from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from typing import List
import os

from uuid import UUID
from ninja import  Router, UploadedFile, File, Form
from ninja_jwt.authentication import JWTAuth
from chat.models import Conversation, RAGCollection, RAGDocument
from chat.schema import CreateRAGCollectionSchema, RAGCollectionListSchema

from chat_bot.settings import model
from chat.schema import PublicChatRequestSchema, ChatResponseSchema, ChatRequestSchema, GenericSchema, SelectedConversationSchema, ConversationListResponseSchema               
from chat.utils import build_messages_from_history, validate_documents  


chat = Router()
conversation = Router()
rag_collection = Router()

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


@conversation.get("/list/", response={200: list[ConversationListResponseSchema]},auth=JWTAuth())
def get_user_conversations_list(request: HttpRequest):
    conversations = Conversation.objects.filter(user=request.auth).values("id", "conversation_title")
    print(conversations)
    return [ConversationListResponseSchema(conversation_id=conversation["id"], conversation_title=conversation["conversation_title"]) for conversation in conversations]
   

@conversation.get("/{conversation_id}/", response={200: SelectedConversationSchema}, auth=JWTAuth())
def get_conversation(request: HttpRequest, conversation_id: UUID):
    conversation = get_object_or_404(Conversation, id=conversation_id, user=request.auth)
    return SelectedConversationSchema(conversation_id=conversation.id, history=conversation.history)

@conversation.delete("/{conversation_id}/", response={200: GenericSchema}, auth=JWTAuth())
def delete_conversation(request: HttpRequest, conversation_id: UUID):
    conversation = get_object_or_404(Conversation, id=conversation_id, user=request.auth)
    conversation.delete()
    return GenericSchema(detail="Conversation deleted successfully")


@rag_collection.post("/", response={200: GenericSchema, 400: GenericSchema}, auth=JWTAuth())
def create_rag_collection(request: HttpRequest, data: CreateRAGCollectionSchema, files: List[UploadedFile] = File(...)):
    try:
        user = request.auth  
        
        # Validate documents before creating collection
        is_valid, error_message = validate_documents(files)
        if not is_valid:
            return 400, GenericSchema(detail=error_message)
         
        rag_collection = RAGCollection.objects.create(
            rag_collection_name=data.rag_collection_name,
            user=user
        )
        
        documents_created = []
        for file in files:
            rag_document = RAGDocument.objects.create(
                rag_collection=rag_collection,
                document_name=file.name,
                document_path=file,
                is_indexed=False 
            )
            documents_created.append(rag_document)
        
        return 200, GenericSchema(detail="RAG collection created successfully")
        
    except Exception as e:
        return 400, GenericSchema(detail=f"Error creating RAG collection: {str(e)}")


@rag_collection.get("/list/", response={200: list[RAGCollectionListSchema]}, auth=JWTAuth())
def list_user_rag_collections(request: HttpRequest):
    user = request.auth
    rag_collections = RAGCollection.objects.filter(user=user).prefetch_related('documents')
    return [RAGCollectionListSchema(id=rag_collection.id, rag_collection_name=rag_collection.rag_collection_name, documents=rag_collection.documents.all()) for rag_collection in rag_collections]
        
        
@rag_collection.get("/start-indexing/{rag_collection_id}/", response={200: GenericSchema}, auth=JWTAuth())
def start_indexing(request: HttpRequest, rag_collection_id: int):
    rag_collection = get_object_or_404(RAGCollection, id=rag_collection_id, user=request.auth).prefetch_related('documents')
    is_all_documents_indexed = rag_collection.documents.all().filter(is_indexed=False).count() == 0

    if is_all_documents_indexed:
        return GenericSchema(detail="All documents are already indexed")
    
    for document in rag_collection.documents.all():
        document.is_indexed = True
        document.save()
    
    return GenericSchema(detail="Indexing started successfully")