import { DocumentWorkflow, WorkflowStep } from '../types/governance';
export declare class DocumentWorkflowService {
    static createWorkflow(documentId: string, workflowType: 'approval' | 'review' | 'signature', steps: Omit<WorkflowStep, 'id' | 'workflow_id'>[]): Promise<DocumentWorkflow>;
    static processWorkflowStep(workflowId: string, stepId: string, action: 'approve' | 'reject' | 'sign', userId: string, comments?: string, digitalSignature?: string): Promise<WorkflowStep>;
    static getWorkflowsByDocument(documentId: string): Promise<DocumentWorkflow[]>;
    static getWorkflowsByFoundation(foundationId: string): Promise<DocumentWorkflow[]>;
    static getPendingActions(userId: string): Promise<WorkflowStep[]>;
    private static notifyWorkflowCompletion;
    private static notifyWorkflowRejection;
    static deleteWorkflow(workflowId: string): Promise<void>;
    static reassignWorkflowStep(stepId: string, newAssigneeId: string, newAssigneeName: string): Promise<WorkflowStep>;
}
//# sourceMappingURL=DocumentWorkflowService.d.ts.map