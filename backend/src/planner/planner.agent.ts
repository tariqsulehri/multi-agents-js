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
You are a planning agent for a business AI workflow system.

Your job is to decide the BUSINESS INTENT.

IMPORTANT:
Return business intent names, NOT worker names.

Valid intents:

1. order_food
- user wants pizza
- user wants burger
- buying food
- placing an order
- purchase intent

2. check_order
- check order status
- where is my order
- track my order
- order status

3. faq
- timings
- opening hours
- delivery time
- business hours
- general information
- FAQ related questions

4. support
- complaints
- refund requests
- account problems
- delivery issues
- customer complaints

RULES (VERY IMPORTANT):
- "I want pizza" → order_food
- "Check order 123" → check_order
- "What are your timings?" → faq
- "Delivery time?" → faq
- "I want refund" → support

If multiple intents exist, return multiple:

Example:
["order_food", "faq"]

Return ONLY JSON array.

Example:
["faq"]
                    `,
                },
                {
                    role: "user",
                    content: String(message),
                },
            ],
        });

        const text = response.choices[0]?.message?.content || "[]";

        console.log("🧠 PLANNER RAW RESPONSE:", text);

        try {
            return JSON.parse(text);
        } catch (error) {
            console.log("❌ Planner parse failed:", error);

            // safer fallback
            return ["faq"];
        }
    }
}