"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const GrantController_1 = require("../controllers/GrantController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/', [
    (0, express_validator_1.query)('project_id').optional().isUUID(),
    (0, express_validator_1.query)('status').optional().isIn(['applied', 'under_review', 'awarded', 'rejected', 'completed', 'cancelled'])
], validation_1.validateRequest, GrantController_1.GrantController.getGrants);
router.get('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, GrantController_1.GrantController.getGrantById);
router.post('/', [
    (0, express_validator_1.body)('project_id').isUUID(),
    (0, express_validator_1.body)('grant_name').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('grantor_name').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('amount').isFloat({ min: 0.01 }),
    (0, express_validator_1.body)('currency').isIn(['SEK', 'EUR', 'USD']),
    (0, express_validator_1.body)('application_date').isDate(),
    (0, express_validator_1.body)('requirements').optional().isArray(),
    (0, express_validator_1.body)('reporting_schedule').optional().isArray(),
    (0, express_validator_1.body)('notes').optional().trim()
], validation_1.validateRequest, GrantController_1.GrantController.createGrant);
router.put('/:id', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('grant_name').optional().trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('grantor_name').optional().trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('amount').optional().isFloat({ min: 0.01 }),
    (0, express_validator_1.body)('status').optional().isIn(['applied', 'under_review', 'awarded', 'rejected', 'completed', 'cancelled']),
    (0, express_validator_1.body)('award_date').optional().isDate(),
    (0, express_validator_1.body)('completion_date').optional().isDate(),
    (0, express_validator_1.body)('notes').optional().trim()
], validation_1.validateRequest, GrantController_1.GrantController.updateGrant);
router.delete('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, GrantController_1.GrantController.deleteGrant);
exports.default = router;
//# sourceMappingURL=grants.js.map