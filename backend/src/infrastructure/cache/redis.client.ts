/**
 * In-memory mock of a Redis client.
 * 
 * NOTE: This is used because a local Redis server was not detected.
 * In a production environment, this should be replaced with a real 'ioredis' instance.
 * All data stored here is ephemeral and will be lost on server restart.
 */
const storage: Record<string, string[]> = {};

export const redis = {
    /**
     * Appends a value to a list stored at 'key'.
     */
    async rpush(key: string, value: string) {
        if (!storage[key]) storage[key] = [];
        storage[key].push(value);
        return storage[key].length;
    },

    /**
     * Trims an existing list so that it contains only the specified range of elements.
     */
    async ltrim(key: string, start: number, end: number) {
        if (storage[key]) {
            storage[key] = storage[key].slice(start, end === -1 ? undefined : end + 1);
        }
    },

    /**
     * Returns the specified elements of the list stored at 'key'.
     */
    async lrange(key: string, start: number, end: number) {
        if (!storage[key]) return [];
        return storage[key].slice(start, end === -1 ? undefined : end + 1);
    }
};