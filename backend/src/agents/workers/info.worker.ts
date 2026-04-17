export class InfoWorker {
    name = "info";

    async run(
        message: string,
        userId: string,
        requestId: string
    ): Promise<string> {
        const msg = message.toLowerCase();

        // 🕒 timings
        if (
            msg.includes("timing") ||
            msg.includes("timings") ||
            msg.includes("hours") ||
            msg.includes("open")
        ) {
            return "We are open daily from 10 AM to 11 PM.";
        }

        // 🚚 delivery
        if (msg.includes("delivery")) {
            return "Delivery time is usually 25 to 40 minutes depending on your location.";
        }

        return "Information is currently unavailable.";
    }
}