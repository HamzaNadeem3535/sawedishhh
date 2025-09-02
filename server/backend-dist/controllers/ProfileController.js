"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class ProfileController {
    static getCurrentProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        const { data: profile, error } = await database_1.supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)('Profile not found', 404);
        }
        res.json({ profile });
    });
    static updateCurrentProfile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        const { full_name, avatar_url } = req.body;
        const { data: profile, error } = await database_1.supabase
            .from('profiles')
            .update({
            full_name,
            avatar_url,
            updated_at: new Date().toISOString()
        })
            .eq('id', userId)
            .select()
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({
            message: 'Profile updated successfully',
            profile
        });
    });
    static uploadAvatar = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        const file = req.file;
        if (!file) {
            throw (0, errorHandler_1.createError)('No file uploaded', 400);
        }
        const fileName = `${userId}-${Date.now()}.${file.originalname.split('.').pop()}`;
        const filePath = `avatars/${fileName}`;
        const { error: uploadError } = await database_1.supabase.storage
            .from('avatars')
            .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true
        });
        if (uploadError) {
            throw (0, errorHandler_1.createError)('Avatar upload failed', 500);
        }
        const { data: publicUrl } = database_1.supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);
        const { data: profile, error: updateError } = await database_1.supabase
            .from('profiles')
            .update({
            avatar_url: publicUrl.publicUrl,
            updated_at: new Date().toISOString()
        })
            .eq('id', userId)
            .select()
            .single();
        if (updateError) {
            throw (0, errorHandler_1.createError)(updateError.message, 400);
        }
        res.json({
            message: 'Avatar uploaded successfully',
            avatar_url: publicUrl.publicUrl,
            profile
        });
    });
    static getProfileById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { data: profile, error } = await database_1.supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url, created_at')
            .eq('id', id)
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)('Profile not found', 404);
        }
        res.json({ profile });
    });
    static searchProfiles = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { query } = req.params;
        const { data: profiles, error } = await database_1.supabase
            .from('profiles')
            .select('id, full_name, email, avatar_url')
            .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
            .limit(10);
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 500);
        }
        res.json({
            profiles: profiles || [],
            total: profiles?.length || 0
        });
    });
}
exports.ProfileController = ProfileController;
//# sourceMappingURL=ProfileController.js.map