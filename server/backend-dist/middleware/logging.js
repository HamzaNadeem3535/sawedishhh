"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performanceMonitoring = exports.errorLogging = exports.requestLogging = exports.Logger = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Logger {
    static logDir = path_1.default.join(process.cwd(), 'logs');
    static logFile = path_1.default.join(this.logDir, 'app.log');
    static init() {
        if (!fs_1.default.existsSync(this.logDir)) {
            fs_1.default.mkdirSync(this.logDir, { recursive: true });
        }
    }
    static log(level, message, meta) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            meta
        };
        const logMessage = `[${entry.timestamp}] ${level.toUpperCase()}: ${message}`;
        console.log(logMessage, meta ? JSON.stringify(meta, null, 2) : '');
        if (process.env.NODE_ENV === 'production') {
            const logLine = JSON.stringify(entry) + '\n';
            fs_1.default.appendFileSync(this.logFile, logLine);
        }
    }
    static info(message, meta) {
        this.log('info', message, meta);
    }
    static warn(message, meta) {
        this.log('warn', message, meta);
    }
    static error(message, meta) {
        this.log('error', message, meta);
    }
    static debug(message, meta) {
        if (process.env.NODE_ENV === 'development') {
            this.log('debug', message, meta);
        }
    }
}
exports.Logger = Logger;
const requestLogging = (req, res, next) => {
    const start = Date.now();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    Logger.info(`Request started: ${method} ${originalUrl}`, {
        ip,
        userAgent,
        body: method !== 'GET' ? req.body : undefined
    });
    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;
        const logLevel = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
        Logger.log(logLevel, `Request completed: ${method} ${originalUrl}`, {
            statusCode,
            duration,
            ip,
            userAgent
        });
    });
    next();
};
exports.requestLogging = requestLogging;
const errorLogging = (error, req, res, next) => {
    let errorInfo = {};
    if (typeof error === 'object' && error !== null) {
        const errObj = error;
        errorInfo = {
            message: errObj.message,
            stack: errObj.stack,
            name: errObj.name
        };
    }
    else {
        errorInfo = { message: String(error) };
    }
    Logger.error('Request error occurred', {
        error: errorInfo,
        request: {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            body: req.body
        }
    });
    next(error);
};
exports.errorLogging = errorLogging;
const performanceMonitoring = (req, res, next) => {
    const start = process.hrtime.bigint();
    res.on('finish', () => {
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000;
        if (duration > 1000) {
            Logger.warn(`Slow request detected: ${req.method} ${req.originalUrl}`, {
                duration: `${duration.toFixed(2)}ms`,
                ip: req.ip
            });
        }
        const memUsage = process.memoryUsage();
        if (memUsage.heapUsed > 100 * 1024 * 1024) {
            Logger.warn('High memory usage detected', {
                heapUsed: `${(memUsage.heapUsed / 1024 / 1024).toFixed(2)}MB`,
                heapTotal: `${(memUsage.heapTotal / 1024 / 1024).toFixed(2)}MB`
            });
        }
    });
    next();
};
exports.performanceMonitoring = performanceMonitoring;
Logger.init();
//# sourceMappingURL=logging.js.map