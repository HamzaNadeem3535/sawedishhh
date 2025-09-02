"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compressionHeaders = exports.compressionMiddleware = void 0;
const compression_1 = __importDefault(require("compression"));
exports.compressionMiddleware = (0, compression_1.default)({
    threshold: 1024,
    level: 6,
    memLevel: 8,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        const contentType = res.getHeader('content-type');
        if (contentType) {
            const skipTypes = [
                'image/',
                'video/',
                'audio/',
                'application/zip',
                'application/gzip',
                'application/x-rar-compressed',
                'application/pdf'
            ];
            if (skipTypes.some(type => contentType.startsWith(type))) {
                return false;
            }
        }
        return compression_1.default.filter(req, res);
    }
});
const compressionHeaders = (req, res, next) => {
    res.setHeader('Vary', 'Accept-Encoding');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    next();
};
exports.compressionHeaders = compressionHeaders;
//# sourceMappingURL=compression.js.map