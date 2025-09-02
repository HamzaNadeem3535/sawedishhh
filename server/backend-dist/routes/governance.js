"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const GovernanceController_1 = require("../controllers/GovernanceController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/roles', [(0, express_validator_1.query)('foundation_id').optional().isUUID()], validation_1.validateRequest, GovernanceController_1.GovernanceController.getRoles);
router.post('/roles', [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('name').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('description').optional().trim(),
    (0, express_validator_1.body)('permissions').isArray()
], validation_1.validateRequest, GovernanceController_1.GovernanceController.createRole);
router.get('/workflows', [(0, express_validator_1.query)('foundation_id').optional().isUUID()], validation_1.validateRequest, GovernanceController_1.GovernanceController.getDocumentWorkflows);
router.post('/workflows', [
    (0, express_validator_1.body)('document_id').isUUID(),
    (0, express_validator_1.body)('workflow_type').isIn(['approval', 'review', 'signature']),
    (0, express_validator_1.body)('steps').isArray({ min: 1 })
], validation_1.validateRequest, GovernanceController_1.GovernanceController.createDocumentWorkflow);
router.post('/workflows/:id/action', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('step_id').isUUID(),
    (0, express_validator_1.body)('action').isIn(['approve', 'reject', 'sign']),
    (0, express_validator_1.body)('comments').optional().trim()
], validation_1.validateRequest, GovernanceController_1.GovernanceController.processWorkflowAction);
router.get('/compliance', [(0, express_validator_1.query)('foundation_id').optional().isUUID()], validation_1.validateRequest, GovernanceController_1.GovernanceController.getComplianceItems);
router.post('/compliance', [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('regulation_type').isIn(['lansstyrelsen', 'skatteverket', 'bolagsverket', 'other']),
    (0, express_validator_1.body)('title').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('description').trim().isLength({ min: 10 }),
    (0, express_validator_1.body)('due_date').isDate(),
    (0, express_validator_1.body)('priority').isIn(['low', 'medium', 'high', 'critical']),
    (0, express_validator_1.body)('assigned_to').isUUID()
], validation_1.validateRequest, GovernanceController_1.GovernanceController.createComplianceItem);
router.get('/audit-logs', [
    (0, express_validator_1.query)('foundation_id').optional().isUUID(),
    (0, express_validator_1.query)('action').optional().trim(),
    (0, express_validator_1.query)('target_table').optional().trim()
], validation_1.validateRequest, GovernanceController_1.GovernanceController.getAuditLogs);
exports.default = router;
//# sourceMappingURL=governance.js.map