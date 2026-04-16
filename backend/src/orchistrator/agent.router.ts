import { openai } from "../infrastructure/llm/openai.client";
import { SalesAgent } from "../agents/sales/sales.agent";
import { SupportAgent } from "../agents/support/support.agent";

/**
 * The Orchestrator / Router of the Multi-Agent System.
 * Its responsibility is to understand the user's intent and delegate the task to the correct specialized agent.
 */
export const agentRouter = {
  /**
   * Routes the user message to the appropriate agent based on an LLM decision.
   * 
   * @param message - The raw user input.
   * @param userId - Unique user identifier for session tracking.
   * @returns The response from the selected agent.
   */
  async route(message: string, userId: string): Promise<string> {

    // 🧠 STEP 1: Intent Analysis (Ask LLM which agent is best suited)
    const decision = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI router for a multi-agent system.
Your goal is to categorize the user's request into one of the specialized agents.

Agents available:
1. sales → Handle food orders, pricing, menu questions, and buying requests.
2. support → Handle general help, complaints, timing, and technical issues.

CRITICAL: Return ONLY the lowercase name of the agent (e.g., 'sales' or 'support').
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Extract the decision and clean up the string
    const agentName = decision.choices[0]?.message?.content?.trim().toLowerCase();

    console.log(`[Router] Routing intent: "${message}" -> Target Agent: ${agentName}`);

    // 🧠 STEP 2: Delivery (Instantiate and execute the chosen agent)
    if (agentName === "sales") {
      return new SalesAgent().execute(message, userId);
    } 
    
    // Default to support if unknown or explicitly support
    if (agentName === "support" || !!agentName) {
        return new SupportAgent().execute(message, userId);
    }

    return "I'm sorry, I couldn't determine how to help with that. Could you please rephrase?";
  },
};