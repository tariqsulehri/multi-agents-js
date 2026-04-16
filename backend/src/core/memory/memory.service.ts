import { redis } from "../../infrastructure/cache/redis.client";

/**
 * Service responsible for managing conversational memory.
 * Stores and retrieves historical messages to maintain context across turns.
 */
export class MemoryService {
    /**
     * Generates a unique cache key for a user's chat memory.
     * @param userId - Unique identifier for the user.
     */
    private static getKey(userId: string) {
        return `chat:memory:${userId}`;
    }

    /**
     * Appends a new message to the user's history and manages the history window size.
     * 
     * @param userId - Unique identifier for the user.
     * @param message - The content of the message.
     * @param role - Whether the message is from the 'user' or the 'assistant'.
     */
    static async saveMessage(userId: string, message: string, role: "user" | "assistant") {
        const key = this.getKey(userId);

        // Append message to the list (Right Push)
        await redis.rpush(
            key,
            JSON.stringify({ role, message, timestamp: Date.now() })
        );

        // Sliding window: keep only the last 20 messages for prompt efficiency and rate limits
        await redis.ltrim(key, -20, -1);
    }

    /**
     * Retrieves the entire historical message list for a specific user.
     * 
     * @param userId - Unique identifier for the user.
     * @returns An array of parsed message objects.
     */
    static async getHistory(userId: string) {
        const key = this.getKey(userId);

        // Fetch all elements in the list
        const messages = await redis.lrange(key, 0, -1);

        return messages.map((m) => JSON.parse(m));
    }
}