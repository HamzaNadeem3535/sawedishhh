"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_1 = require("./config/swagger");
const cors_2 = require("./config/cors");
const logging_1 = require("./middleware/logging");
const security_1 = require("./middleware/security");
const compression_1 = require("./middleware/compression");
const rateLimiter_1 = require("./middleware/rateLimiter");
const environment_1 = __importDefault(require("./config/environment"));
const bankid_1 = __importDefault(require("./routes/bankid"));
const database_1 = require("./config/database");
const auth_1 = __importDefault(require("./routes/auth"));
const foundations_1 = __importDefault(require("./routes/foundations"));
const documents_1 = __importDefault(require("./routes/documents"));
const meetings_1 = __importDefault(require("./routes/meetings"));
const expenses_1 = __importDefault(require("./routes/expenses"));
const investments_1 = __importDefault(require("./routes/investments"));
const projects_1 = __importDefault(require("./routes/projects"));
const grants_1 = __importDefault(require("./routes/grants"));
const profiles_1 = __importDefault(require("./routes/profiles"));
const financial_1 = __importDefault(require("./routes/financial"));
const governance_1 = __importDefault(require("./routes/governance"));
const reports_1 = __importDefault(require("./routes/reports"));
const errorHandler_1 = require("./middleware/errorHandler");
const env = environment_1.default.load();
const app = (0, express_1.default)();
const PORT = env.port;
(0, database_1.testConnection)();
app.use(security_1.securityHeaders);
app.use(compression_1.compressionHeaders);
app.use(compression_1.compressionMiddleware);
app.use(security_1.sanitizeInput);
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use(cors_2.corsErrorHandler);
app.use('/api/', rateLimiter_1.generalLimiter);
app.use('/api/auth/', rateLimiter_1.authLimiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, morgan_1.default)(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(logging_1.requestLogging);
app.use(logging_1.performanceMonitoring);
if (env.nodeEnv === 'development') {
    (0, swagger_1.setupSwagger)(app);
}
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: env.nodeEnv,
        version: '1.0.0'
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/foundations', foundations_1.default);
app.use('/api/documents', documents_1.default);
app.use('/api/meetings', meetings_1.default);
app.use('/api/expenses', expenses_1.default);
app.use('/api/investments', investments_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/grants', grants_1.default);
app.use('/api/profiles', profiles_1.default);
app.use('/api/financial', financial_1.default);
app.use('/api/governance', governance_1.default);
app.use('/api/reports', reports_1.default);
app.use('/api/bankid', bankid_1.default);
app.use(logging_1.errorLogging);
app.use(errorHandler_1.errorHandler);
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found on this server.'
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${env.nodeEnv}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    if (env.nodeEnv === 'development') {
        console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    }
});
exports.default = app;
//# sourceMappingURL=index.js.map