export class RagService {
    static async search(query: string): Promise<string> {
        // MOCK now → later replace with pgvector / Pinecone
        if (query.toLowerCase().includes("delivery")) {
            return `
Company Policy:
- Delivery time: 30 minutes
- Free delivery above 500 PKR
- Available 24/7 in major cities
`;
        }

        if (query.toLowerCase().includes("menu")) {
            return `
Menu Info:
- Pizza
- Burger
- Fries
- Drinks
`;
        }

        return "No relevant knowledge found.";
    }
}