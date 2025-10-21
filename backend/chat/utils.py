from langchain_core.messages import HumanMessage, AIMessage
from chat.schema import MessageSchema
from typing import Union, List, Dict, Any


def build_messages_from_history(history: Union[List[MessageSchema], List[Dict[str, Any]]], prompt: str) -> list:
    messages = []
    
    for history_item in history:
        # Handle both ChatHistorySchema objects and dict objects from JSON
        if isinstance(history_item, dict):
            # JSON data from database
            role = history_item.get("role")
            content = history_item.get("content")
        else:
            # ChatHistorySchema object from API
            role = history_item.role
            content = history_item.content
        
        if role == "user":
            messages.append(HumanMessage(content=content))
        else:
            messages.append(AIMessage(content=content))
    
    messages.append(HumanMessage(content=prompt))
    
    return messages
