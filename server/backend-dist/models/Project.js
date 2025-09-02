"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantModel = exports.ProjectModel = void 0;
const database_1 = require("../config/database");
class ProjectModel {
    static async findById(id) {
        const { data, error } = await database_1.supabase
            .from('projects')
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
            .from('projects')
            .select('*')
            .eq('foundation_id', foundationId)
            .order('created_at', { ascending: false });
        if (error) {
            return [];
        }
        return data || [];
    }
    static async create(projectData) {
        const { data, error } = await database_1.supabase
            .from('projects')
            .insert({
            ...projectData,
            progress_percentage: 0,
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
    static async update(id, projectData) {
        const { data, error } = await database_1.supabase
            .from('projects')
            .update({
            ...projectData,
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
            .from('projects')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
    static async updateProgress(id, progressPercentage) {
        const { data, error } = await database_1.supabase
            .from('projects')
            .update({
            progress_percentage: progressPercentage,
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
    static async getGrants(projectId) {
        const { data, error } = await database_1.supabase
            .from('grants')
            .select('*')
            .eq('project_id', projectId)
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    }
}
exports.ProjectModel = ProjectModel;
class GrantModel {
    static async findById(id) {
        const { data, error } = await database_1.supabase
            .from('grants')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            return null;
        }
        return data;
    }
    static async create(grantData) {
        const { data, error } = await database_1.supabase
            .from('grants')
            .insert({
            ...grantData,
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
    static async update(id, grantData) {
        const { data, error } = await database_1.supabase
            .from('grants')
            .update({
            ...grantData,
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
            .from('grants')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
}
exports.GrantModel = GrantModel;
//# sourceMappingURL=Project.js.map