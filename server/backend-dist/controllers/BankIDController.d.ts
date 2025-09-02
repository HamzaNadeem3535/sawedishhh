import { Response } from 'express';
export declare class BankIDController {
    static initiateAuthentication: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static initiateSignature: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static checkStatus: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static completeProcess: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static cancelProcess: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getUserSessions: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=BankIDController.d.ts.map