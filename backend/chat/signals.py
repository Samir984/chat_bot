from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import RAGDocument

@receiver(post_delete, sender=RAGDocument)
def delete_rag_document_file(sender, instance, **kwargs):
    if instance.document_path:
        instance.document_path.delete(save=False)
