"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentModel = void 0;
const database_1 = require("../config/database");
class DocumentModel {
    static async findById(id) {
        const { data, error } = await database_1.supabase
            .from('documents')
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
            .from('documents')
            .select('*')
            .eq('foundation_id', foundationId)
            .order('created_at', { ascending: false });
        if (error) {
            return [];
        }
        return data || [];
    }
    static async create(documentData) {
        const { data, error } = await database_1.supabase
            .from('documents')
            .insert({
            ...documentData,
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
    static async update(id, documentData) {
        const { data, error } = await database_1.supabase
            .from('documents')
            .update({
            ...documentData,
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
            .from('documents')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
    static async getVersions(documentId) {
        const { data, error } = await database_1.supabase
            .from('document_versions')
            .select('*')
            .eq('document_id', documentId)
            .order('version_number', { ascending: false });
        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    }
    static async createVersion(versionData) {
        const { data, error } = await database_1.supabase
            .from('document_versions')
            .insert({
            ...versionData,
            created_at: new Date().toISOString()
        })
            .select()
            .single();
        if (error) {
            throw new Error(error.message);
        }
        return data;
    }
}
exports.DocumentModel = DocumentModel;
//# sourceMappingURL=Document.js.map