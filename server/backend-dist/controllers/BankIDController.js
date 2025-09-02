"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankIDController = void 0;
const BankIDService_1 = require("../services/BankIDService");
const errorHandler_1 = require("../middleware/errorHandler");
const AuditService_1 = require("../services/AuditService");
const database_1 = require("../config/database");
class BankIDController {
    static initiateAuthentication = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { personal_number } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            throw (0, errorHandler_1.createError)('User not authenticated', 401);
        }
        if (!BankIDService_1.BankIDService.validatePersonalNumber(personal_number)) {
            throw (0, errorHandler_1.createError)('Invalid personal number format', 400);
        }
        const session = await BankIDService_1.BankIDService.initiateAuthentication(personal_number, userId);
        await AuditService_1.AuditService.log({
            user_id: userId,
            action: 'bankid_auth_initiated',
            details: {
                personal_number: personal_number.replace(/(\d{8})-(\d{4})/, '$1-****'),
                order_ref: session.order_ref
            },
            ip_address: req.ip ?? '',
            user_agent: req.get('User-Agent') ?? ''
        });
        res.status(201).json({
            message: 'BankID authentication initiated',
            session: {
                order_ref: session.order_ref,
                auto_start_token: session.auto_start_token,
                status: session.status
            }
        });
    });
    static initiateSignature = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { personal_number, document_id } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            throw (0, errorHandler_1.createError)('User not authenticated', 401);
        }
        if (!BankIDService_1.BankIDService.validatePersonalNumber(personal_number)) {
            throw (0, errorHandler_1.createError)('Invalid personal number format', 400);
        }
        const { data: document, error: docError } = await database_1.supabase
            .from('documents')
            .select('id, file_name, foundation_id')
            .eq('id', document_id)
            .single();
        if (docError || !document) {
            throw (0, errorHandler_1.createError)('Document not found', 404);
        }
        const session = await BankIDService_1.BankIDService.initiateSignature(personal_number, userId, document_id);
        await AuditService_1.AuditService.log({
            user_id: userId,
            foundation_id: document.foundation_id,
            action: 'bankid_signature_initiated',
            target_table: 'documents',
            target_id: document_id,
            details: {
                personal_number: personal_number.replace(/(\d{8})-(\d{4})/, '$1-****'),
                order_ref: session.order_ref,
                document_name: document.file_name
            },
            ip_address: req.ip ?? '',
            user_agent: req.get('User-Agent') ?? ''
        });
        res.status(201).json({
            message: 'BankID signature initiated',
            session: {
                order_ref: session.order_ref,
                auto_start_token: session.auto_start_token,
                status: session.status
            }
        });
    });
    static checkStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { orderRef } = req.params;
        if (!orderRef) {
            throw (0, errorHandler_1.createError)('Order reference is required', 400);
        }
        const session = await BankIDService_1.BankIDService.checkStatus(orderRef);
        if (!session) {
            throw (0, errorHandler_1.createError)('BankID session not found', 404);
        }
        if (session.user_id !== req.user?.id) {
            throw (0, errorHandler_1.createError)('Access denied to this BankID session', 403);
        }
        res.json({
            session: {
                order_ref: session.order_ref,
                status: session.status,
                authentication_type: session.authentication_type,
                created_at: session.created_at,
                completed_at: session.completed_at,
                completion_data: session.completion_data
            }
        });
    });
    static completeProcess = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { order_ref, completion_data } = req.body;
        const session = await BankIDService_1.BankIDService.completeSession(order_ref, completion_data);
        await AuditService_1.AuditService.log({
            user_id: session.user_id,
            action: `bankid_${session.authentication_type}_completed`,
            details: {
                order_ref: session.order_ref,
                personal_number: session.personal_number.replace(/(\d{8})-(\d{4})/, '$1-****'),
                user_name: completion_data.user?.name
            },
            ip_address: req.ip ?? '',
            user_agent: req.get('User-Agent') ?? ''
        });
        res.json({
            message: `BankID ${session.authentication_type} completed successfully`,
            session: {
                order_ref: session.order_ref,
                status: session.status,
                completed_at: session.completed_at
            }
        });
    });
    static cancelProcess = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { order_ref } = req.body;
        await BankIDService_1.BankIDService.cancelSession(order_ref);
        if (!req.user?.id) {
            throw (0, errorHandler_1.createError)('User not authenticated', 401);
        }
        await AuditService_1.AuditService.log({
            user_id: req.user.id,
            action: 'bankid_cancelled',
            details: { order_ref },
            ip_address: req.ip ?? '',
            user_agent: req.get('User-Agent') ?? ''
        });
        res.json({
            message: 'BankID process cancelled successfully'
        });
    });
    static getUserSessions = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const userId = req.user?.id;
        const { data: sessions, error } = await database_1.supabase
            .from('bankid_sessions')
            .select('id, order_ref, authentication_type, status, created_at, completed_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 500);
        }
        res.json({
            sessions: sessions || [],
            total: sessions?.length || 0
        });
    });
}
exports.BankIDController = BankIDController;
//# sourceMappingURL=BankIDController.js.map