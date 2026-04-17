import { openai } from "../infrastructure/llm/openai.client";

export class PlannerAgent {
    async plan(message: string): Promise<string[]> {
        if (!message || message.trim() === "") {
            return [];
        }

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are a planning agent for a business AI system.

Decide which agent should handle the request.

Agents:

1. sales:
- ordering food
- buy / purchase intent
- create order
- upsell
- pizza, burger, food orders

2. support:
- complaints
- refunds
- issues
- account problems
- order not delivered

3. info:
- timings / opening hours
- delivery time
- menu questions
- general business information
- FAQs

RULES (VERY IMPORTANT):
- "order", "buy", "want pizza" → sales
- "check order", "order status" → sales
- "complaint", "refund" → support
- "timing", "hours", "delivery time", "when open" → info

If multiple intents exist, return multiple agents:
["sales", "info"]

Return ONLY JSON array:
["sales"]
`,
                },
                {
                    role: "user",
                    content: String(message),
                },
            ],
        });


        const text = response.choices[0]?.message?.content || "[]";

        try {
            return JSON.parse(text);
        } catch (e) {
            return ["info"];
        }
    }
}