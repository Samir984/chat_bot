from django.contrib import admin
from chat.models import Conversation, RAGCollection, RAGDocument

# Register your models here.


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ["id", "conversation_title", "user", "date_created", "date_modified"]


@admin.register(RAGCollection)
class RAGCollectionAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "rag_collection_name",
        "user",
        "date_created",
        "date_modified",
    ]


@admin.register(RAGDocument)
class RAGDocumentAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "rag_collection",
        "document_name",
        "document_path",
        "is_indexed",
        "date_created",
    ]
