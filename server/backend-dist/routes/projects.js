"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const ProjectController_1 = require("../controllers/ProjectController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/', [
    (0, express_validator_1.query)('foundation_id').optional().isUUID(),
    (0, express_validator_1.query)('status').optional().isIn(['planning', 'in_progress', 'completed', 'on_hold', 'cancelled'])
], validation_1.validateRequest, ProjectController_1.ProjectController.getProjects);
router.get('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, ProjectController_1.ProjectController.getProjectById);
router.post('/', [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('name').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('description').optional().trim(),
    (0, express_validator_1.body)('status').optional().isIn(['planning', 'in_progress', 'completed', 'on_hold', 'cancelled']),
    (0, express_validator_1.body)('start_date').optional().isDate(),
    (0, express_validator_1.body)('end_date').optional().isDate(),
    (0, express_validator_1.body)('budget').optional().isFloat({ min: 0 }),
    (0, express_validator_1.body)('project_manager_id').optional().isUUID()
], validation_1.validateRequest, ProjectController_1.ProjectController.createProject);
router.put('/:id', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('description').optional().trim(),
    (0, express_validator_1.body)('status').optional().isIn(['planning', 'in_progress', 'completed', 'on_hold', 'cancelled']),
    (0, express_validator_1.body)('start_date').optional().isDate(),
    (0, express_validator_1.body)('end_date').optional().isDate(),
    (0, express_validator_1.body)('budget').optional().isFloat({ min: 0 }),
    (0, express_validator_1.body)('progress_percentage').optional().isInt({ min: 0, max: 100 }),
    (0, express_validator_1.body)('project_manager_id').optional().isUUID()
], validation_1.validateRequest, ProjectController_1.ProjectController.updateProject);
router.delete('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, ProjectController_1.ProjectController.deleteProject);
router.post('/:id/progress', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('progress_percentage').isInt({ min: 0, max: 100 })
], validation_1.validateRequest, ProjectController_1.ProjectController.updateProjectProgress);
exports.default = router;
//# sourceMappingURL=projects.js.map