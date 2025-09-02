import { ComplianceItem } from '../types/governance';
export declare class ComplianceService {
    static checkUpcomingDeadlines(): Promise<ComplianceItem[]>;
    static sendComplianceReminders(): Promise<void>;
    static markOverdueItems(): Promise<void>;
    static generateComplianceReport(foundationId: string): Promise<Record<string, any>>;
    static validateComplianceRequirement(foundationId: string, requirementType: string, data: Record<string, any>): Promise<{
        valid: boolean;
        issues: string[];
    }>;
    static scheduleComplianceReminders(): Promise<void>;
}
//# sourceMappingURL=ComplianceService.d.ts.map