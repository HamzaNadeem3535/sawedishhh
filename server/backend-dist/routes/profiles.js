"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const ProfileController_1 = require("../controllers/ProfileController");
const validation_1 = require("../middleware/validation");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.get('/me', ProfileController_1.ProfileController.getCurrentProfile);
router.put('/me', [
    (0, express_validator_1.body)('full_name').optional().trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('avatar_url').optional().isURL()
], validation_1.validateRequest, ProfileController_1.ProfileController.updateCurrentProfile);
router.post('/me/avatar', upload_1.upload.single('avatar'), ProfileController_1.ProfileController.uploadAvatar);
router.get('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, ProfileController_1.ProfileController.getProfileById);
router.get('/search/:query', [(0, express_validator_1.param)('query').trim().isLength({ min: 2 })], validation_1.validateRequest, ProfileController_1.ProfileController.searchProfiles);
exports.default = router;
//# sourceMappingURL=profiles.js.map