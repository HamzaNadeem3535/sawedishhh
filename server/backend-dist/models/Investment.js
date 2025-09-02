"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvestmentModel = void 0;
const database_1 = require("../config/database");
class InvestmentModel {
    static async findById(id) {
        const { data, error } = await database_1.supabase
            .from('investments')
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
            .from('investments')
            .select('*')
            .eq('foundation_id', foundationId)
            .order('created_at', { ascending: false });
        if (error) {
            return [];
        }
        return data || [];
    }
    static async create(investmentData) {
        const { data, error } = await database_1.supabase
            .from('investments')
            .insert({
            ...investmentData,
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
    static async update(id, investmentData) {
        const { data, error } = await database_1.supabase
            .from('investments')
            .update({
            ...investmentData,
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
            .from('investments')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
    static async updateValue(id, currentValue, performance) {
        const { data, error } = await database_1.supabase
            .from('investments')
            .update({
            current_value: currentValue,
            performance,
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
    static async getPortfolioSummary(foundationId) {
        const { data: investments, error } = await database_1.supabase
            .from('investments')
            .select('amount, current_value, type, performance')
            .eq('foundation_id', foundationId);
        if (error) {
            throw new Error(error.message);
        }
        const summary = {
            total_invested: investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0,
            current_value: investments?.reduce((sum, inv) => sum + (inv.current_value || inv.amount), 0) || 0,
            total_gain_loss: 0,
            by_type: {}
        };
        summary.total_gain_loss = summary.current_value - summary.total_invested;
        investments?.forEach(inv => {
            summary.by_type[inv.type] = (summary.by_type[inv.type] || 0) + inv.amount;
        });
        return summary;
    }
}
exports.InvestmentModel = InvestmentModel;
//# sourceMappingURL=Investment.js.map