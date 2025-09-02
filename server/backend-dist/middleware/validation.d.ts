import { Request, Response, NextFunction } from 'express';
export declare const validateRequest: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateUUID: (value: string) => boolean;
export declare const validateEmail: (email: string) => boolean;
export declare const validateSwedishPersonalNumber: (personalNumber: string) => boolean;
export declare const validateSwedishPhoneNumber: (phone: string) => boolean;
export declare const sanitizeInput: (input: string) => string;
//# sourceMappingURL=validation.d.ts.map