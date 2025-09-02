"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankIDService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const database_1 = require("../config/database");
class BankIDService {
    static BANKID_ENDPOINT = process.env.BANKID_ENDPOINT || 'https://appapi2.test.bankid.com/rp/v5.1/';
    static async initiateAuthentication(personalNumber, userId) {
        const sessionId = crypto_1.default.randomUUID();
        const orderRef = `order_${Date.now()}`;
        const autoStartToken = crypto_1.default.randomBytes(16).toString('hex');
        const session = {
            user_id: userId,
            session_id: sessionId,
            personal_number: personalNumber,
            authentication_type: 'auth',
            status: 'pending',
            order_ref: orderRef,
            auto_start_token: autoStartToken,
            created_at: new Date().toISOString()
        };
        const { data, error } = await database_1.supabase
            .from('bankid_sessions')
            .insert(session)
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to create BankID session: ${error.message}`);
        }
        return data;
    }
    static async initiateSignature(personalNumber, userId, documentId) {
        const sessionId = crypto_1.default.randomUUID();
        const orderRef = `sign_${Date.now()}`;
        const autoStartToken = crypto_1.default.randomBytes(16).toString('hex');
        const session = {
            user_id: userId,
            session_id: sessionId,
            personal_number: personalNumber,
            authentication_type: 'sign',
            status: 'pending',
            order_ref: orderRef,
            auto_start_token: autoStartToken,
            created_at: new Date().toISOString()
        };
        const { data, error } = await database_1.supabase
            .from('bankid_sessions')
            .insert(session)
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to create BankID signing session: ${error.message}`);
        }
        return data;
    }
    static async checkStatus(orderRef) {
        const { data, error } = await database_1.supabase
            .from('bankid_sessions')
            .select('*')
            .eq('order_ref', orderRef)
            .single();
        if (error) {
            return null;
        }
        return data;
    }
    static async completeSession(orderRef, completionData) {
        const { data, error } = await database_1.supabase
            .from('bankid_sessions')
            .update({
            status: 'completed',
            completion_data: completionData,
            completed_at: new Date().toISOString()
        })
            .eq('order_ref', orderRef)
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to complete BankID session: ${error.message}`);
        }
        return data;
    }
    static async failSession(orderRef, reason) {
        await database_1.supabase
            .from('bankid_sessions')
            .update({
            status: 'failed',
            completion_data: { error: reason },
            completed_at: new Date().toISOString()
        })
            .eq('order_ref', orderRef);
    }
    static async cancelSession(orderRef) {
        await database_1.supabase
            .from('bankid_sessions')
            .update({
            status: 'cancelled',
            completed_at: new Date().toISOString()
        })
            .eq('order_ref', orderRef);
    }
    static validatePersonalNumber(personalNumber) {
        const regex = /^(\d{8})-(\d{4})$/;
        if (!regex.test(personalNumber))
            return false;
        const [datePart] = personalNumber.split('-');
        if (!datePart)
            return false;
        const year = parseInt(datePart.substring(0, 4));
        const month = parseInt(datePart.substring(4, 6));
        const day = parseInt(datePart.substring(6, 8));
        if (month < 1 || month > 12)
            return false;
        if (day < 1 || day > 31)
            return false;
        if (year < 1900 || year > new Date().getFullYear())
            return false;
        return true;
    }
    static generateDigitalSignature(data, privateKey) {
        const hash = crypto_1.default.createHash('sha256').update(data).digest('hex');
        return `signature_${hash}`;
    }
    static verifyDigitalSignature(data, signature, publicKey) {
        const expectedSignature = this.generateDigitalSignature(data, 'mock_private_key');
        return signature === expectedSignature;
    }
}
exports.BankIDService = BankIDService;
//# sourceMappingURL=BankIDService.js.map