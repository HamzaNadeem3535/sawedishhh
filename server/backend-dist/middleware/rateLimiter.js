"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportLimiter = exports.uploadLimiter = exports.bankIDLimiter = exports.authLimiter = exports.generalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const constants_1 = require("../utils/constants");
exports.generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: constants_1.API_RATE_LIMITS.WINDOW_MS,
    max: constants_1.API_RATE_LIMITS.MAX_REQUESTS,
    message: {
        error: 'Too Many Requests',
        message: 'Too many requests from this IP, please try again later.',
        retry_after: Math.ceil(constants_1.API_RATE_LIMITS.WINDOW_MS / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded. Please try again later.',
            retry_after: Math.ceil(constants_1.API_RATE_LIMITS.WINDOW_MS / 1000)
        });
    }
});
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        error: 'Too Many Authentication Attempts',
        message: 'Too many authentication attempts, please try again later.',
        retry_after: 900
    },
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too Many Authentication Attempts',
            message: 'Account temporarily locked due to too many failed attempts.',
            retry_after: 900
        });
    }
});
exports.bankIDLimiter = (0, express_rate_limit_1.default)({
    windowMs: constants_1.API_RATE_LIMITS.BANKID_WINDOW_MS,
    max: constants_1.API_RATE_LIMITS.BANKID_MAX_REQUESTS,
    message: {
        error: 'Too Many BankID Requests',
        message: 'Too many BankID requests, please wait before trying again.',
        retry_after: Math.ceil(constants_1.API_RATE_LIMITS.BANKID_WINDOW_MS / 1000)
    },
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too Many BankID Requests',
            message: 'BankID rate limit exceeded. Please wait before trying again.',
            retry_after: Math.ceil(constants_1.API_RATE_LIMITS.BANKID_WINDOW_MS / 1000)
        });
    }
});
exports.uploadLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 10,
    message: {
        error: 'Too Many Upload Requests',
        message: 'Upload rate limit exceeded, please wait before uploading again.',
        retry_after: 60
    },
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too Many Upload Requests',
            message: 'Too many file uploads. Please wait before trying again.',
            retry_after: 60
        });
    }
});
exports.reportLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: {
        error: 'Too Many Report Requests',
        message: 'Report generation rate limit exceeded.',
        retry_after: 300
    },
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too Many Report Requests',
            message: 'Too many report generation requests. Please wait before generating another report.',
            retry_after: 300
        });
    }
});
//# sourceMappingURL=rateLimiter.js.map