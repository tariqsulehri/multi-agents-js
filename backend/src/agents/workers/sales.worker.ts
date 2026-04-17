import { openai } from "../../infrastructure/llm/openai.client";
import { RagService } from "../../rag/rag.service";
import { ToolRouter } from "../../core/tools/tool.router";
import { ToolExecutor } from "../../core/tools/tool.executor";

export class SalesWorker {
    name = "sales";

    private toolRouter = new ToolRouter();
    private toolExecutor = new ToolExecutor();

    async run(
        message: string,
        userId: string,
        requestId: string
    ): Promise<string> {

        // 📚 RAG CONTEXT
        const ragContext = await RagService.search(message) || "";

        // 🧠 TOOL DECISION
        const toolDecision = await this.toolRouter.decide(message);

        let toolResult = "";

        // 🧰 TOOL EXECUTION
        if (toolDecision?.tool) {
            const result = await this.toolExecutor.execute(
                toolDecision.tool,
                toolDecision.arguments || {}
            );

            toolResult = JSON.stringify(result || {});
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
${String(ragContext || "")}

TOOL RESULT (TRUTH - MUST BE USED):
${String(toolResult || "")}

IMPORTANT RULES:
- If TOOL RESULT exists, use it
- Never say "I cannot access order details" if TOOL RESULT exists
- Always trust tool output
                    `,
                },
                {
                    role: "user",
                    content: String(message || ""),
                },
            ],
        });

        return response.choices[0]?.message?.content || "Sales response unavailable.";
    }
}