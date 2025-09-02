"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const DocumentController_1 = require("../controllers/DocumentController");
const validation_1 = require("../middleware/validation");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.get('/', [
    (0, express_validator_1.query)('foundation_id').optional().isUUID(),
    (0, express_validator_1.query)('document_type').optional().isIn(['articles_of_association', 'bylaws', 'financial_statement', 'board_resolution', 'other']),
    (0, express_validator_1.query)('status').optional().isIn(['uploaded', 'pending_approval', 'approved', 'rejected'])
], validation_1.validateRequest, DocumentController_1.DocumentController.getDocuments);
router.get('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, DocumentController_1.DocumentController.getDocumentById);
router.post('/', upload_1.upload.single('document'), [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('document_type').isIn(['articles_of_association', 'bylaws', 'financial_statement', 'board_resolution', 'other']),
    (0, express_validator_1.body)('notes').optional().trim()
], validation_1.validateRequest, DocumentController_1.DocumentController.uploadDocument);
router.put('/:id', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('status').optional().isIn(['uploaded', 'pending_approval', 'approved', 'rejected']),
    (0, express_validator_1.body)('approval_notes').optional().trim()
], validation_1.validateRequest, DocumentController_1.DocumentController.updateDocument);
router.delete('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, DocumentController_1.DocumentController.deleteDocument);
router.get('/:id/download', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, DocumentController_1.DocumentController.downloadDocument);
router.get('/:id/versions', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, DocumentController_1.DocumentController.getDocumentVersions);
router.post('/:id/versions', upload_1.upload.single('document'), [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('change_notes').optional().trim()
], validation_1.validateRequest, DocumentController_1.DocumentController.uploadDocumentVersion);
exports.default = router;
//# sourceMappingURL=documents.js.map