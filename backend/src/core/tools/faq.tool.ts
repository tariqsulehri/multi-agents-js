export const FAQTool = {
    name: "faq",

    async execute(input: { type: string }) {
        const faqs: Record<string, string> = {
            timings: "We are open from 10 AM to 11 PM daily.",
            delivery: "Average delivery time is 25–40 minutes.",
        };

        return {
            answer: faqs[input.type] || "Information not available.",
        };
    },
};