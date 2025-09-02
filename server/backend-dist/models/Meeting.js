"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingModel = void 0;
const database_1 = require("../config/database");
class MeetingModel {
    static async findById(id) {
        const { data, error } = await database_1.supabase
            .from('meetings')
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
            .from('meetings')
            .select('*')
            .eq('foundation_id', foundationId)
            .order('start_time', { ascending: false });
        if (error) {
            return [];
        }
        return data || [];
    }
    static async create(meetingData) {
        const { data, error } = await database_1.supabase
            .from('meetings')
            .insert({
            ...meetingData,
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
    static async update(id, meetingData) {
        const { data, error } = await database_1.supabase
            .from('meetings')
            .update({
            ...meetingData,
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
            .from('meetings')
            .delete()
            .eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
    }
    static async getMinutes(meetingId) {
        const { data, error } = await database_1.supabase
            .from('meeting_minutes')
            .select('*')
            .eq('meeting_id', meetingId)
            .order('created_at', { ascending: false });
        if (error) {
            throw new Error(error.message);
        }
        return data || [];
    }
    static async createMinutes(minutesData) {
        const { data, error } = await database_1.supabase
            .from('meeting_minutes')
            .insert({
            ...minutesData,
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
    static async updateMinutes(id, minutesData) {
        const { data, error } = await database_1.supabase
            .from('meeting_minutes')
            .update({
            ...minutesData,
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
exports.MeetingModel = MeetingModel;
//# sourceMappingURL=Meeting.js.map