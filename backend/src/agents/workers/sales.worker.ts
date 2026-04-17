import { openai } from "../../infrastructure/llm/openai.client";
import { RagService } from "../../rag/rag.service";
import { ToolRouter } from "../../core/tools/tool.router";
import { ToolExecutor } from "../../core/tools/tool.executor";
import { ResponseCollector } from "../../orchestrator-v2/response.collector";

export class SalesWorker {
    name = "sales";

    private toolRouter = new ToolRouter();
    private toolExecutor = new ToolExecutor();

    async run(
        message: string,
        userId: string,
        requestId: string,
        collector: ResponseCollector
    ): Promise<void> {

        // 1. Fetch knowledge from RAG
        const ragContext = await RagService.search(message) || "";

        // 2. Decide and Execute Tools
        const toolDecision = await this.toolRouter.decide(message);
        let toolResult = "";

        if (toolDecision.tool) {
            try {
                const result = await this.toolExecutor.execute(
                    toolDecision.tool,
                    toolDecision.arguments
                );
                toolResult = JSON.stringify(result);
            } catch (error) {
                console.error(`[SalesWorker] Tool execution failed:`, error);
                toolResult = "Error: Could not retrieve data from tool.";
            }
        }

        // 3. Generate Final Response with LLM
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are a Sales Agent.

KNOWLEDGE (RAG):
${safeString(ragContext)}

TOOL RESULT (TRUTH - MUST BE USED):
${safeString(toolResult)}

IMPORTANT:
- If a TOOL RESULT is provided, it is the absolute truth.
- Use the data from TOOL RESULT to answer the user's question accurately.
- If no tool result or RAG info is found, use your general knowledge but be honest.
        `,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        const finalResponse = response.choices[0]?.message?.content || "";

        console.log(`[SalesWorker] Execution Complete for Request: ${requestId}`);
        console.log(`- Tool Used: ${toolDecision.tool || "none"}`);
        console.log(`- Final Response Length: ${finalResponse.length}`);

        // 4. Collect results for aggregation
        collector.add(requestId, finalResponse);
    }
}

function safeString(value: any) {
    if (!value) return "";
    return String(value);
}