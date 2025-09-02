"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const FinancialController_1 = require("../controllers/FinancialController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/accounts', [(0, express_validator_1.query)('foundation_id').optional().isUUID()], validation_1.validateRequest, FinancialController_1.FinancialController.getAccounts);
router.post('/accounts', [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('account_number').trim().isLength({ min: 1 }),
    (0, express_validator_1.body)('account_name').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('account_type').isIn(['asset', 'liability', 'equity', 'revenue', 'expense']),
    (0, express_validator_1.body)('currency').isIn(['SEK', 'EUR', 'USD'])
], validation_1.validateRequest, FinancialController_1.FinancialController.createAccount);
router.get('/journal-entries', [(0, express_validator_1.query)('foundation_id').optional().isUUID()], validation_1.validateRequest, FinancialController_1.FinancialController.getJournalEntries);
router.post('/journal-entries', [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('entry_date').isDate(),
    (0, express_validator_1.body)('description').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('line_items').isArray({ min: 2 })
], validation_1.validateRequest, FinancialController_1.FinancialController.createJournalEntry);
router.get('/invoices', [
    (0, express_validator_1.query)('foundation_id').optional().isUUID(),
    (0, express_validator_1.query)('invoice_type').optional().isIn(['sales', 'purchase']),
    (0, express_validator_1.query)('status').optional().isIn(['draft', 'sent', 'paid', 'overdue', 'cancelled'])
], validation_1.validateRequest, FinancialController_1.FinancialController.getInvoices);
router.post('/invoices', [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('invoice_type').isIn(['sales', 'purchase']),
    (0, express_validator_1.body)('customer_supplier_name').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('invoice_date').isDate(),
    (0, express_validator_1.body)('due_date').isDate(),
    (0, express_validator_1.body)('line_items').isArray({ min: 1 })
], validation_1.validateRequest, FinancialController_1.FinancialController.createInvoice);
router.get('/bank-accounts', [(0, express_validator_1.query)('foundation_id').optional().isUUID()], validation_1.validateRequest, FinancialController_1.FinancialController.getBankAccounts);
router.post('/bank-accounts', [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('account_name').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('bank_name').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('account_number').trim().isLength({ min: 5 }),
    (0, express_validator_1.body)('currency').isIn(['SEK', 'EUR', 'USD']),
    (0, express_validator_1.body)('account_type').isIn(['checking', 'savings', 'business'])
], validation_1.validateRequest, FinancialController_1.FinancialController.createBankAccount);
router.get('/bank-transactions', [
    (0, express_validator_1.query)('bank_account_id').optional().isUUID(),
    (0, express_validator_1.query)('is_reconciled').optional().isBoolean()
], validation_1.validateRequest, FinancialController_1.FinancialController.getBankTransactions);
router.post('/bank-transactions/sync', [(0, express_validator_1.body)('bank_account_id').isUUID()], validation_1.validateRequest, FinancialController_1.FinancialController.syncBankTransactions);
router.post('/bank-transactions/:id/reconcile', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, FinancialController_1.FinancialController.reconcileTransaction);
router.get('/reports', [
    (0, express_validator_1.query)('foundation_id').optional().isUUID(),
    (0, express_validator_1.query)('report_type').optional().isIn(['balance_sheet', 'income_statement', 'cash_flow', 'trial_balance', 'tax_report'])
], validation_1.validateRequest, FinancialController_1.FinancialController.getFinancialReports);
router.post('/reports', [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('report_type').isIn(['balance_sheet', 'income_statement', 'cash_flow', 'trial_balance', 'tax_report']),
    (0, express_validator_1.body)('period_start').isDate(),
    (0, express_validator_1.body)('period_end').isDate()
], validation_1.validateRequest, FinancialController_1.FinancialController.generateFinancialReport);
exports.default = router;
//# sourceMappingURL=financial.js.map