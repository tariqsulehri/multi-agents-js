import { BaseAgent } from "../base.agent";

export class SupportAgent extends BaseAgent {
  name = "SupportAgent";

  systemPrompt = `
You are a Customer Support AI Agent.

Your job:
- Answer FAQs
- Help users with issues
- Be polite and helpful
- Keep answers short and clear
`;
}