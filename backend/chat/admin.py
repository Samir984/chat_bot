from django.contrib import admin
from chat.models import Conversation
# Register your models here.

@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'conversation_title', 'user', 'date_created', 'date_modified']
   