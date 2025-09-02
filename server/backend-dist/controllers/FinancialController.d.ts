import { Response } from 'express';
export declare class FinancialController {
    static getAccounts: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static createAccount: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getJournalEntries: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static createJournalEntry: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getInvoices: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static createInvoice: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getBankAccounts: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static createBankAccount: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getBankTransactions: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static syncBankTransactions: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static reconcileTransaction: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getFinancialReports: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static generateFinancialReport: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=FinancialController.d.ts.map