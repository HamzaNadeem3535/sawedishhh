export declare class Helpers {
    static generateId(): string;
    static generateReference(prefix?: string): string;
    static formatCurrency(amount: number, currency?: string): string;
    static formatDate(date: string | Date, locale?: string): string;
    static formatDateTime(date: string | Date, locale?: string): string;
    static calculatePercentage(value: number, total: number): number;
    static validateSwedishPersonalNumber(personalNumber: string): boolean;
    static validateSwedishOrganizationNumber(orgNumber: string): boolean;
    static sanitizeString(input: string): string;
    static generateInvoiceNumber(year?: number): string;
    static generateJournalEntryNumber(year?: number): string;
    static calculateTax(amount: number, taxRate: number): number;
    static calculateNetAmount(grossAmount: number, taxRate: number): number;
    static isValidEmail(email: string): boolean;
    static isValidUrl(url: string): boolean;
    static maskPersonalNumber(personalNumber: string): string;
    static maskBankAccount(accountNumber: string): string;
    static getDaysBetween(startDate: string | Date, endDate: string | Date): number;
    static isDateInRange(date: string | Date, startDate: string | Date, endDate: string | Date): boolean;
    static generateSecureToken(length?: number): string;
    static hashPassword(password: string): string;
    static comparePasswords(password: string, hashedPassword: string): boolean;
}
//# sourceMappingURL=helpers.d.ts.map