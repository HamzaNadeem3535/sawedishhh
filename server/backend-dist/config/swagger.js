"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpecs = exports.setupSwagger = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Foundation Management System API',
            version: '1.0.0',
            description: 'Comprehensive API for Swedish Foundation Management System',
            contact: {
                name: 'Foundation Management Team',
                email: 'support@faasinova.se'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://api.faasinova.se'
                    : 'http://localhost:3001',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                Foundation: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        name: { type: 'string' },
                        registration_number: { type: 'string' },
                        status: {
                            type: 'string',
                            enum: ['pending_verification', 'active', 'inactive', 'suspended']
                        },
                        owner_user_id: { type: 'string', format: 'uuid' },
                        description: { type: 'string' },
                        address: { type: 'string' },
                        phone: { type: 'string' },
                        website: { type: 'string', format: 'uri' },
                        created_at: { type: 'string', format: 'date-time' },
                        updated_at: { type: 'string', format: 'date-time' }
                    }
                },
                Document: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        foundation_id: { type: 'string', format: 'uuid' },
                        uploaded_by: { type: 'string', format: 'uuid' },
                        document_type: {
                            type: 'string',
                            enum: ['articles_of_association', 'bylaws', 'financial_statement', 'board_resolution', 'other']
                        },
                        file_name: { type: 'string' },
                        file_path: { type: 'string' },
                        status: {
                            type: 'string',
                            enum: ['uploaded', 'pending_approval', 'approved', 'rejected']
                        },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Expense: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        foundation_id: { type: 'string', format: 'uuid' },
                        user_id: { type: 'string', format: 'uuid' },
                        amount: { type: 'number', minimum: 0 },
                        currency: { type: 'string', enum: ['SEK', 'EUR', 'USD'] },
                        category: {
                            type: 'string',
                            enum: ['office_supplies', 'travel', 'meals', 'utilities', 'professional_services', 'marketing', 'other']
                        },
                        description: { type: 'string' },
                        expense_date: { type: 'string', format: 'date' },
                        status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
                        created_at: { type: 'string', format: 'date-time' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        message: { type: 'string' },
                        details: { type: 'array', items: { type: 'object' } }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./routes/*.ts', './controllers/*.ts']
};
const specs = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpecs = specs;
const setupSwagger = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Foundation Management API Documentation'
    }));
};
exports.setupSwagger = setupSwagger;
//# sourceMappingURL=swagger.js.map