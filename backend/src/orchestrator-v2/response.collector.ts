export class ResponseCollector {
    private store: Map<string, string[]> = new Map();

    add(requestId: string, response: string) {
        if (!this.store.has(requestId)) {
            this.store.set(requestId, []);
        }

        this.store.get(requestId)!.push(response);
    }

    get(requestId: string): string[] {
        return this.store.get(requestId) || [];
    }
}