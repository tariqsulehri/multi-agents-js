type Handler = (payload: any) => Promise<void>;

export class EventBus {
    private static handlers: Record<string, Handler[]> = {};

    static subscribe(event: string, handler: Handler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }
        this.handlers[event].push(handler);
    }

    static async publish(event: string, payload: any) {
        const handlers = this.handlers[event] || [];

        await Promise.all(
            handlers.map(async (handler) => {
                try {
                    await handler(payload);
                } catch (err) {
                    console.error(`Error in handler for ${event}:`, err);
                }
            })
        );
    }
}