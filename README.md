# Agentic RAG

A powerful Request-Augmented Generation (RAG) chatbot application that allows users to create knowledge collections, upload documents, and chat with an AI that understands the context of your data.

## 🚀 Features

- **RAG Collections**: Create and manage multiple collections of documents.
- **Document Indexing**: Upload PDFs and automatically index them for efficient retrieval.
- **Contextual Chat**: Chat with an AI (Google Gemini) that retrieves relevant information from your uploaded documents.
- **Vector Search**: Uses Qdrant for high-performance vector similarity search.
- **Authentication**: Secure user authentication using JWT stored in HttpOnly cookies.
- **Conversation History**: Automatically saves chat history for specialized sessions.
- **Asynchronous Processing**: Background tasks for document indexing using Celery and Redis.

## 🛠️ Tech Stack

### Backend

- **Framework**: Django 5, Django Ninja
- **Database**: PostgreSQL
- **Vector DB**: Qdrant
- **Task Queue**: Celery & Redis
- **AI/LLM**: LangChain, Google Gemini Pro, Google Embeddings
- **Storage**: AWS S3 (via Boto3)

### Frontend

- **Framework**: React 19, Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS 4, Radix UI

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Python 3.10+
- Node.js 18+
- PostgreSQL
- Redis
- Qdrant (via Docker recommended)

## 🏗️ Installation & Setup

### Backend Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd chat_bot/backend
    ```

2.  **Create and activate a virtual environment:**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Environment Variables:**
    Copy `.sample.env` to `.env` and fill in your details:

    ```bash
    cp .sample.env .env
    ```

    - Set `GEMENI_API_KEY` for AI features.
    - Configure `POSTGRES_...` for your local database.
    - Configure `QDRANT_...` and `REDIS_...`.
    - Set AWS credentials if using S3 storage.

5.  **Run Migrations:**

    ```bash
    python manage.py migrate
    ```

6.  **Start Services (Docker):**
    Ensure Redis and Qdrant are running.

    ```bash
    docker run -p 6379:6379 redis
    docker run -p 6333:6333 qdrant/qdrant
    ```

7.  **Run Celery Worker:**

    ```bash
    celery -A chat_bot worker -l info
    ```

8.  **Run Django Development Server:**
    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1.  **Navigate to the frontend directory:**

    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn
    ```

3.  **Run Development Server:**
    ```bash
    npm run dev
    ```

The application should now be accessible at `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
