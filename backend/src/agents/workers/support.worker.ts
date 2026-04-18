import { openai } from "../../infrastructure/llm/openai.client";
import { EventBus } from "../../events/event.bus";
import { EVENTS } from "../../events/events.constants";

export class SupportWorker {
    name = "support";

    constructor() {
        EventBus.subscribe(EVENTS.AGENT_EXECUTE, async (payload) => {
            try {
                if (!payload || payload.agent !== this.name) return;

                // ⏱ START TIMER
                const start = Date.now();

                const result = await this.run(
                    payload.message,
                    payload.userId,
                    payload.requestId
                );

                // ⏱ END TIMER
                const duration = Date.now() - start;

                console.log(
                    `🤖 SUPPORT WORKER DONE | requestId=${payload.requestId} | time=${duration}ms`
                );

                await EventBus.publish(EVENTS.AGENT_RESPONSE, {
                    requestId: payload.requestId,
                    agent: this.name,
                    response: result || "No response generated",
                });

            } catch (error) {
                console.error("❌ SupportWorker Error:", error);

                await EventBus.publish(EVENTS.AGENT_RESPONSE, {
                    requestId: payload?.requestId,
                    agent: this.name,
                    response: "Support worker failed to process request",
                });
            }
        });
    }

    async run(
        message: string,
        userId: string,
        requestId: string
    ): Promise<string> {

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are a customer support agent.

Handle:
- complaints
- refunds
- account issues
- delivery issues
- general support

Be polite, concise, and solution-oriented.
                    `,
                },
                {
                    role: "user",
                    content: message || "",
                },
            ],
        });

        return (
            response.choices[0]?.message?.content ||
            "Support response unavailable"
        );
    }
}