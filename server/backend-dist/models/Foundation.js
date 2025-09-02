"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundationModel = void 0;
const database_1 = require("../config/database");
class FoundationModel {
    static async findById(id) {
        const { data, error } = await database_1.supabase
            .from('foundations')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            return null;
        }
        return data;
    }
    static async findByUserId(userId) {
        const { data, error } = await database_1.supabase
            .from('foundations')
            .select(`
        *,
        foundation_members!inner(role, permissions)
      `)
            .eq('foundation_members.user_id', userId);
        if (error) {
            return [];
        }
        return data || [];
    }
    static async create(foundationData) {
        const { data, error } = await database_1.supabase
            .from('foundations')
            .insert({
            ...foundationData,
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
    static async update(id, foundationData) {
        const { data, error } = await database_1.supabase
            .from('foundations')
            .update({
            ...foundationData,
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
            .from('foundations')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
    static async getMembers(foundationId) {
        const { data, error } = await database_1.supabase
            .from('foundation_members')
            .select(`
        *,
        profiles(full_name, email, avatar_url)
      `)
            .eq('foundation_id', foundationId);
        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    }
    static async addMember(memberData) {
        const { data, error } = await database_1.supabase
            .from('foundation_members')
            .insert({
            ...memberData,
            joined_at: new Date().toISOString(),
            created_at: new Date().toISOString()
        })
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    static async updateMember(foundationId, userId, memberData) {
        const { data, error } = await database_1.supabase
            .from('foundation_members')
            .update(memberData)
            .eq('foundation_id', foundationId)
            .eq('user_id', userId)
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
    static async removeMember(foundationId, userId) {
        const { error } = await database_1.supabase
            .from('foundation_members')
            .delete()
            .eq('foundation_id', foundationId)
            .eq('user_id', userId);
        if (error) {
            throw new Error(error.message);
        }
    }
    static async checkUserAccess(foundationId, userId) {
        const { data, error } = await database_1.supabase
            .from('foundation_members')
            .select('*')
            .eq('foundation_id', foundationId)
            .eq('user_id', userId)
            .single();
        if (error) {
            return null;
        }
        return data;
    }
}
exports.FoundationModel = FoundationModel;
//# sourceMappingURL=Foundation.js.map