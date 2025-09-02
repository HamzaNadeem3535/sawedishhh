"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const ExpenseController_1 = require("../controllers/ExpenseController");
const validation_1 = require("../middleware/validation");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.get('/', [
    (0, express_validator_1.query)('foundation_id').optional().isUUID(),
    (0, express_validator_1.query)('status').optional().isIn(['pending', 'approved', 'rejected']),
    (0, express_validator_1.query)('category').optional().isIn(['office_supplies', 'travel', 'meals', 'utilities', 'professional_services', 'marketing', 'other'])
], validation_1.validateRequest, ExpenseController_1.ExpenseController.getExpenses);
router.get('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, ExpenseController_1.ExpenseController.getExpenseById);
router.post('/', upload_1.upload.single('receipt'), [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('amount').isFloat({ min: 0.01 }),
    (0, express_validator_1.body)('currency').isIn(['SEK', 'EUR', 'USD']),
    (0, express_validator_1.body)('category').isIn(['office_supplies', 'travel', 'meals', 'utilities', 'professional_services', 'marketing', 'other']),
    (0, express_validator_1.body)('description').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('expense_date').isDate()
], validation_1.validateRequest, ExpenseController_1.ExpenseController.createExpense);
router.put('/:id', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('amount').optional().isFloat({ min: 0.01 }),
    (0, express_validator_1.body)('category').optional().isIn(['office_supplies', 'travel', 'meals', 'utilities', 'professional_services', 'marketing', 'other']),
    (0, express_validator_1.body)('description').optional().trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('expense_date').optional().isDate(),
    (0, express_validator_1.body)('status').optional().isIn(['pending', 'approved', 'rejected']),
    (0, express_validator_1.body)('rejection_reason').optional().trim()
], validation_1.validateRequest, ExpenseController_1.ExpenseController.updateExpense);
router.delete('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, ExpenseController_1.ExpenseController.deleteExpense);
router.post('/:id/approve', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, ExpenseController_1.ExpenseController.approveExpense);
router.post('/:id/reject', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('rejection_reason').trim().isLength({ min: 2 })
], validation_1.validateRequest, ExpenseController_1.ExpenseController.rejectExpense);
router.get('/:id/receipt', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, ExpenseController_1.ExpenseController.downloadReceipt);
exports.default = router;
//# sourceMappingURL=expenses.js.map