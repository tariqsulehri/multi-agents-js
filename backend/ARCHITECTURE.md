# Multi-Agent Services Architecture

This project is a modular, AI-driven multi-agent backend designed for specialized task handling (Sales, Support, etc.) with memory and knowledge retrieval capabilities.

## 🏗️ System Overview

The system follows a typical layered architecture but with specific AI components:

### 1. 📂 Agents (`src/agents/`)
Specialized AI entities with their own personality and knowledge constraints.
- **BaseAgent**: Abstract class providing the core logic loop (Memory -> RAG -> execution -> Save Memory).
- **SalesAgent**: Optimized for conversions and order taking.
- **SupportAgent**: Optimized for helpfulness and FAQ matching.

### 2. 🧠 Orchestrator (`src/orchistrator/`)
- **AgentRouter**: Acts as the "Brain's Gatekeeper". It uses a fast LLM (GPT-4o-mini) to analyze incoming user intent and decide which specialized agent should handle the reply.

### 3. 🛠️ Core Services (`src/core/`)
- **MemoryService**: Manages short-term conversational history. Uses a sliding window (last 20 messages) to keep context relevant and prompt size manageable.
- **ToolRegistry**: A plugin-based system where agents can register and execute functions (like `getOrder`).

### 4. 📚 RAG (`src/rag/`)
- **RagService**: Retrieval-Augmented Generation. Currently provides static knowledge context but is structured to integrate with Vector Databases (Pinecone/Milvus) in the future.

### 5. 🔌 Infrastructure (`src/infrastructure/`)
- **OpenAI Client**: Standardized configuration for LLM access.
- **Redis Client**: Persistence layer for memory. Currently running an **In-Memory Mock** for easy local development.

---

## 🚀 Execution Flow

1. **Request**: User sends a message via `POST /api/chat`.
2. **Analysis**: `AgentRouter` decides the intent (e.g., "This sounds like a sales question").
3. **Context**: The selected Agent fetches the last messages from `MemoryService` and relevant facts from `RagService`.
4. **Inference**: Agent sends the full contextual prompt to OpenAI.
5. **Persistence**: Agent saves the response to `MemoryService` and returns the reply to the user.

---

## 🛠️ Setup & Running

1. **Install Dependencies**: `npm install`
2. **ENV Configuration**: Ensure `.env` has your `OPENAI_API_KEY`.
3. **Run Dev Server**: `npm run dev`
