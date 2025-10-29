from chat_bot.env import ENV
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from chat.embedding_mode import embeddings_model as embeddings


qdrant_client = QdrantClient(":memory:")

vector_store = QdrantVectorStore(
    client=qdrant_client,
    collection_name=ENV.QDRANT_COLLECTION_NAME,
    embedding=embeddings,
)

qdrant_client.create_collection(
    collection_name=ENV.QDRANT_COLLECTION_NAME,
    vectors_config=VectorParams(size=3072, distance=Distance.COSINE),
)
