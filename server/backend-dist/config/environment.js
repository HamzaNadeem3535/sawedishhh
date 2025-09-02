"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const validators_1 = require("../utils/validators");
dotenv_1.default.config();
class Environment {
    static config;
    static load() {
        if (this.config) {
            return this.config;
        }
        const requiredVars = [
            'VITE_SUPABASE_URL',
            'VITE_SUPABASE_ANON_KEY',
            'VITE_SUPABASE_SERVICE_ROLE_KEY'
        ];
        const missing = requiredVars.filter(varName => !process.env[varName]);
        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
        this.config = {
            port: parseInt(process.env.PORT || '3001'),
            nodeEnv: process.env.NODE_ENV || 'development',
            frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
            supabaseUrl: process.env.VITE_SUPABASE_URL,
            supabaseAnonKey: process.env.VITE_SUPABASE_ANON_KEY,
            supabaseServiceKey: process.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
            jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
            jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
            maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
            allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
            smtpHost: process.env.SMTP_HOST,
            smtpPort: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined,
            smtpUser: process.env.SMTP_USER,
            smtpPass: process.env.SMTP_PASS,
            bankidEndpoint: process.env.BANKID_ENDPOINT,
            bankidCertPath: process.env.BANKID_CERT_PATH,
            bankidCertPassword: process.env.BANKID_CERT_PASSWORD,
            bankApiEndpoint: process.env.BANK_API_ENDPOINT,
            bankApiKey: process.env.BANK_API_KEY,
            logLevel: process.env.LOG_LEVEL || 'info',
            logFile: process.env.LOG_FILE,
            rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'),
            rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100')
        };
        this.validateConfig();
        return this.config;
    }
    static validateConfig() {
        const config = this.config;
        if (!validators_1.Validators.isValidUrl(config.supabaseUrl)) {
            throw new Error('Invalid Supabase URL');
        }
        if (!validators_1.Validators.isValidUrl(config.frontendUrl)) {
            throw new Error('Invalid frontend URL');
        }
        if (config.port < 1 || config.port > 65535) {
            throw new Error('Invalid port number');
        }
        if (config.maxFileSize < 1024 || config.maxFileSize > 100 * 1024 * 1024) {
            throw new Error('Invalid max file size');
        }
        if (config.smtpHost && !config.smtpUser) {
            throw new Error('SMTP user is required when SMTP host is configured');
        }
        console.log('✅ Environment configuration validated');
    }
    static get() {
        if (!this.config) {
            return this.load();
        }
        return this.config;
    }
    static isDevelopment() {
        return this.get().nodeEnv === 'development';
    }
    static isProduction() {
        return this.get().nodeEnv === 'production';
    }
    static isTest() {
        return this.get().nodeEnv === 'test';
    }
}
exports.default = Environment;
//# sourceMappingURL=environment.js.map