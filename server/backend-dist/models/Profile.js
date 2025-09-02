"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModel = void 0;
const database_1 = require("../config/database");
class ProfileModel {
    static async findById(id) {
        const { data, error } = await database_1.supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            return null;
        }
        return data;
    }
    static async findByEmail(email) {
        const { data, error } = await database_1.supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single();
        if (error) {
            return null;
        }
        return data;
    }
    static async create(profileData) {
        const { data, error } = await database_1.supabase
            .from('profiles')
            .insert({
            ...profileData,
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
    static async update(id, profileData) {
        const { data, error } = await database_1.supabase
            .from('profiles')
            .update({
            ...profileData,
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
            .from('profiles')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
    static async search(query) {
        const { data, error } = await database_1.supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url, created_at, updated_at')
            .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
            .limit(10);
        if (error) {
            return [];
        }
        return data || [];
    }
}
exports.ProfileModel = ProfileModel;
//# sourceMappingURL=Profile.js.map