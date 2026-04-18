import { EventBus } from "./event.bus";
import { EVENTS } from "./events.constants";
import { ResponseCollector } from "./response.collector";

export class EventListener {
    constructor(private collector: ResponseCollector) {
        EventBus.subscribe(EVENTS.AGENT_RESPONSE, async (payload) => {
            console.log("📥 EVENT RECEIVED:", payload);

            await this.collector.add(payload.requestId, {
                agent: payload.agent,
                response: payload.response,
            });
        });
    }
}