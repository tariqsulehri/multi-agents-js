import { openai } from "../../infrastructure/llm/openai.client";

/**
 * TOOL ROUTER (HYBRID)
 * Layer 1: Rule Engine (fast + deterministic)
 * Layer 2: LLM Router (fallback intelligence)
 */

export class ToolRouter {
    async decide(message: string) {
        // =========================
        // ⚡ LAYER 1: RULE ENGINE
        // =========================
        const ruleResult = this.ruleEngine(message);

        if (ruleResult) {
            console.log("⚡ ToolRouter: Rule matched:", ruleResult);
            return ruleResult;
        }

        // =========================
        // 🧠 LAYER 2: LLM ROUTER
        // =========================
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are a strict tool routing engine.

RULES:
- Output ONLY valid JSON
- No explanation
- No markdown
- No extra text

AVAILABLE TOOLS:
- get_order(orderId)
- create_order(items, userId)

FORMAT:
{"tool":"get_order","arguments":{"orderId":"123"}}
OR
{"tool":null}
          `,
                },
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        const content = response.choices[0]?.message?.content || "";

        return this.safeParse(content);
    }

    /**
     * =========================
     * ⚡ RULE ENGINE (FAST PATH)
     * =========================
     */
    private ruleEngine(message: string) {
        const msg = message.toLowerCase();

        // 🍕 create order
        if (
            (msg.includes("buy") || msg.includes("want") || msg.includes("order")) &&
            (msg.includes("pizza") || msg.includes("food"))
        ) {
            return {
                tool: "create_order",
                arguments: {
                    userId: "user-1",
                    items: ["pizza"],
                },
            };
        }

        // 📦 check order
        if (msg.includes("check") && msg.includes("order")) {
            return {
                tool: "get_order",
                arguments: {
                    orderId: "123",
                },
            };
        }

        // 🕒 FAQ TIMINGS (THIS WAS MISSING)
        if (
            msg.includes("timing") ||
            msg.includes("timings") ||
            msg.includes("open") ||
            msg.includes("hours") ||
            msg.includes("when are you open") ||
            msg.includes("delivery time")
        ) {
            return {
                tool: "faq",
                arguments: {
                    type: "timings",
                },
            };
        }
        return null;
    }

    /**
     * =========================
     * 🧠 SAFE JSON PARSER
     * =========================
     */
    private safeParse(text: string) {
        try {
            return JSON.parse(text);
        } catch {
            const match = text.match(/\{[\s\S]*\}/);
            if (match) {
                try {
                    return JSON.parse(match[0]);
                } catch {
                    return { tool: null };
                }
            }
            return { tool: null };
        }
    }

    /**
     * =========================
     * 🧩 HELPERS
     * =========================
     */

    private extractOrderId(message: string): string | null {
        const match = message.match(/\d+/);
        return match ? match[0] : null;
    }

    private extractItems(message: string): string[] {
        if (message.includes("pizza")) return ["pizza"];
        if (message.includes("burger")) return ["burger"];
        if (message.includes("food")) return ["food"];
        return ["unknown"];
    }
}