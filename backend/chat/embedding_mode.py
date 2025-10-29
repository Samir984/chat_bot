from langchain_google_genai import GoogleGenerativeAIEmbeddings
from chat_bot.env import ENV

embeddings_model = GoogleGenerativeAIEmbeddings(
    model=ENV.EMBEDDING_MODEL,
)