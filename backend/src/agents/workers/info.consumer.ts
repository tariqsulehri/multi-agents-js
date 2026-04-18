import { Worker } from "bullmq";
import { redis } from "../../queue/redis.connection";
import { ResponseCollector } from "../../events/response.collector";

const collector = new ResponseCollector();

new Worker(
    "agent-execution",
    async (job) => {
        const payload = job.data;

        if (payload.agent !== "info") return;

        const start = Date.now();

        console.log("🔥 INFO CONSUMER ACTIVE:", payload);

        let result = "Information unavailable.";

        const msg = String(payload.message || "").toLowerCase();

        if (
            msg.includes("timing") ||
            msg.includes("open") ||
            msg.includes("hours")
        ) {
            result = "We are open daily from 10 AM to 11 PM.";
        }

        if (msg.includes("delivery")) {
            result = "Delivery time is usually 25–40 minutes.";
        }

        await collector.add(payload.requestId, {
            agent: "info",
            response: result,
        });

        const duration = Date.now() - start;

        console.log(
            `🤖 INFO CONSUMER DONE | requestId=${payload.requestId} | time=${duration}ms`
        );
    },
    {
        connection: redis,
    }
);