export declare class Validators {
    static isValidEmail(email: string): boolean;
    static isValidPassword(password: string): boolean;
    static isValidSwedishPersonalNumber(personalNumber: string): boolean;
    static isValidSwedishPhoneNumber(phone: string): boolean;
    static isValidSwedishOrganizationNumber(orgNumber: string): boolean;
    static isValidUrl(url: string): boolean;
    static isValidCurrency(currency: string): boolean;
    static isValidAmount(amount: number): boolean;
    static isValidDateRange(startDate: string, endDate: string): boolean;
    static isValidPercentage(value: number): boolean;
    static sanitizeString(input: string): string;
    static validateFileType(mimetype: string, allowedTypes: string[]): boolean;
    static validateFileSize(size: number, maxSize: number): boolean;
    static isValidAccountNumber(accountNumber: string, bankName: string): boolean;
    static isValidIBAN(iban: string): boolean;
    static validateBusinessHours(time: string): boolean;
    static validateMeetingDuration(startTime: string, endTime: string): boolean;
    static validateBudgetAmount(amount: number, foundationAssets: number): boolean;
    static validateTaxRate(rate: number): boolean;
    static validateEmployeeNumber(employeeNumber: string): boolean;
    static validateInvoiceNumber(invoiceNumber: string): boolean;
    static validateJournalEntryNumber(entryNumber: string): boolean;
}
//# sourceMappingURL=validators.d.ts.map