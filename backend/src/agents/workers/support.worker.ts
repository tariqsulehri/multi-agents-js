import { openai } from "../../infrastructure/llm/openai.client";

export class SupportWorker {
    name = "support";

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

Help users with:
- complaints
- refunds
- account problems
- delivery issues
- support requests

Be polite and helpful.
                    `,
                },
                {
                    role: "user",
                    content: String(message || ""),
                },
            ],
        });

        return response.choices[0]?.message?.content || "Support response unavailable.";
    }
}