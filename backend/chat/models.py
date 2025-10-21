from django.db import models
from django.contrib.auth import get_user_model
import uuid
from chat.choices import RoleChoices
User = get_user_model()

class Conversation(models.Model):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False)
    conversation_title = models.CharField(max_length=255,default="")
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    history = models.JSONField(default=list)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)


    def __str__(self):
        return f'{self.conversation_title} Created by - {self.user.first_name}'
