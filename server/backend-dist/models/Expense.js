"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseModel = void 0;
const database_1 = require("../config/database");
class ExpenseModel {
    static async findById(id) {
        const { data, error } = await database_1.supabase
            .from('expenses')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            return null;
        }
        return data;
    }
    static async findByFoundation(foundationId) {
        const { data, error } = await database_1.supabase
            .from('expenses')
            .select('*')
            .eq('foundation_id', foundationId)
            .order('created_at', { ascending: false });
        if (error) {
            return [];
        }
        return data || [];
    }
    static async findByUser(userId) {
        const { data, error } = await database_1.supabase
            .from('expenses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) {
            return [];
        }
        return data || [];
    }
    static async create(expenseData) {
        const { data, error } = await database_1.supabase
            .from('expenses')
            .insert({
            ...expenseData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    static async update(id, expenseData) {
        const { data, error } = await database_1.supabase
            .from('expenses')
            .update({
            ...expenseData,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    static async delete(id) {
        const { error } = await database_1.supabase
            .from('expenses')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
    static async approve(id, approvedBy) {
        const { data, error } = await database_1.supabase
            .from('expenses')
            .update({
            status: 'approved',
            approved_by: approvedBy,
            approved_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    static async reject(id, approvedBy, rejectionReason) {
        const { data, error } = await database_1.supabase
            .from('expenses')
            .update({
            status: 'rejected',
            approved_by: approvedBy,
            approved_at: new Date().toISOString(),
            rejection_reason: rejectionReason,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
}
exports.ExpenseModel = ExpenseModel;
//# sourceMappingURL=Expense.js.map