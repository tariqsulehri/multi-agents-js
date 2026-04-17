export type WorkflowStep = {
    id: string;
    agent: string;
    action: string;
    input?: any;
};

export type WorkflowDefinition = {
    name: string;
    steps: WorkflowStep[];
};