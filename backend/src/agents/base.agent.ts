import { openai } from "../infrastructure/llm/openai.client";
import { MemoryService } from "../core/memory/memory.service";
import { RagService } from "../rag/rag.service";

/**
 * Abstract Base Class for all AI Agents.
 * Provides a common execution flow including memory management and knowledge retrieval.
 */
export abstract class BaseAgent {
    /** Unique identifier for the agent (e.g., "SalesAgent", "SupportAgent") */
    abstract name: string;
    
    /** The core instructions that define the agent's behavior and personality */
    abstract systemPrompt: string;

    /**
     * Executes the agent's logic for a given user message.
     * 1. Retrieves user chat history.
     * 2. Fetches relevant knowledge using RAG.
     * 3. Constructs the full LLM prompt.
     * 4. Calls OpenAI and saves the new messages to memory.
     * 
     * @param message - The user's input string.
     * @param userId - Unique ID for the user to track session history.
     * @returns The AI's response string.
     */
    async execute(message: string, userId: string): Promise<string> {
        // Fetch short-term memory (last messages)
        const history = await MemoryService.getHistory(userId);
        
        // Fetch long-term knowledge based on the user's query
        const context = await RagService.search(message);

        // Construct the prompt sequence for the LLM
        const messages: any[] = [
            { 
                role: "system", 
                content: `${this.systemPrompt}\n\nContextual Knowledge:\n${context}` 
            },

            // Inject conversational history
            ...history.map((h: any) => ({
                role: h.role,
                content: h.message,
            })),

            // Current user query
            { role: "user", content: message },
        ];

        // Perform the LLM inference
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
        });

        const reply = response.choices[0]?.message?.content || "";

        // Persist the interaction in memory for future turns
        await MemoryService.saveMessage(userId, message, "user");
        await MemoryService.saveMessage(userId, reply, "assistant");

        // Debug logging for development
        console.log(`[${this.name}] History count:`, history.length);
        console.log(`[${this.name}] Context injected:`, context.length > 0);

        return reply;
    }
}