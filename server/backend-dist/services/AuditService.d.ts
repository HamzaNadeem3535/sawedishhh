export interface AuditLogEntry {
    user_id?: string | undefined;
    foundation_id?: string | undefined;
    action: string;
    target_table?: string | undefined;
    target_id?: string | undefined;
    old_values?: Record<string, unknown> | undefined;
    new_values?: Record<string, unknown> | undefined;
    details?: Record<string, unknown> | undefined;
    ip_address?: string | undefined;
    user_agent?: string | undefined;
}
export declare class AuditService {
    static log(entry: AuditLogEntry): Promise<void>;
    static logFoundationAction(userId: string, foundationId: string, action: string, targetId?: string, oldValues?: Record<string, unknown>, newValues?: Record<string, unknown>, ipAddress?: string, userAgent?: string): Promise<void>;
    static logDocumentAction(userId: string, foundationId: string, action: string, documentId: string, oldValues?: Record<string, unknown>, newValues?: Record<string, unknown>, ipAddress?: string, userAgent?: string): Promise<void>;
    static logExpenseAction(userId: string, foundationId: string, action: string, expenseId: string, oldValues?: Record<string, unknown>, newValues?: Record<string, unknown>, ipAddress?: string, userAgent?: string): Promise<void>;
    static getAuditLogs(foundationId?: string, userId?: string, action?: string, targetTable?: string, limit?: number): Promise<unknown[]>;
}
//# sourceMappingURL=AuditService.d.ts.map