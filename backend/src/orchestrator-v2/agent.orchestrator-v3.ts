import { WorkflowBuilder } from "../workflow/workflow.builer";
import { WorkflowEngine } from "../workflow/workflow.engine";
import { PlannerAgent } from "../planner/planner.agent";

export class AgentOrchestratorV3 {

    private planner = new PlannerAgent();
    private engine = new WorkflowEngine();

    async execute(message: string, userId: string) {

        const requestId = crypto.randomUUID();

        // 1. PLAN INTENT
        const intent = await this.planner.plan(message);

        console.log("INTENT:", intent);

        // 2. BUILD WORKFLOW
        const workflow = WorkflowBuilder.build(intent[0]);

        console.log("WORKFLOW:", workflow);

        // 3. EXECUTE WORKFLOW
        const result = await this.engine.execute(
            workflow,
            message,
            userId,
            requestId
        );

        return {
            requestId,
            workflow: workflow.name,
            steps: result
        };
    }
}