"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const database_1 = require("../config/database");
class AuditService {
    static async log(entry) {
        try {
            await database_1.supabase
                .from('audit_logs')
                .insert({
                ...entry,
                timestamp: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('Failed to log audit entry:', error);
        }
    }
    static async logFoundationAction(userId, foundationId, action, targetId, oldValues, newValues, ipAddress, userAgent) {
        await this.log({
            user_id: userId,
            foundation_id: foundationId,
            action,
            target_table: 'foundations',
            target_id: targetId,
            old_values: oldValues,
            new_values: newValues,
            ip_address: ipAddress,
            user_agent: userAgent
        });
    }
    static async logDocumentAction(userId, foundationId, action, documentId, oldValues, newValues, ipAddress, userAgent) {
        await this.log({
            user_id: userId,
            foundation_id: foundationId,
            action,
            target_table: 'documents',
            target_id: documentId,
            old_values: oldValues,
            new_values: newValues,
            ip_address: ipAddress,
            user_agent: userAgent
        });
    }
    static async logExpenseAction(userId, foundationId, action, expenseId, oldValues, newValues, ipAddress, userAgent) {
        await this.log({
            user_id: userId,
            foundation_id: foundationId,
            action,
            target_table: 'expenses',
            target_id: expenseId,
            old_values: oldValues,
            new_values: newValues,
            ip_address: ipAddress,
            user_agent: userAgent
        });
    }
    static async getAuditLogs(foundationId, userId, action, targetTable, limit = 100) {
        let query = database_1.supabase
            .from('audit_logs')
            .select(`
        *,
        profiles(full_name, email)
      `)
            .order('timestamp', { ascending: false })
            .limit(limit);
        if (foundationId) {
            query = query.eq('foundation_id', foundationId);
        }
        if (userId) {
            query = query.eq('user_id', userId);
        }
        if (action) {
            query = query.eq('action', action);
        }
        if (targetTable) {
            query = query.eq('target_table', targetTable);
        }
        const { data, error } = await query;
        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    }
}
exports.AuditService = AuditService;
//# sourceMappingURL=AuditService.js.map