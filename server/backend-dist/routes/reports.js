"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const ReportController_1 = require("../controllers/ReportController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/dashboard', [(0, express_validator_1.query)('foundation_id').optional().isUUID()], validation_1.validateRequest, ReportController_1.ReportController.getDashboardAnalytics);
router.get('/financial-overview', [
    (0, express_validator_1.query)('foundation_id').optional().isUUID(),
    (0, express_validator_1.query)('period_start').optional().isDate(),
    (0, express_validator_1.query)('period_end').optional().isDate()
], validation_1.validateRequest, ReportController_1.ReportController.getFinancialOverview);
router.get('/expense-analytics', [(0, express_validator_1.query)('foundation_id').optional().isUUID()], validation_1.validateRequest, ReportController_1.ReportController.getExpenseAnalytics);
router.get('/investment-analytics', [(0, express_validator_1.query)('foundation_id').optional().isUUID()], validation_1.validateRequest, ReportController_1.ReportController.getInvestmentAnalytics);
router.get('/project-analytics', [(0, express_validator_1.query)('foundation_id').optional().isUUID()], validation_1.validateRequest, ReportController_1.ReportController.getProjectAnalytics);
router.get('/compliance-analytics', [(0, express_validator_1.query)('foundation_id').optional().isUUID()], validation_1.validateRequest, ReportController_1.ReportController.getComplianceAnalytics);
router.post('/export', [
    (0, express_validator_1.query)('foundation_id').optional().isUUID(),
    (0, express_validator_1.query)('report_type').isIn(['financial', 'compliance', 'governance', 'complete']),
    (0, express_validator_1.query)('format').optional().isIn(['pdf', 'excel', 'csv'])
], validation_1.validateRequest, ReportController_1.ReportController.exportReport);
exports.default = router;
//# sourceMappingURL=reports.js.map