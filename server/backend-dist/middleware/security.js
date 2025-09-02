"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = exports.corsConfig = exports.requestLogger = exports.validateApiKey = exports.requestSizeLimiter = exports.ipWhitelist = exports.securityHeaders = void 0;
const helmet_1 = __importDefault(require("helmet"));
const errorHandler_1 = require("./errorHandler");
exports.securityHeaders = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.supabase.co", "https://*.supabase.co"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});
const ipWhitelist = (allowedIPs) => {
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress || '';
        if (!allowedIPs.includes(clientIP)) {
            throw (0, errorHandler_1.createError)('Access denied from this IP address', 403);
        }
        next();
    };
};
exports.ipWhitelist = ipWhitelist;
const requestSizeLimiter = (maxSize = '10mb') => {
    return (req, res, next) => {
        const contentLength = req.get('content-length');
        if (contentLength) {
            const sizeInBytes = parseInt(contentLength);
            const maxSizeInBytes = parseSize(maxSize);
            if (sizeInBytes > maxSizeInBytes) {
                throw (0, errorHandler_1.createError)('Request entity too large', 413);
            }
        }
        next();
    };
};
exports.requestSizeLimiter = requestSizeLimiter;
const validateApiKey = (req, res, next) => {
    const apiKey = req.get('X-API-Key');
    const validApiKeys = process.env.API_KEYS?.split(',') || [];
    if (!apiKey || !validApiKeys.includes(apiKey)) {
        throw (0, errorHandler_1.createError)('Invalid or missing API key', 401);
    }
    next();
};
exports.validateApiKey = validateApiKey;
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });
    next();
};
exports.requestLogger = requestLogger;
exports.corsConfig = {
    origin: (origin, callback) => {
        const allowedOrigins = process.env.NODE_ENV === 'production'
            ? ['https://swedish-foundation-m-36v0.bolt.host']
            : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};
const sanitizeInput = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj.trim().replace(/[<>]/g, '');
        }
        if (Array.isArray(obj)) {
            return obj.map(sanitize);
        }
        if (obj && typeof obj === 'object') {
            const sanitized = {};
            for (const key in obj) {
                sanitized[key] = sanitize(obj[key]);
            }
            return sanitized;
        }
        return obj;
    };
    if (req.body) {
        req.body = sanitize(req.body);
    }
    if (req.query) {
        req.query = sanitize(req.query);
    }
    if (req.params) {
        req.params = sanitize(req.params);
    }
    next();
};
exports.sanitizeInput = sanitizeInput;
function parseSize(size) {
    const units = {
        b: 1,
        kb: 1024,
        mb: 1024 * 1024,
        gb: 1024 * 1024 * 1024
    };
    const match = size.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
    if (!match)
        return 0;
    const value = parseFloat(match[1] ?? '0');
    const unit = match[2] || 'b';
    const multiplier = units[unit] ?? 1;
    return value * multiplier;
}
//# sourceMappingURL=security.js.map