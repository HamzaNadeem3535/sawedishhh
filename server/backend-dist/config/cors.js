"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsErrorHandler = exports.corsOptions = void 0;
const environment_1 = __importDefault(require("./environment"));
const env = environment_1.default.get();
exports.corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = env.nodeEnv === 'production'
            ? [
                'https://swedish-foundation-m-36v0.bolt.host',
                'https://faasinova.se',
                'https://www.faasinova.se'
            ]
            : [
                'http://localhost:5173',
                'http://localhost:3000',
                'http://127.0.0.1:5173',
                'http://127.0.0.1:3000'
            ];
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`Origin ${origin} not allowed by CORS policy`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-API-Key',
        'X-Foundation-ID'
    ],
    exposedHeaders: [
        'X-Total-Count',
        'X-Page-Count',
        'X-Rate-Limit-Remaining',
        'X-Rate-Limit-Reset'
    ],
    optionsSuccessStatus: 200,
    preflightContinue: false
};
const corsErrorHandler = (error, req, res, next) => {
    if (error.message.includes('CORS')) {
        return res.status(403).json({
            error: 'CORS Error',
            message: 'Origin not allowed by CORS policy',
            origin: req.get('Origin')
        });
    }
    next(error);
};
exports.corsErrorHandler = corsErrorHandler;
//# sourceMappingURL=cors.js.map