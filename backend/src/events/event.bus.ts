type Handler = (payload: any) => Promise<void>;

export class EventBus {
    private static handlers: Record<string, Handler[]> = {};

    static subscribe(event: string, handler: Handler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
        }

        console.log("📥 SUBSCRIBED:", event);
        this.handlers[event].push(handler);
    }

    static async publish(event: string, payload: any) {
        const handlers = this.handlers[event] || [];

        console.log("📡 EVENT PUBLISHED:", event, payload);

        if (!event) {
            console.error("❌ EVENT NAME MISSING");
            return;
        }

        await Promise.all(
            handlers.map(handler => handler(payload))
        );
    }
}