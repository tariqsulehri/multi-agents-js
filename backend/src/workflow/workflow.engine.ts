import { WorkflowDefinition } from "./workflow.types";
import { ResponseCollector } from "../events/response.collector";
import { AgentQueue } from "../queue/agent.queue";

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

        // 1. Queue all workflow steps
        const publishPromises = workflow.steps.map(async (step) => {
            const stepStart = Date.now();

            await AgentQueue.add(
                "execute-agent",
                {
                    requestId,
                    agent: step.agent,
                    message,
                    userId,
                },
                {
                    attempts: 3,
                    backoff: {
                        type: "exponential",
                        delay: 2000,
                    },
                    removeOnComplete: true,
                    removeOnFail: false,
                }
            );

            const stepTime = Date.now() - stepStart;

            console.log(
                `⚡ STEP QUEUED | agent=${step.agent} | time=${stepTime}ms`
            );
        });

        await Promise.all(publishPromises);

        // 2. Wait for worker responses
        const results = await this.waitForResponses(
            requestId,
            workflow.steps.length
        );

        // 3. Cleanup workflow state
        await this.collector.clear(requestId);

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
            const count = await this.collector.count(requestId);

            if (count >= expectedCount) {
                break;
            }

            await new Promise((resolve) =>
                setTimeout(resolve, interval)
            );

            waited += interval;
        }

        const results =
            (await this.collector.get(requestId)) || [];

        if (results.length < expectedCount) {
            console.warn(
                `⚠️ Workflow timeout | expected=${expectedCount} | received=${results.length}`
            );
        }

        return results;
    }
}