import { Tool } from "./tool.interface";

/**
 * Singleton registry for all executable tools available to the agents.
 * Tools are registered here during application startup.
 */
export class ToolRegistry {
    private static tools: Record<string, Tool> = {};

    /**
     * Registers a new tool in the global registry.
     * @param tool - The tool implementation to register.
     */
    static register(tool: Tool) {
        this.tools[tool.name] = tool;
        console.log(`[ToolRegistry] Registered tool: ${tool.name}`);
    }

    /**
     * Retrieves a tool by its name.
     * @param name - The name of the tool to lookup.
     */
    static get(name: string): Tool | undefined {
        return this.tools[name];
    }

    /**
     * Returns a list of all registered tool definitions for LLM function calling.
     */
    static getAllDefinitions() {
        return Object.values(this.tools).map(t => ({
            name: t.name,
            description: t.description
        }));
    }
}