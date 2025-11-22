from typing import Union, List, Dict, Any
import os
from ninja import UploadedFile

from langchain_core.messages import HumanMessage, AIMessage

from chat.schema import MessageSchema


def build_messages_from_history(
    history: Union[List[MessageSchema], List[Dict[str, Any]]], prompt: str
) -> list:
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


def validate_documents(files: List[UploadedFile]) -> tuple[bool, str]:
    MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB in bytes
    # Check if any files were provided
    if not files:
        return False, "No files provided. Please upload at least one PDF document."

    for file in files:

        if not file.name:
            return (
                False,
                "One or more files have no name. Please ensure all files have proper names.",
            )

        if not file.name.lower().endswith(".pdf"):
            return (
                False,
                f"File '{file.name}' is not a PDF. Only PDF files are allowed.",
            )

        # Check file size
        try:
            file.seek(0, os.SEEK_END)  # Seek to end to get file size
            file_size = file.tell()
            file.seek(0)  # Reset file pointer to beginning

            if file_size > MAX_FILE_SIZE:
                return (
                    False,
                    f"File '{file.name}' is {file_size / (1024 * 1024):.2f}MB, which exceeds the 100MB limit.",
                )

        except Exception as e:
            return False, f"Error reading file '{file.name}': {str(e)}"

    return True, ""


def build_rag_system_message(context_text: str) -> str:
    return f"""You are a helpful assistant. You have access to the following context. 

IMPORTANT: You MUST use the information from the context below to answer the user's questions.
{context_text}

Instructions:
- Answer questions based on the context provided above
- Be specific and reference details from the context
- If the answer is not in the context, say "I don't have that information in the provided context"
- Do not make up information that is not in the context"""
