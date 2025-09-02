"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const MeetingController_1 = require("../controllers/MeetingController");
const validation_1 = require("../middleware/validation");
const router = express_1.default.Router();
router.get('/', [
    (0, express_validator_1.query)('foundation_id').optional().isUUID(),
    (0, express_validator_1.query)('status').optional().isIn(['scheduled', 'in_progress', 'completed', 'cancelled']),
    (0, express_validator_1.query)('meeting_type').optional().isIn(['board_meeting', 'general_assembly', 'committee_meeting', 'other'])
], validation_1.validateRequest, MeetingController_1.MeetingController.getMeetings);
router.get('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, MeetingController_1.MeetingController.getMeetingById);
router.post('/', [
    (0, express_validator_1.body)('foundation_id').isUUID(),
    (0, express_validator_1.body)('title').trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('description').optional().trim(),
    (0, express_validator_1.body)('start_time').isISO8601(),
    (0, express_validator_1.body)('end_time').isISO8601(),
    (0, express_validator_1.body)('location').optional().trim(),
    (0, express_validator_1.body)('meeting_type').isIn(['board_meeting', 'general_assembly', 'committee_meeting', 'other']),
    (0, express_validator_1.body)('attendees').optional().isArray()
], validation_1.validateRequest, MeetingController_1.MeetingController.createMeeting);
router.put('/:id', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('title').optional().trim().isLength({ min: 2 }),
    (0, express_validator_1.body)('description').optional().trim(),
    (0, express_validator_1.body)('start_time').optional().isISO8601(),
    (0, express_validator_1.body)('end_time').optional().isISO8601(),
    (0, express_validator_1.body)('location').optional().trim(),
    (0, express_validator_1.body)('status').optional().isIn(['scheduled', 'in_progress', 'completed', 'cancelled']),
    (0, express_validator_1.body)('attendees').optional().isArray()
], validation_1.validateRequest, MeetingController_1.MeetingController.updateMeeting);
router.delete('/:id', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, MeetingController_1.MeetingController.deleteMeeting);
router.get('/:id/minutes', [(0, express_validator_1.param)('id').isUUID()], validation_1.validateRequest, MeetingController_1.MeetingController.getMeetingMinutes);
router.post('/:id/minutes', [
    (0, express_validator_1.param)('id').isUUID(),
    (0, express_validator_1.body)('content').trim().isLength({ min: 10 }),
    (0, express_validator_1.body)('attendees_present').optional().isArray(),
    (0, express_validator_1.body)('decisions_made').optional().isArray(),
    (0, express_validator_1.body)('action_items').optional().isArray()
], validation_1.validateRequest, MeetingController_1.MeetingController.createMeetingMinutes);
exports.default = router;
//# sourceMappingURL=meetings.js.map