from django.db import models
from django.contrib.auth import get_user_model
import uuid
from chat.choices import RoleChoices

User = get_user_model()


class Conversation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation_title = models.CharField(max_length=255, default="")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    history = models.JSONField(default=list)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date_created"]

    def __str__(self):
        return f"{self.conversation_title} Created by - {self.user.first_name}"


class RAGCollection(models.Model):
    rag_collection_name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.rag_collection_name}"


class RAGDocument(models.Model):
    rag_collection = models.ForeignKey(
        RAGCollection, related_name="documents", on_delete=models.CASCADE
    )
    document_name = models.CharField(max_length=255, default="")
    document_path = models.FileField(upload_to="rag_documents/")
    is_indexed = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document_path}"
