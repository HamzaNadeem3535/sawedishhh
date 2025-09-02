import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth';
export interface PermissionCheck {
    foundation_id?: string;
    required_permissions: string[];
    require_all?: boolean;
}
export declare const checkPermissions: (permissionCheck: PermissionCheck) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireFoundationManagement: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireDocumentManagement: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireFinancialAccess: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireExpenseApproval: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireUserManagement: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireMeetingManagement: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireComplianceAccess: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireReportGeneration: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireFoundationOwner: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const checkResourceAccess: (resourceType: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=permissions.d.ts.map