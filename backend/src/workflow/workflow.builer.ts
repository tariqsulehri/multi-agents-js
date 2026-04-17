export class WorkflowBuilder {
    static build(intent: string) {
        switch (intent) {

            case "order_food":
                return {
                    name: "order_workflow",
                    steps: [
                        { id: "s1", agent: "sales", action: "create_order" },
                        { id: "s2", agent: "info", action: "order_confirmation" }
                    ]
                };

            case "check_order":
                return {
                    name: "check_order_workflow",
                    steps: [
                        { id: "s1", agent: "sales", action: "get_order" }
                    ]
                };

            case "faq":
                return {
                    name: "faq_workflow",
                    steps: [
                        { id: "s1", agent: "info", action: "answer_faq" }
                    ]
                };

            default:
                return {
                    name: "default",
                    steps: [
                        { id: "s1", agent: "info", action: "general_help" }
                    ]
                };
        }
    }
}