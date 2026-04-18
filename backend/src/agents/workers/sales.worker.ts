import { openai } from "../../infrastructure/llm/openai.client";
import { RagService } from "../../rag/rag.service";
import { ToolRouter } from "../../core/tools/tool.router";
import { ToolExecutor } from "../../core/tools/tool.executor";
import { EventBus } from "../../events/event.bus";
import { EVENTS } from "../../events/events.constants";

export class SalesWorker {
    name = "sales";

    private toolRouter = new ToolRouter();
    private toolExecutor = new ToolExecutor();

    constructor() {
        EventBus.subscribe(EVENTS.AGENT_EXECUTE, async (payload) => {
            try {
                if (!payload || payload.agent !== this.name) return;

                // ⏱ START TIMER (full worker execution)
                const start = Date.now();

                const result = await this.run(
                    payload.message,
                    payload.userId,
                    payload.requestId
                );

                const duration = Date.now() - start;

                console.log(
                    `🤖 SALES WORKER DONE | requestId=${payload.requestId} | time=${duration}ms`
                );

                await EventBus.publish(EVENTS.AGENT_RESPONSE, {
                    requestId: payload.requestId,
                    agent: this.name,
                    response: result || "No response generated",
                });

            } catch (error) {
                console.error("❌ SalesWorker Error:", error);

                await EventBus.publish(EVENTS.AGENT_RESPONSE, {
                    requestId: payload?.requestId,
                    agent: this.name,
                    response: "Sales worker failed to process request",
                });
            }
        });
    }

    async run(
        message: string,
        userId: string,
        requestId: string
    ): Promise<string> {

        // 📚 RAG CONTEXT
        const ragContext = (await RagService.search(message)) || "";

        // 🧠 TOOL DECISION
        const toolDecision = await this.toolRouter.decide(message);

        let toolResult = "";

        // 🧰 TOOL EXECUTION
        if (toolDecision?.tool) {
            try {
                const result = await this.toolExecutor.execute(
                    toolDecision.tool,
                    toolDecision.arguments || {}
                );

                toolResult = JSON.stringify(result || {});
            } catch (err) {
                console.error("❌ Tool Execution Failed:", err);
                toolResult = "";
            }
        }

        console.log("🔥 SALES WORKER ACTIVE");
        console.log("MESSAGE:", message);
        console.log("TOOL RESULT:", toolResult);
        console.log("🧠 TOOL DECISION:", toolDecision);

        // 🤖 FINAL RESPONSE
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are a Sales Agent.

Use this context:

RAG:
${ragContext}

TOOL RESULT (TRUTH - MUST BE USED):
${toolResult}

RULES:
- Always prefer TOOL RESULT when available
- Never say you cannot access data if TOOL RESULT exists
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
            "Sales response unavailable"
        );
    }
}