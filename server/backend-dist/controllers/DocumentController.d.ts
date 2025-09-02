import { Response } from 'express';
export declare class DocumentController {
    static getDocuments: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getDocumentById: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static uploadDocument: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static updateDocument: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static deleteDocument: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static downloadDocument: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static getDocumentVersions: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
    static uploadDocumentVersion: (req: import("express").Request, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=DocumentController.d.ts.map