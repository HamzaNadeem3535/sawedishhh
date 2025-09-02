"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const InvestmentController_1 = require("../controllers/InvestmentController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/', [
    (0, express_validator_1.query)('foundation_id').optional().isUUID(),
    (0, express_validator_1.query)('type').optional().isIn(['stock', 'bond', 'mutual_fund', 'real_estate', 'commodity', 'cash', 'other'])
], validation_1.validateRequest, InvestmentController_1.InvestmentController.getInvestments);
router.get('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, InvestmentController_1.InvestmentController.getInvestmentById);
router.post('/', [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('type').isIn(['stock', 'bond', 'mutual_fund', 'real_estate', 'commodity', 'cash', 'other']),
    (0, express_validator_1.body)('name').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('amount').isFloat({ min: 0.01 }),
    (0, express_validator_1.body)('currency').isIn(['SEK', 'EUR', 'USD']),
    (0, express_validator_1.body)('acquisition_date').isDate(),
    (0, express_validator_1.body)('current_value').optional().isFloat({ min: 0 }),
    (0, express_validator_1.body)('performance').optional().isFloat(),
    (0, express_validator_1.body)('notes').optional().trim()
], validation_1.validateRequest, InvestmentController_1.InvestmentController.createInvestment);
router.put('/:id', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('amount').optional().isFloat({ min: 0.01 }),
    (0, express_validator_1.body)('current_value').optional().isFloat({ min: 0 }),
    (0, express_validator_1.body)('performance').optional().isFloat(),
    (0, express_validator_1.body)('notes').optional().trim()
], validation_1.validateRequest, InvestmentController_1.InvestmentController.updateInvestment);
router.delete('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, InvestmentController_1.InvestmentController.deleteInvestment);
router.get('/:id/performance', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, InvestmentController_1.InvestmentController.getInvestmentPerformance);
router.post('/:id/update-value', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('current_value').isFloat({ min: 0 }),
    (0, express_validator_1.body)('performance').optional().isFloat()
], validation_1.validateRequest, InvestmentController_1.InvestmentController.updateInvestmentValue);
exports.default = router;
//# sourceMappingURL=investments.js.map