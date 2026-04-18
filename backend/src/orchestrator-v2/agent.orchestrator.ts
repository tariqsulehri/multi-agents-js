import { PlannerAgent } from "../planner/planner.agent";
import { SalesWorker } from "../agents/workers/sales.worker";
import { SupportWorker } from "../agents/workers/support.worker";
import { InfoWorker } from "../agents/workers/info.worker";
import { AggregatorAgent } from "../agents/aggregator/aggregator.agent";
import { ResponseCollector } from "../events/response.collector";
import { v4 as uuidv4 } from "uuid";

export class AgentOrchestratorV2 {
    private planner = new PlannerAgent();
    private aggregator = new AggregatorAgent();
    private collector = new ResponseCollector();

    async execute(message: string, userId: string) {
        const requestId = uuidv4();

        // 1. PLAN
        const plan = await this.planner.plan(message);
        console.log("PLAN:", plan);

        const workers: Promise<void>[] = [];

        // 2. EXECUTE WORKERS
        for (const agent of plan) {
            if (agent === "sales") {
                workers.push(
                    new SalesWorker().run(message, userId, requestId, this.collector)
                );
            }

            if (agent === "support") {
                workers.push(
                    new SupportWorker().run(message, userId, requestId, this.collector)
                );
            }
            if (agent === "info") {
                workers.push(
                    new InfoWorker().run(message, userId, requestId, this.collector)
                );
            }
        }

        await Promise.all(workers);

        // 3. COLLECT RESULTS
        const responses = this.collector.get(requestId);

        // 4. AGGREGATE FINAL ANSWER
        return this.aggregator.combine(responses);
    }
}