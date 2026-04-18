import { EventBus } from "./event.bus";
import { EVENTS } from "./events.constants";
import { ResponseCollector } from "./response.collector";

export class EventListener {
    constructor(private collector: ResponseCollector) {

        EventBus.subscribe(EVENTS.AGENT_RESPONSE, async (payload) => {
            try {

                // 🛡️ VALIDATION GUARD
                if (!payload || !payload.requestId) {
                    console.warn("⚠️ Invalid event payload:", payload);
                    return;
                }

                console.log("📥 EVENT RECEIVED:", payload);

                // 🧠 SAFE INSERT (duplicate-resistant recommended at collector level)
                this.collector.add(payload.requestId, {
                    agent: payload.agent,
                    response: payload.response,
                });

            } catch (error) {
                console.error("❌ EventListener Error:", error);
            }
        });
    }
}