export class ResponseCollector {
    private store: Record<string, any[]> = {};

    add(requestId: string, data: any) {
        if (!requestId || !data) return;

        if (!this.store[requestId]) {
            this.store[requestId] = [];
        }

        // 🛡️ DEDUPLICATION (VERY IMPORTANT FOR RETRIES)
        const exists = this.store[requestId].some(
            (item) =>
                item.agent === data.agent &&
                item.response === data.response
        );

        if (exists) {
            return;
        }

        this.store[requestId].push(data);
    }

    get(requestId: string) {
        return this.store[requestId] || [];
    }

    count(requestId: string) {
        return this.get(requestId).length;
    }

    clear(requestId: string) {
        delete this.store[requestId];
    }
}