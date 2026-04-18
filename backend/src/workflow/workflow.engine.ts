import { WorkflowDefinition } from "./workflow.types";
import { EventBus } from "../events/event.bus";
import { EVENTS } from "../events/events.constants";
import { ResponseCollector } from "../events/response.collector";

export class WorkflowEngine {
    constructor(private collector: ResponseCollector) {
        console.log("🟢 WORKFLOW ENGINE INITIALIZED");
    }

    async execute(
        workflow: WorkflowDefinition,
        message: string,
        userId: string,
        requestId: string
    ) {


        const startTime = Date.now();
        console.log(`🚀 WORKFLOW START | requestId=${requestId}`);

        // 1. publish all workflow steps (PARALLEL SAFE)
        const publishPromises = workflow.steps.map((step) => {
            const stepStart = Date.now();
            EventBus.publish(EVENTS.AGENT_EXECUTE, {
                requestId,
                agent: step.agent,
                message,
                userId,
            })

            const stepTime = Date.now() - stepStart;
            console.log(
                `⚡ STEP EXECUTED | agent=${step.agent} | time=${stepTime}ms`
            );
        });

        await Promise.all(publishPromises);

        // 2. wait for responses (reliable wait loop)
        const results = await this.waitForResponses(
            requestId,
            workflow.steps.length
        );

        // 3. cleanup
        this.collector.clear(requestId);

        const totalTime = Date.now() - startTime;
        console.log(
            `✅ WORKFLOW COMPLETE | requestId=${requestId} | time=${totalTime}ms`
        );

        return results;
    }

    private async waitForResponses(
        requestId: string,
        expectedCount: number
    ) {
        const timeout = 8000;
        const interval = 100;

        let waited = 0;

        while (waited < timeout) {
            const count = this.collector.count(requestId);

            if (count >= expectedCount) {
                break;
            }

            await new Promise((r) => setTimeout(r, interval));
            waited += interval;
        }

        const results = this.collector.get(requestId) || [];

        // 🧠 IMPORTANT: mark partial completion if needed
        if (results.length < expectedCount) {
            console.warn(
                `⚠️ Workflow timeout: expected ${expectedCount}, got ${results.length}`
            );
        }

        return results;
    }
}