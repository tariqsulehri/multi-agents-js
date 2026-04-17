import { ToolRegistry } from "./tool.registry";

export class ToolExecutor {
    async execute(toolName: string, args: any) {
        const tool = ToolRegistry.get(toolName);

        if (!tool) {
            throw new Error(`Tool not found: ${toolName}`);
        }

        return await tool.execute(args);
    }
}