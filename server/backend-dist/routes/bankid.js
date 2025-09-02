"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const BankIDController_1 = require("../controllers/BankIDController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.post('/auth/initiate', [
    (0, express_validator_1.body)('personal_number').matches(/^\d{8}-\d{4}$/).withMessage('Invalid personal number format')
], validation_1.validateRequest, BankIDController_1.BankIDController.initiateAuthentication);
router.post('/sign/initiate', [
    (0, express_validator_1.body)('personal_number').matches(/^\d{8}-\d{4}$/).withMessage('Invalid personal number format'),
    (0, express_validator_1.body)('document_id').isUUID().withMessage('Invalid document ID')
], validation_1.validateRequest, BankIDController_1.BankIDController.initiateSignature);
router.get('/status/:orderRef', [(0, express_validator_1.param)('orderRef').notEmpty()], validation_1.validateRequest, BankIDController_1.BankIDController.checkStatus);
router.post('/complete', [
    (0, express_validator_1.body)('order_ref').notEmpty(),
    (0, express_validator_1.body)('completion_data').isObject()
], validation_1.validateRequest, BankIDController_1.BankIDController.completeProcess);
router.post('/cancel', [(0, express_validator_1.body)('order_ref').notEmpty()], validation_1.validateRequest, BankIDController_1.BankIDController.cancelProcess);
router.get('/sessions', BankIDController_1.BankIDController.getUserSessions);
exports.default = router;
//# sourceMappingURL=bankid.js.map