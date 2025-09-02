"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantController = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class GrantController {
    static getGrants = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { project_id, status } = req.query;
        let query = database_1.supabase
            .from('grants')
            .select(`
        *,
        projects(name, foundation_id, foundations(name))
      `)
            .order('created_at', { ascending: false });
        if (project_id) {
            query = query.eq('project_id', project_id);
        }
        if (status) {
            query = query.eq('status', status);
        }
        const { data: grants, error } = await query;
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 500);
        }
        res.json({
            grants: grants || [],
            total: grants?.length || 0
        });
    });
    static getGrantById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { data: grant, error } = await database_1.supabase
            .from('grants')
            .select(`
        *,
        projects(name, foundation_id, foundations(name))
      `)
            .eq('id', id)
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)('Grant not found', 404);
        }
        res.json({ grant });
    });
    static createGrant = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { project_id, grant_name, grantor_name, amount, currency, application_date, requirements, reporting_schedule, notes } = req.body;
        const { data: grant, error } = await database_1.supabase
            .from('grants')
            .insert({
            project_id,
            grant_name,
            grantor_name,
            amount: parseFloat(amount),
            currency,
            status: 'applied',
            application_date,
            requirements: requirements || [],
            reporting_schedule: reporting_schedule || [],
            notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .select()
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.status(201).json({
            message: 'Grant application created successfully',
            grant
        });
    });
    static updateGrant = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { grant_name, grantor_name, amount, status, award_date, completion_date, notes } = req.body;
        const { data: grant, error } = await database_1.supabase
            .from('grants')
            .update({
            grant_name,
            grantor_name,
            amount: amount ? parseFloat(amount) : undefined,
            status,
            award_date,
            completion_date,
            notes,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({
            message: 'Grant updated successfully',
            grant
        });
    });
    static deleteGrant = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { error } = await database_1.supabase
            .from('grants')
            .delete()
            .eq('id', id);
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({ message: 'Grant deleted successfully' });
    });
}
exports.GrantController = GrantController;
//# sourceMappingURL=GrantController.js.map