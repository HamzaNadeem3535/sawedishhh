"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const database_1 = require("../config/database");
class NotificationService {
    static async sendNotification(notification) {
        try {
            console.log('Notification sent:', {
                to: notification.user_id,
                type: notification.type,
                title: notification.title,
                message: notification.message
            });
        }
        catch (error) {
            console.error('Failed to send notification:', error);
        }
    }
    static async notifyDocumentApproval(userId, foundationId, documentName, approved) {
        await this.sendNotification({
            user_id: userId,
            foundation_id: foundationId,
            type: 'document_approved',
            title: `Document ${approved ? 'Approved' : 'Rejected'}`,
            message: `Your document "${documentName}" has been ${approved ? 'approved' : 'rejected'}.`,
            priority: 'medium'
        });
    }
    static async notifyMeetingScheduled(userIds, foundationId, meetingTitle, meetingDate) {
        for (const userId of userIds) {
            await this.sendNotification({
                user_id: userId,
                foundation_id: foundationId,
                type: 'meeting_scheduled',
                title: 'New Meeting Scheduled',
                message: `A new meeting "${meetingTitle}" has been scheduled for ${new Date(meetingDate).toLocaleDateString()}.`,
                priority: 'medium'
            });
        }
    }
    static async notifyExpenseStatus(userId, foundationId, expenseDescription, approved, rejectionReason) {
        await this.sendNotification({
            user_id: userId,
            foundation_id: foundationId,
            type: approved ? 'expense_approved' : 'expense_rejected',
            title: `Expense ${approved ? 'Approved' : 'Rejected'}`,
            message: approved
                ? `Your expense "${expenseDescription}" has been approved.`
                : `Your expense "${expenseDescription}" has been rejected. Reason: ${rejectionReason}`,
            priority: 'medium'
        });
    }
    static async notifyComplianceDeadline(userId, foundationId, complianceTitle, dueDate, daysRemaining) {
        const priority = daysRemaining <= 3 ? 'urgent' : daysRemaining <= 7 ? 'high' : 'medium';
        await this.sendNotification({
            user_id: userId,
            foundation_id: foundationId,
            type: 'compliance_due',
            title: 'Compliance Deadline Approaching',
            message: `"${complianceTitle}" is due in ${daysRemaining} days (${new Date(dueDate).toLocaleDateString()}).`,
            priority
        });
    }
    static async notifyFoundationMembers(foundationId, notification) {
        const { data: members, error } = await database_1.supabase
            .from('foundation_members')
            .select('user_id')
            .eq('foundation_id', foundationId);
        if (error) {
            console.error('Failed to get foundation members for notification:', error);
            return;
        }
        for (const member of members || []) {
            await this.sendNotification({
                ...notification,
                user_id: member.user_id,
                foundation_id: foundationId
            });
        }
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=NotificationService.js.map