import { AgentOrchestratorV2 } from "../orchestrator-v2/agent.orchestrator";

const orchestrator = new AgentOrchestratorV2();

export const handleChat = async (req, res) => {
    const { message, userId } = req.body;

    if (!message || !userId) {
        return res.status(400).json({ error: "message and userId are required" });
    }

    try {
        const response = await orchestrator.execute(message, userId);
        res.json({ response });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};