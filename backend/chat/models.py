from enum import unique
import uuid
import os
from django.db import models
from django.contrib.auth import get_user_model


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
    original_document_name = models.CharField(max_length=255, default="")
    unique_document_name = models.CharField(max_length=255,unique=True)

    
    def _upload_path_filename(self, filename: str):
        print("filename",filename)
        return f"rag_documents/{self.rag_collection.rag_collection_name}/{self.unique_document_name}"
    
    def save(self, *args, **kwargs):
       if not self.unique_document_name:
            base, ext = os.path.splitext(self.original_document_name or "document")
            self.unique_document_name = f"{base}_{uuid.uuid4().hex}{ext}"
       super().save(*args, **kwargs)

    document_path = models.FileField(upload_to=_upload_path_filename)
    is_indexed = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.document_path}"
