from langchain_google_genai import ChatGoogleGenerativeAI
from chat_bot.env import ENV

llm_model = ChatGoogleGenerativeAI(
    model=ENV.AI_MODEL,
    google_api_key=ENV.GEMENI_API_KEY,
    api_key=ENV.GEMENI_API_KEY,
    temperature=0.7,
)
