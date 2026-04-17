import { openai } from "../../infrastructure/llm/openai.client";
import { RagService } from "../../rag/rag.service";

export class SupportWorker {
    name = "support";

    async run(message: string, userId: string, requestId: string): Promise<string> {

        const ragContext = await RagService.search(message);

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are a Support Agent.

Use this knowledge base:
${ragContext}

Rules:
- Be helpful and clear
- Keep answers short
          `,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        return response.choices[0]?.message?.content || "";
    }
}