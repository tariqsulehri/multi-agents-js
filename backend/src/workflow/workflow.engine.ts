import { WorkflowDefinition } from "./workflow.types";
import { SalesWorker } from "../agents/workers/sales.worker";
import { SupportWorker } from "../agents/workers/support.worker";
import { InfoWorker } from "../agents/workers/info.worker";

export class WorkflowEngine {
    async execute(workflow: WorkflowDefinition, message: string, userId: string, requestId: string) {
        const results: any[] = [];

        for (const step of workflow.steps) {

            let result: any;

            if (step.agent === "sales") {
                result = await new SalesWorker().run(message, userId, requestId);
            }

            if (step.agent === "support") {
                result = await new SupportWorker().run(message, userId, requestId);
            }

            if (step.agent === "info") {
                result = await new InfoWorker().run(message, userId, requestId);
            }

            results.push({
                step: step.id,
                agent: step.agent,
                result,
            });
        }

        return results;
    }
}