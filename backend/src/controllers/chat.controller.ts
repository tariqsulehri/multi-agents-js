import { Request, Response } from 'express';
import { agentRouter } from '../orchistrator/agent.router';

export const handleChat = async (req: Request, res: Response) => {
    const { message, userId } = req.body;

    const response = await agentRouter.route(message, userId);

    res.json({ response });
};