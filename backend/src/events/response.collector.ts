import { redis } from "../queue/redis.connection";

export class ResponseCollector {
    async add(requestId: string, data: any) {
        const key = `workflow:${requestId}`;

        const existing = await redis.get(key);

        const responses = existing
            ? JSON.parse(existing)
            : [];

        responses.push(data);

        await redis.set(
            key,
            JSON.stringify(responses),
            "EX",
            3600 // 1 hour expiry
        );
    }

    async get(requestId: string) {
        const key = `workflow:${requestId}`;

        const data = await redis.get(key);

        return data
            ? JSON.parse(data)
            : [];
    }

    async count(requestId: string) {
        const results = await this.get(requestId);
        return results.length;
    }

    async clear(requestId: string) {
        const key = `workflow:${requestId}`;
        await redis.del(key);
    }
}