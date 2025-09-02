"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResourceAccess = exports.requireAdmin = exports.requireFoundationOwner = exports.requireReportGeneration = exports.requireComplianceAccess = exports.requireMeetingManagement = exports.requireUserManagement = exports.requireExpenseApproval = exports.requireFinancialAccess = exports.requireDocumentManagement = exports.requireFoundationManagement = exports.checkPermissions = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("./errorHandler");
const constants_1 = require("../utils/constants");
const checkPermissions = (permissionCheck) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const foundationId = permissionCheck.foundation_id ||
                req.params.foundationId ||
                req.body.foundation_id ||
                req.query.foundation_id;
            if (!userId) {
                throw (0, errorHandler_1.createError)('User not authenticated', 401);
            }
            if (!foundationId) {
                throw (0, errorHandler_1.createError)('Foundation ID is required', 400);
            }
            const { data: membership, error } = await database_1.supabase
                .from('foundation_members')
                .select('role, permissions')
                .eq('foundation_id', foundationId)
                .eq('user_id', userId)
                .single();
            if (error || !membership) {
                throw (0, errorHandler_1.createError)('Access denied to this foundation', 403);
            }
            const userPermissions = membership.permissions || {};
            const hasPermission = permissionCheck.require_all
                ? permissionCheck.required_permissions.every(perm => userPermissions[perm] === true)
                : permissionCheck.required_permissions.some(perm => userPermissions[perm] === true);
            if (!hasPermission) {
                throw (0, errorHandler_1.createError)('Insufficient permissions for this action', 403);
            }
            req.user = {
                id: req.user.id,
                email: req.user.email,
                role: req.user?.role,
                roles: req.user?.roles,
                foundationRole: membership.role,
                foundationPermissions: userPermissions
            };
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkPermissions = checkPermissions;
exports.requireFoundationManagement = (0, exports.checkPermissions)({
    required_permissions: [constants_1.PERMISSIONS.MANAGE_FOUNDATION],
    require_all: true
});
exports.requireDocumentManagement = (0, exports.checkPermissions)({
    required_permissions: [constants_1.PERMISSIONS.UPLOAD_DOCUMENTS, constants_1.PERMISSIONS.APPROVE_DOCUMENTS],
    require_all: false
});
exports.requireFinancialAccess = (0, exports.checkPermissions)({
    required_permissions: [constants_1.PERMISSIONS.VIEW_FINANCIAL_DATA],
    require_all: true
});
exports.requireExpenseApproval = (0, exports.checkPermissions)({
    required_permissions: [constants_1.PERMISSIONS.APPROVE_EXPENSES],
    require_all: true
});
exports.requireUserManagement = (0, exports.checkPermissions)({
    required_permissions: [constants_1.PERMISSIONS.MANAGE_USERS],
    require_all: true
});
exports.requireMeetingManagement = (0, exports.checkPermissions)({
    required_permissions: [constants_1.PERMISSIONS.SCHEDULE_MEETINGS],
    require_all: true
});
exports.requireComplianceAccess = (0, exports.checkPermissions)({
    required_permissions: [constants_1.PERMISSIONS.MANAGE_COMPLIANCE, constants_1.PERMISSIONS.VIEW_AUDIT_LOGS],
    require_all: false
});
exports.requireReportGeneration = (0, exports.checkPermissions)({
    required_permissions: [constants_1.PERMISSIONS.GENERATE_REPORTS],
    require_all: true
});
const requireFoundationOwner = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const foundationId = req.params.foundationId || req.body.foundation_id || req.query.foundation_id;
        if (!userId || !foundationId) {
            throw (0, errorHandler_1.createError)('Missing required parameters', 400);
        }
        const { data: foundation, error } = await database_1.supabase
            .from('foundations')
            .select('owner_user_id')
            .eq('id', foundationId)
            .single();
        if (error || !foundation) {
            throw (0, errorHandler_1.createError)('Foundation not found', 404);
        }
        if (foundation.owner_user_id !== userId) {
            throw (0, errorHandler_1.createError)('Only foundation owner can perform this action', 403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.requireFoundationOwner = requireFoundationOwner;
const requireAdmin = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            throw (0, errorHandler_1.createError)('User not authenticated', 401);
        }
        const userRoles = req.user?.roles || [];
        const hasAdminRole = userRoles.includes('admin') || req.user?.role === 'admin';
        if (!hasAdminRole) {
            throw (0, errorHandler_1.createError)('Admin access required', 403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.requireAdmin = requireAdmin;
const checkResourceAccess = (resourceType) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const resourceId = req.params.id;
            if (!userId || !resourceId) {
                throw (0, errorHandler_1.createError)('Missing required parameters', 400);
            }
            let hasAccess = false;
            switch (resourceType) {
                case 'document':
                    const { data: document } = await database_1.supabase
                        .from('documents')
                        .select('foundation_id, uploaded_by')
                        .eq('id', resourceId)
                        .single();
                    if (document) {
                        hasAccess = document.uploaded_by === userId ||
                            await checkFoundationMembership(userId, document.foundation_id);
                    }
                    break;
                case 'expense':
                    const { data: expense } = await database_1.supabase
                        .from('expenses')
                        .select('foundation_id, user_id')
                        .eq('id', resourceId)
                        .single();
                    if (expense) {
                        hasAccess = expense.user_id === userId ||
                            await checkFoundationMembership(userId, expense.foundation_id);
                    }
                    break;
                case 'meeting':
                    const { data: meeting } = await database_1.supabase
                        .from('meetings')
                        .select('foundation_id, organizer_id, attendees')
                        .eq('id', resourceId)
                        .single();
                    if (meeting) {
                        hasAccess = meeting.organizer_id === userId ||
                            meeting.attendees.includes(userId) ||
                            await checkFoundationMembership(userId, meeting.foundation_id);
                    }
                    break;
                default:
                    throw (0, errorHandler_1.createError)('Unknown resource type', 400);
            }
            if (!hasAccess) {
                throw (0, errorHandler_1.createError)('Access denied to this resource', 403);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.checkResourceAccess = checkResourceAccess;
async function checkFoundationMembership(userId, foundationId) {
    const { data, error } = await database_1.supabase
        .from('foundation_members')
        .select('user_id')
        .eq('foundation_id', foundationId)
        .eq('user_id', userId)
        .single();
    return !error && !!data;
}
//# sourceMappingURL=permissions.js.map