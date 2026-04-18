import { Queue } from "bullmq";
import { redis } from "./redis.connection";

export const AgentQueue = new Queue("agent-execution", {
    connection: redis,
});