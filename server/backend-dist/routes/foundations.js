"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const FoundationController_1 = require("../controllers/FoundationController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/', FoundationController_1.FoundationController.getUserFoundations);
router.get('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, FoundationController_1.FoundationController.getFoundationById);
router.post('/', [
    (0, express_validator_1.body)('name').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('registration_number').optional().trim(),
    (0, express_validator_1.body)('description').optional().trim(),
    (0, express_validator_1.body)('address').optional().trim(),
    (0, express_validator_1.body)('phone').optional().trim(),
    (0, express_validator_1.body)('website').optional().isURL()
], validation_1.validateRequest, FoundationController_1.FoundationController.createFoundation);
router.put('/:id', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('description').optional().trim(),
    (0, express_validator_1.body)('address').optional().trim(),
    (0, express_validator_1.body)('phone').optional().trim(),
    (0, express_validator_1.body)('website').optional().isURL()
], validation_1.validateRequest, FoundationController_1.FoundationController.updateFoundation);
router.delete('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, FoundationController_1.FoundationController.deleteFoundation);
router.get('/:id/members', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, FoundationController_1.FoundationController.getFoundationMembers);
router.post('/:id/members', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('user_id').isUUID(),
    (0, express_validator_1.body)('role').isIn(['owner', 'admin', 'member', 'viewer'])
], validation_1.validateRequest, FoundationController_1.FoundationController.addFoundationMember);
router.put('/:id/members/:userId', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.param)('userId').isUUID(),
    (0, express_validator_1.body)('role').isIn(['owner', 'admin', 'member', 'viewer'])
], validation_1.validateRequest, FoundationController_1.FoundationController.updateFoundationMember);
router.delete('/:id/members/:userId', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.param)('userId').isUUID()
], validation_1.validateRequest, FoundationController_1.FoundationController.removeFoundationMember);
exports.default = router;
//# sourceMappingURL=foundations.js.map