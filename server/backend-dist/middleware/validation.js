"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = exports.validateSwedishPhoneNumber = exports.validateSwedishPersonalNumber = exports.validateEmail = exports.validateUUID = exports.validateRequest = void 0;
const express_validator_1 = require("express-validator");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => ({
            field: error.type === 'field' ? error.path : 'unknown',
            message: error.msg,
            value: error.type === 'field' ? error.value : undefined
        }));
        return res.status(400).json({
            error: 'Validation Error',
            message: 'Invalid input data',
            details: errorMessages
        });
    }
    next();
    return;
};
exports.validateRequest = validateRequest;
const validateUUID = (value) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
};
exports.validateUUID = validateUUID;
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.validateEmail = validateEmail;
const validateSwedishPersonalNumber = (personalNumber) => {
    const regex = /^(\d{8})-(\d{4})$/;
    return regex.test(personalNumber);
};
exports.validateSwedishPersonalNumber = validateSwedishPersonalNumber;
const validateSwedishPhoneNumber = (phone) => {
    const regex = /^\+46\s?[1-9]\d{1,2}\s?\d{3}\s?\d{2}\s?\d{2}$/;
    return regex.test(phone);
};
exports.validateSwedishPhoneNumber = validateSwedishPhoneNumber;
const sanitizeInput = (input) => {
    return input.trim().replace(/[<>]/g, '');
};
exports.sanitizeInput = sanitizeInput;
//# sourceMappingURL=validation.js.map