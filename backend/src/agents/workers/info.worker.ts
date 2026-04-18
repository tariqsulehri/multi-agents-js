import { EventBus } from "../../events/event.bus";
import { EVENTS } from "../../events/events.constants";

export class InfoWorker {
    name = "info";

    constructor() {
        EventBus.subscribe(EVENTS.AGENT_EXECUTE, async (payload) => {
            try {
                if (!payload || payload.agent !== this.name) return;

                // ⏱ START TIMER (worker execution start)
                const start = Date.now();

                const result = await this.run(
                    payload.message,
                    payload.userId,
                    payload.requestId
                );

                // ⏱ END TIMER
                const duration = Date.now() - start;

                console.log(
                    `🤖 INFO WORKER DONE | requestId=${payload.requestId} | time=${duration}ms`
                );

                await EventBus.publish(EVENTS.AGENT_RESPONSE, {
                    requestId: payload.requestId,
                    agent: this.name,
                    response: result,
                });

            } catch (error) {
                console.error("❌ InfoWorker Error:", error);

                await EventBus.publish(EVENTS.AGENT_RESPONSE, {
                    requestId: payload?.requestId,
                    agent: this.name,
                    response: "Info worker failed to process request",
                });
            }
        });

        console.log("🟢 INFO WORKER REGISTERED");
    }

    async run(
        message: string,
        userId: string,
        requestId: string
    ): Promise<string> {

        const msg = message.toLowerCase();

        if (msg.includes("timing") || msg.includes("open") || msg.includes("hours")) {
            return "We are open daily from 10 AM to 11 PM.";
        }

        if (msg.includes("delivery")) {
            return "Delivery time is usually 25–40 minutes.";
        }

        return "Information unavailable.";
    }
}