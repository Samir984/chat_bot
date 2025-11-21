from chat_bot.env import ENV
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance, VectorParams
from chat.embedding_mode import embeddings_model as embeddings


qdrant_client = QdrantClient(host=ENV.QDRANT_HOST, port=ENV.QDRANT_PORT)


def get_or_create_vector_store(qdrant_collection_name: str):
    if qdrant_client.collection_exists(collection_name=qdrant_collection_name):
        return QdrantVectorStore(
            client=qdrant_client,
            collection_name=qdrant_collection_name,
            embedding=embeddings,
        )
    else:
        qdrant_client.create_collection(
            collection_name=qdrant_collection_name,
            vectors_config=VectorParams(size=3072, distance=Distance.COSINE),
        )

        return QdrantVectorStore(
            client=qdrant_client,
            collection_name=qdrant_collection_name,
            embedding=embeddings,
        )
