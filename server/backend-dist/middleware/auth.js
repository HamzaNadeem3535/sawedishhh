"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.requireFoundationAccess = exports.authMiddleware = void 0;
const database_1 = require("../config/database");
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No valid authorization token provided'
            });
        }
        const token = authHeader.substring(7);
        const { data: { user }, error } = await database_1.supabase.auth.getUser(token);
        if (error || !user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid or expired token'
            });
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
            .eq('id', user.id)
            .single();
        if (profileError) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'User profile not found'
            });
        }
        const userRoles = profile.user_roles || [];
        const primaryRole = userRoles.length > 0 ? userRoles[0].roles.name : profile.role || 'member';
        const allRoles = userRoles.map((ur) => ur.roles.name);
        req.user = {
            id: String(user.id),
            email: user.email || '',
            role: primaryRole,
            roles: allRoles
        };
        return next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Authentication verification failed'
        });
    }
};
exports.authMiddleware = authMiddleware;
const requireFoundationAccess = async (req, res, next) => {
    try {
        const foundationId = req.params.foundationId || req.body.foundation_id;
        if (!foundationId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Foundation ID is required'
            });
        }
        const { data: membership, error } = await database_1.supabase
            .from('foundation_members')
            .select('role, permissions')
            .eq('foundation_id', foundationId)
            .eq('user_id', req.user?.id)
            .single();
        if (error || !membership) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Access denied to this foundation'
            });
        }
        req.user = {
            ...req.user,
            foundationRole: membership.role,
            foundationPermissions: membership.permissions
        };
        return next();
    }
    catch (error) {
        console.error('Foundation access middleware error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: 'Foundation access verification failed'
        });
    }
};
exports.requireFoundationAccess = requireFoundationAccess;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user?.role || !roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Insufficient permissions'
            });
        }
        else {
            return next();
        }
    };
};
exports.requireRole = requireRole;
//# sourceMappingURL=auth.js.map