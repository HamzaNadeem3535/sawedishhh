import { Response } from 'express';
export declare class ExpenseController {
    static getExpenses: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getExpenseById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static createExpense: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static updateExpense: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static deleteExpense: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static approveExpense: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static rejectExpense: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static downloadReceipt: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=ExpenseController.d.ts.map