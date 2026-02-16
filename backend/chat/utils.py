from typing import Union, List, Dict, Any
import os
import json
from ninja import UploadedFile
from chat.llm_service import llm_model
from chat.models import Conversation

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


def validate_documents(
    files: List[UploadedFile], allow_empty: bool = False
) -> tuple[bool, str]:
    MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB in bytes
    # Check if any files were provided
    if not files and not allow_empty:
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


dummy_ai_essay = """
The Industrial Revolution, which began in Great Britain in the late 18th century, was a period of profound technological, socioeconomic, and cultural change that fundamentally reshaped human society. Driven by a confluence of factors including abundant natural resources, technological innovation, and favorable economic conditions, this era witnessed the mechanization of production, the rise of the factory system, and the mass migration of populations from rural areas to burgeoning urban centers. The introduction of steam power, the development of the power loom, and advancements in iron production catalyzed unprecedented levels of productivity, transforming manufacturing processes and laying the groundwork for modern industrial capitalism. While the Industrial Revolution spurred economic growth and technological progress, it also gave rise to significant social challenges, including harsh working conditions, child labor, and widening economic disparities, prompting debates about labor rights, social welfare, and the role of government in regulating industry that continue to resonate today. The legacy of this transformative period extends far beyond its immediate impact, shaping global economic structures, environmental challenges, and the very fabric of contemporary. Computer is really great invention. 
However, this immense power is not without its shadow. The rise of the computer has brought with it significant societal challenges. The "digital divide" highlights inequalities in access to technology, exacerbating existing disparities. Concerns about privacy and cybersecurity are paramount, as personal data becomes a valuable commodity and systems are vulnerable to malicious attacks. The proliferation of information also brings the challenge of misinformation and the echo chambers of social media. Furthermore, as artificial intelligence (AI), a product of advanced computing, continues to evolve, ethical questions surrounding job displacement, algorithmic bias, and autonomous decision-making become increasingly pressing.
"""
import time


def stream_llm_response(
    messages: list, user, prompt, conversation_id=None, no_store=False
):
    full_llm_reponse = ""
    try:
        for chunk in llm_model.stream(messages, max_retries=0):
            print(chunk)
            full_llm_reponse += chunk.content
            yield f"data: {json.dumps({'type': 'content', 'content': chunk.content})}\n\n"

        # splited_text = [
        #     dummy_ai_essay[i : i + 50] for i in range(0, len(dummy_ai_essay), 50)
        # ]
        # for chunk in splited_text:
        #     print(chunk)
        #     full_llm_reponse += chunk
        #     # wait 300 ms
        #     time.sleep(0.3)

        #     yield f"data: {json.dumps({'type': 'content', 'content': chunk})}\n\n"

        if full_llm_reponse and not no_store:
            conversation = Conversation.update_or_create_conversation(
                user=user,
                prompt=prompt,
                full_response=full_llm_reponse,
                conversation_id=conversation_id,
            )
            yield f"data: {json.dumps({'type': 'end', 'conversation_id': str(conversation.id)})}\n\n"
        else:
            yield f"data: {json.dumps({'type': 'end', 'conversation_id': conversation_id})}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'type': 'error', 'error': str(e)})}\n\n"


def build_rag_system_message(context_text: str) -> str:
    return f"""You are a helpful assistant. You have access to the following context. 

IMPORTANT: You MUST use the information from the context below to answer the user's questions.
{context_text}

Instructions:
- Answer questions based on the context provided above
- Be specific and reference details from the context
- If the answer is not in the context, say "I don't have that information in the provided context"
- Do not make up information that is not in the context"""
