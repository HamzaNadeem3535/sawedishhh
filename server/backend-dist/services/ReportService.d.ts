export declare class ReportService {
    static generateBalanceSheet(foundationId: string, asOfDate: string): Promise<Record<string, any>>;
    static generateIncomeStatement(foundationId: string, startDate: string, endDate: string): Promise<Record<string, any>>;
    static generateCashFlowStatement(foundationId: string, startDate: string, endDate: string): Promise<Record<string, any>>;
    static generateComplianceReport(foundationId: string): Promise<Record<string, any>>;
    static exportReportToPDF(reportData: Record<string, any>, reportType: string): Promise<Buffer>;
    static exportReportToExcel(reportData: Record<string, any>, reportType: string): Promise<Buffer>;
    static exportReportToCSV(reportData: Record<string, any>): Promise<Buffer>;
}
//# sourceMappingURL=ReportService.d.ts.map