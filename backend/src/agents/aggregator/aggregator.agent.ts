import { openai } from "../../infrastructure/llm/openai.client";

export class AggregatorAgent {
    async combine(responses: string[]): Promise<string> {
        if (!responses.length) {
            return "Sorry, I couldn't process your request.";
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are an aggregation agent.

You will receive multiple agent outputs.

Your job:
- Merge them into ONE clean response
- Remove duplicates
- Make it natural and helpful
- Keep it concise
          `,
                },
                {
                    role: "user",
                    content: JSON.stringify(responses),
                },
            ],
        });

        return response.choices[0]?.message?.content || responses.join("\n");
    }
}