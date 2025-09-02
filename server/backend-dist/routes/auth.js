"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const AuthController_1 = require("../controllers/AuthController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.post('/register', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('full_name').trim().isLength({ min: 2 })
], validation_1.validateRequest, AuthController_1.AuthController.register);
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty()
], validation_1.validateRequest, AuthController_1.AuthController.login);
router.post('/logout', AuthController_1.AuthController.logout);
router.post('/refresh', AuthController_1.AuthController.refreshToken);
router.post('/forgot-password', [(0, express_validator_1.body)('email').isEmail().normalizeEmail()], validation_1.validateRequest, AuthController_1.AuthController.forgotPassword);
router.post('/reset-password', [
    (0, express_validator_1.body)('token').notEmpty(),
    (0, express_validator_1.body)('password').isLength({ min: 6 })
], validation_1.validateRequest, AuthController_1.AuthController.resetPassword);
router.post('/verify-email', [(0, express_validator_1.body)('token').notEmpty()], validation_1.validateRequest, AuthController_1.AuthController.verifyEmail);
exports.default = router;
//# sourceMappingURL=auth.js.map