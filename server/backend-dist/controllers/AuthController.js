"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class AuthController {
    static register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { email, password, full_name } = req.body;
        const { data: authData, error: authError } = await database_1.supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                full_name
            }
        });
        if (authError) {
            throw (0, errorHandler_1.createError)(authError.message, 400);
        }
        if (!authData.user) {
            throw (0, errorHandler_1.createError)('Failed to create user', 500);
        }
        const { error: profileError } = await database_1.supabase
            .from('profiles')
            .insert({
            id: authData.user.id,
            full_name,
            email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        if (profileError) {
            await database_1.supabase.auth.admin.deleteUser(authData.user.id);
            throw (0, errorHandler_1.createError)('Failed to create user profile', 500);
        }
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                full_name
            }
        });
    });
    static login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { email, password } = req.body;
        const { data, error } = await database_1.supabase.auth.signInWithPassword({
            email,
            password
        });
        if (error) {
            throw (0, errorHandler_1.createError)('Invalid credentials', 401);
        }
        if (!data.user || !data.session) {
            throw (0, errorHandler_1.createError)('Login failed', 401);
        }
        const { data: profile, error: profileError } = await database_1.supabase
            .from('profiles')
            .select(`
        *,
        user_roles(
          role_id,
          roles(name, description)
        )
      `)
            .eq('id', data.user.id)
            .single();
        if (profileError) {
            throw (0, errorHandler_1.createError)('User profile not found', 404);
        }
        const userRoles = profile.user_roles || [];
        const primaryRole = userRoles.length > 0 ? userRoles[0].roles.name : profile.role || 'member';
        res.json({
            message: 'Login successful',
            user: {
                id: data.user.id,
                email: data.user.email,
                full_name: profile.full_name,
                avatar_url: profile.avatar_url,
                role: primaryRole,
                roles: userRoles.map((ur) => ur.roles.name)
            },
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at
            }
        });
    });
    static logout = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            await database_1.supabase.auth.admin.signOut(token);
        }
        res.json({ message: 'Logout successful' });
    });
    static refreshToken = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            throw (0, errorHandler_1.createError)('Refresh token is required', 400);
        }
        const { data, error } = await database_1.supabase.auth.refreshSession({
            refresh_token
        });
        if (error) {
            throw (0, errorHandler_1.createError)('Invalid refresh token', 401);
        }
        res.json({
            session: {
                access_token: data.session?.access_token,
                refresh_token: data.session?.refresh_token,
                expires_at: data.session?.expires_at
            }
        });
    });
    static forgotPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { email } = req.body;
        const { error } = await database_1.supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL}/reset-password`
        });
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({ message: 'Password reset email sent' });
    });
    static resetPassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { token, password } = req.body;
        const { error } = await database_1.supabase.auth.updateUser({
            password
        });
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({ message: 'Password reset successful' });
    });
    static verifyEmail = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { token } = req.body;
        const { error } = await database_1.supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email'
        });
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({ message: 'Email verified successfully' });
    });
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map