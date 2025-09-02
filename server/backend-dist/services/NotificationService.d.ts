export interface NotificationData {
    user_id: string;
    foundation_id?: string;
    type: 'document_approved' | 'meeting_scheduled' | 'expense_approved' | 'expense_rejected' | 'compliance_due' | 'general';
    title: string;
    message: string;
    data?: Record<string, any>;
    priority: 'low' | 'medium' | 'high' | 'urgent';
}
export declare class NotificationService {
    static sendNotification(notification: NotificationData): Promise<void>;
    static notifyDocumentApproval(userId: string, foundationId: string, documentName: string, approved: boolean): Promise<void>;
    static notifyMeetingScheduled(userIds: string[], foundationId: string, meetingTitle: string, meetingDate: string): Promise<void>;
    static notifyExpenseStatus(userId: string, foundationId: string, expenseDescription: string, approved: boolean, rejectionReason?: string): Promise<void>;
    static notifyComplianceDeadline(userId: string, foundationId: string, complianceTitle: string, dueDate: string, daysRemaining: number): Promise<void>;
    static notifyFoundationMembers(foundationId: string, notification: Omit<NotificationData, 'user_id' | 'foundation_id'>): Promise<void>;
}
//# sourceMappingURL=NotificationService.d.ts.map