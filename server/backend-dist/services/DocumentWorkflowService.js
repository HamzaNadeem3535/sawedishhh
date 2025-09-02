"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentWorkflowService = void 0;
const database_1 = require("../config/database");
const NotificationService_1 = require("./NotificationService");
const AuditService_1 = require("./AuditService");
class DocumentWorkflowService {
    static async createWorkflow(documentId, workflowType, steps) {
        const { data: workflow, error: workflowError } = await database_1.supabase
            .from('document_workflows')
            .insert({
            document_id: documentId,
            workflow_type: workflowType,
            status: 'pending',
            created_at: new Date().toISOString()
        })
            .select()
            .single();
        if (workflowError) {
            throw new Error(`Failed to create workflow: ${workflowError.message}`);
        }
        const stepsWithWorkflowId = steps.map((step, index) => ({
            ...step,
            workflow_id: workflow.id,
            step_order: index + 1
        }));
        const { data: createdSteps, error: stepsError } = await database_1.supabase
            .from('workflow_steps')
            .insert(stepsWithWorkflowId)
            .select();
        if (stepsError) {
            await database_1.supabase.from('document_workflows').delete().eq('id', workflow.id);
            throw new Error(`Failed to create workflow steps: ${stepsError.message}`);
        }
        return {
            ...workflow,
            steps: createdSteps || []
        };
    }
    static async processWorkflowStep(workflowId, stepId, action, userId, comments, digitalSignature) {
        const { data: step, error: stepError } = await database_1.supabase
            .from('workflow_steps')
            .update({
            status: action === 'approve' || action === 'sign' ? 'completed' : 'rejected',
            completed_at: new Date().toISOString(),
            comments,
            digital_signature: digitalSignature
        })
            .eq('id', stepId)
            .select()
            .single();
        if (stepError) {
            throw new Error(`Failed to update workflow step: ${stepError.message}`);
        }
        const { data: allSteps, error: allStepsError } = await database_1.supabase
            .from('workflow_steps')
            .select('status')
            .eq('workflow_id', workflowId)
            .order('step_order');
        if (allStepsError) {
            throw new Error(`Failed to check workflow status: ${allStepsError.message}`);
        }
        const allCompleted = allSteps?.every(s => s.status === 'completed');
        const hasRejected = allSteps?.some(s => s.status === 'rejected');
        const workflowStatus = hasRejected ? 'rejected' : allCompleted ? 'completed' : 'in_progress';
        await database_1.supabase
            .from('document_workflows')
            .update({
            status: workflowStatus,
            completed_at: allCompleted ? new Date().toISOString() : null
        })
            .eq('id', workflowId);
        if (allCompleted) {
            await this.notifyWorkflowCompletion(workflowId);
        }
        else if (hasRejected) {
            await this.notifyWorkflowRejection(workflowId, comments);
        }
        await AuditService_1.AuditService.log({
            user_id: userId,
            action: `workflow_step_${action}`,
            target_table: 'workflow_steps',
            target_id: stepId,
            details: { workflow_id: workflowId, action, comments }
        });
        return step;
    }
    static async getWorkflowsByDocument(documentId) {
        const { data: workflows, error } = await database_1.supabase
            .from('document_workflows')
            .select(`
        *,
        workflow_steps(*)
      `)
            .eq('document_id', documentId)
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(`Failed to fetch workflows: ${error.message}`);
        }
        return workflows || [];
    }
    static async getWorkflowsByFoundation(foundationId) {
        const { data: workflows, error } = await database_1.supabase
            .from('document_workflows')
            .select(`
        *,
        workflow_steps(*),
        documents!inner(foundation_id)
      `)
            .eq('documents.foundation_id', foundationId)
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(`Failed to fetch foundation workflows: ${error.message}`);
        }
        return workflows || [];
    }
    static async getPendingActions(userId) {
        const { data: steps, error } = await database_1.supabase
            .from('workflow_steps')
            .select(`
        *,
        document_workflows(
          document_id,
          workflow_type,
          documents(file_name, foundation_id)
        )
      `)
            .eq('assignee_id', userId)
            .eq('status', 'pending')
            .order('created_at', { ascending: true });
        if (error) {
            throw new Error(`Failed to fetch pending actions: ${error.message}`);
        }
        return steps || [];
    }
    static async notifyWorkflowCompletion(workflowId) {
        const { data: workflow, error } = await database_1.supabase
            .from('document_workflows')
            .select(`
        *,
        documents(file_name, foundation_id, uploaded_by, profiles(email, full_name))
      `)
            .eq('id', workflowId)
            .single();
        if (error || !workflow) {
            return;
        }
        const document = workflow.documents;
        const uploader = document.profiles;
        if (uploader?.email) {
            await NotificationService_1.NotificationService.sendNotification({
                user_id: document.uploaded_by,
                foundation_id: document.foundation_id,
                type: 'document_approved',
                title: 'Document Workflow Completed',
                message: `The workflow for "${document.file_name}" has been completed successfully.`,
                priority: 'medium'
            });
        }
    }
    static async notifyWorkflowRejection(workflowId, reason) {
        const { data: workflow, error } = await database_1.supabase
            .from('document_workflows')
            .select(`
        *,
        documents(file_name, foundation_id, uploaded_by, profiles(email, full_name))
      `)
            .eq('id', workflowId)
            .single();
        if (error || !workflow) {
            return;
        }
        const document = workflow.documents;
        const uploader = document.profiles;
        if (uploader?.email) {
            await NotificationService_1.NotificationService.sendNotification({
                user_id: document.uploaded_by,
                foundation_id: document.foundation_id,
                type: 'document_approved',
                title: 'Document Workflow Rejected',
                message: `The workflow for "${document.file_name}" has been rejected. ${reason ? `Reason: ${reason}` : ''}`,
                priority: 'high'
            });
        }
    }
    static async deleteWorkflow(workflowId) {
        await database_1.supabase
            .from('workflow_steps')
            .delete()
            .eq('workflow_id', workflowId);
        const { error } = await database_1.supabase
            .from('document_workflows')
            .delete()
            .eq('id', workflowId);
        if (error) {
            throw new Error(`Failed to delete workflow: ${error.message}`);
        }
    }
    static async reassignWorkflowStep(stepId, newAssigneeId, newAssigneeName) {
        const { data: step, error } = await database_1.supabase
            .from('workflow_steps')
            .update({
            assignee_id: newAssigneeId,
            assignee_name: newAssigneeName
        })
            .eq('id', stepId)
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to reassign workflow step: ${error.message}`);
        }
        return step;
    }
}
exports.DocumentWorkflowService = DocumentWorkflowService;
//# sourceMappingURL=DocumentWorkflowService.js.map