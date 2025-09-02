"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceController = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class GovernanceController {
    static getRoles = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id } = req.query;
        const { data: roles, error } = await database_1.supabase
            .from('roles')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 500);
        }
        res.json({
            roles: roles || [],
            total: roles?.length || 0
        });
    });
    static createRole = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id, name, description, permissions } = req.body;
        const { data: role, error } = await database_1.supabase
            .from('roles')
            .insert({
            name,
            description,
            permissions,
            created_at: new Date().toISOString()
        })
            .select()
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.status(201).json({
            message: 'Role created successfully',
            role
        });
    });
    static getDocumentWorkflows = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id } = req.query;
        const workflows = [
            {
                id: '1',
                document_id: 'doc_1',
                document_name: 'Board Resolution - Q1 Budget',
                workflow_type: 'approval',
                status: 'in_progress',
                steps: [
                    {
                        id: '1',
                        step_order: 1,
                        assignee_name: 'John Secretary',
                        action_type: 'review',
                        status: 'completed'
                    },
                    {
                        id: '2',
                        step_order: 2,
                        assignee_name: 'Jane Chairman',
                        action_type: 'approve',
                        status: 'pending'
                    }
                ],
                created_at: new Date().toISOString()
            }
        ];
        res.json({
            workflows,
            total: workflows.length
        });
    });
    static createDocumentWorkflow = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { document_id, workflow_type, steps } = req.body;
        res.status(201).json({
            message: 'Document workflow created successfully',
            workflow: {
                id: Date.now().toString(),
                document_id,
                workflow_type,
                status: 'pending',
                steps,
                created_at: new Date().toISOString()
            }
        });
    });
    static processWorkflowAction = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { step_id, action, comments } = req.body;
        res.json({
            message: `Workflow step ${action}d successfully`,
            step: {
                id: step_id,
                status: action === 'approve' ? 'completed' : 'rejected',
                comments,
                completed_at: new Date().toISOString()
            }
        });
    });
    static getComplianceItems = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id } = req.query;
        const complianceItems = [
            {
                id: '1',
                foundation_id: foundation_id || '1',
                regulation_type: 'lansstyrelsen',
                title: 'Annual Activity Report',
                description: 'Submit annual report to Länsstyrelsen',
                due_date: '2024-04-30',
                status: 'in_progress',
                priority: 'high',
                assigned_to: 'John Secretary',
                created_at: new Date().toISOString()
            }
        ];
        res.json({
            compliance_items: complianceItems,
            total: complianceItems.length
        });
    });
    static createComplianceItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id, regulation_type, title, description, due_date, priority, assigned_to } = req.body;
        const complianceItem = {
            id: Date.now().toString(),
            foundation_id,
            regulation_type,
            title,
            description,
            due_date,
            status: 'pending',
            priority,
            assigned_to,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        res.status(201).json({
            message: 'Compliance item created successfully',
            compliance_item: complianceItem
        });
    });
    static getAuditLogs = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id, action, target_table } = req.query;
        let query = database_1.supabase
            .from('audit_logs')
            .select(`
        *,
        profiles(full_name, email)
      `)
            .order('timestamp', { ascending: false })
            .limit(100);
        if (foundation_id) {
            query = query.eq('foundation_id', foundation_id);
        }
        if (action) {
            query = query.eq('action', action);
        }
        if (target_table) {
            query = query.eq('target_table', target_table);
        }
        const { data: logs, error } = await query;
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 500);
        }
        res.json({
            audit_logs: logs || [],
            total: logs?.length || 0
        });
    });
}
exports.GovernanceController = GovernanceController;
//# sourceMappingURL=GovernanceController.js.map