export class ToolRegistry {
    private static tools = new Map();

    static register(tool: any) {
        this.tools.set(tool.name, tool);
    }

    static get(name: string) {
        return this.tools.get(name);
    }
}