import { WorkflowBuilder } from "../workflow/workflow.builer";
import { WorkflowEngine } from "../workflow/workflow.engine";
import { PlannerAgent } from "../planner/planner.agent";
import { ResponseCollector } from "../events/response.collector";
import { EventListener } from "../events/event.listener";

export class AgentOrchestratorV3 {

    private planner = new PlannerAgent();
    private collector = new ResponseCollector();
    private engine = new WorkflowEngine(this.collector);

    private listener = new EventListener(this.collector);

    async execute(message: string, userId: string) {

        const requestId = crypto.randomUUID();

        // 1. PLAN INTENT
        const intent = await this.planner.plan(message);


        console.log("INTENT:", intent);

        // 2. BUILD WORKFLOW

        const workflow = WorkflowBuilder.build(intent[0]);
        console.log("WORKFLOW:", workflow);

        // 3. EXECUTE WORKFLOW
        const steps = await this.engine.execute(
            workflow,
            message,
            userId,
            requestId
        );

        return {
            response: {
                requestId,
                workflow: workflow.name,
                steps
            }
        };
    }
}