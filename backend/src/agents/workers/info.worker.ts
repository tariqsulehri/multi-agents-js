import { openai } from "../../infrastructure/llm/openai.client";

export class InfoWorker {
    name = "info";

    async run(message: string, userId: string, requestId: string, collector: any) {

        let responseText = "";

        const msg = message.toLowerCase();

        if (msg.includes("timing") || msg.includes("hours")) {
            responseText = "We are open from 10 AM to 11 PM daily.";
        }

        if (msg.includes("delivery")) {
            responseText = "Delivery time is 25–40 minutes depending on your location.";
        }

        collector.add(requestId, {
            agent: this.name,
            response: responseText || "No info available.",
        });
    }
}