export interface EmailOptions {
    to: string | string[];
    subject: string;
    text?: string;
    html?: string;
    attachments?: EmailAttachment[];
}
export interface EmailAttachment {
    filename: string;
    content: Buffer | string;
    contentType?: string;
}
export declare class EmailService {
    private static transporter;
    static sendEmail(options: EmailOptions): Promise<void>;
    static sendWelcomeEmail(email: string, fullName: string): Promise<void>;
    static sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
    static sendDocumentApprovalEmail(email: string, documentName: string, approved: boolean, foundationName: string): Promise<void>;
    static sendMeetingInvitation(emails: string[], meetingTitle: string, meetingDate: string, location?: string, meetingUrl?: string): Promise<void>;
    static sendExpenseStatusEmail(email: string, expenseDescription: string, amount: number, currency: string, approved: boolean, rejectionReason?: string): Promise<void>;
    static sendComplianceReminderEmail(email: string, complianceTitle: string, dueDate: string, daysRemaining: number): Promise<void>;
}
//# sourceMappingURL=EmailService.d.ts.map