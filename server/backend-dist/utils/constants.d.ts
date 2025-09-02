export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly NO_CONTENT: 204;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly CONFLICT: 409;
    readonly UNPROCESSABLE_ENTITY: 422;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly SERVICE_UNAVAILABLE: 503;
};
export declare const FOUNDATION_STATUS: {
    readonly PENDING_VERIFICATION: "pending_verification";
    readonly ACTIVE: "active";
    readonly INACTIVE: "inactive";
    readonly SUSPENDED: "suspended";
};
export declare const DOCUMENT_TYPES: {
    readonly ARTICLES_OF_ASSOCIATION: "articles_of_association";
    readonly BYLAWS: "bylaws";
    readonly FINANCIAL_STATEMENT: "financial_statement";
    readonly BOARD_RESOLUTION: "board_resolution";
    readonly OTHER: "other";
};
export declare const DOCUMENT_STATUS: {
    readonly UPLOADED: "uploaded";
    readonly PENDING_APPROVAL: "pending_approval";
    readonly APPROVED: "approved";
    readonly REJECTED: "rejected";
};
export declare const MEETING_TYPES: {
    readonly BOARD_MEETING: "board_meeting";
    readonly GENERAL_ASSEMBLY: "general_assembly";
    readonly COMMITTEE_MEETING: "committee_meeting";
    readonly OTHER: "other";
};
export declare const MEETING_STATUS: {
    readonly SCHEDULED: "scheduled";
    readonly IN_PROGRESS: "in_progress";
    readonly COMPLETED: "completed";
    readonly CANCELLED: "cancelled";
};
export declare const EXPENSE_CATEGORIES: {
    readonly OFFICE_SUPPLIES: "office_supplies";
    readonly TRAVEL: "travel";
    readonly MEALS: "meals";
    readonly UTILITIES: "utilities";
    readonly PROFESSIONAL_SERVICES: "professional_services";
    readonly MARKETING: "marketing";
    readonly OTHER: "other";
};
export declare const EXPENSE_STATUS: {
    readonly PENDING: "pending";
    readonly APPROVED: "approved";
    readonly REJECTED: "rejected";
};
export declare const INVESTMENT_TYPES: {
    readonly STOCK: "stock";
    readonly BOND: "bond";
    readonly MUTUAL_FUND: "mutual_fund";
    readonly REAL_ESTATE: "real_estate";
    readonly COMMODITY: "commodity";
    readonly CASH: "cash";
    readonly OTHER: "other";
};
export declare const PROJECT_STATUS: {
    readonly PLANNING: "planning";
    readonly IN_PROGRESS: "in_progress";
    readonly COMPLETED: "completed";
    readonly ON_HOLD: "on_hold";
    readonly CANCELLED: "cancelled";
};
export declare const GRANT_STATUS: {
    readonly APPLIED: "applied";
    readonly UNDER_REVIEW: "under_review";
    readonly AWARDED: "awarded";
    readonly REJECTED: "rejected";
    readonly COMPLETED: "completed";
    readonly CANCELLED: "cancelled";
};
export declare const CURRENCIES: {
    readonly SEK: "SEK";
    readonly EUR: "EUR";
    readonly USD: "USD";
    readonly NOK: "NOK";
    readonly DKK: "DKK";
};
export declare const ROLES: {
    readonly OWNER: "owner";
    readonly ADMIN: "admin";
    readonly MEMBER: "member";
    readonly VIEWER: "viewer";
};
export declare const PERMISSIONS: {
    readonly MANAGE_FOUNDATION: "manage_foundation";
    readonly VIEW_FOUNDATION: "view_foundation";
    readonly MANAGE_USERS: "manage_users";
    readonly INVITE_USERS: "invite_users";
    readonly UPLOAD_DOCUMENTS: "upload_documents";
    readonly APPROVE_DOCUMENTS: "approve_documents";
    readonly VIEW_DOCUMENTS: "view_documents";
    readonly SCHEDULE_MEETINGS: "schedule_meetings";
    readonly CREATE_MINUTES: "create_minutes";
    readonly APPROVE_MINUTES: "approve_minutes";
    readonly MANAGE_EXPENSES: "manage_expenses";
    readonly APPROVE_EXPENSES: "approve_expenses";
    readonly MANAGE_INVESTMENTS: "manage_investments";
    readonly VIEW_FINANCIAL_DATA: "view_financial_data";
    readonly MANAGE_COMPLIANCE: "manage_compliance";
    readonly VIEW_AUDIT_LOGS: "view_audit_logs";
    readonly MANAGE_WORKFLOWS: "manage_workflows";
    readonly GENERATE_REPORTS: "generate_reports";
    readonly EXPORT_DATA: "export_data";
};
export declare const REGULATION_TYPES: {
    readonly LANSSTYRELSEN: "lansstyrelsen";
    readonly SKATTEVERKET: "skatteverket";
    readonly BOLAGSVERKET: "bolagsverket";
    readonly OTHER: "other";
};
export declare const COMPLIANCE_PRIORITIES: {
    readonly LOW: "low";
    readonly MEDIUM: "medium";
    readonly HIGH: "high";
    readonly CRITICAL: "critical";
};
export declare const ACCOUNT_TYPES: {
    readonly ASSET: "asset";
    readonly LIABILITY: "liability";
    readonly EQUITY: "equity";
    readonly REVENUE: "revenue";
    readonly EXPENSE: "expense";
};
export declare const JOURNAL_ENTRY_STATUS: {
    readonly DRAFT: "draft";
    readonly POSTED: "posted";
    readonly REVERSED: "reversed";
};
export declare const INVOICE_STATUS: {
    readonly DRAFT: "draft";
    readonly SENT: "sent";
    readonly PAID: "paid";
    readonly OVERDUE: "overdue";
    readonly CANCELLED: "cancelled";
};
export declare const BANK_ACCOUNT_TYPES: {
    readonly CHECKING: "checking";
    readonly SAVINGS: "savings";
    readonly BUSINESS: "business";
};
export declare const REPORT_TYPES: {
    readonly BALANCE_SHEET: "balance_sheet";
    readonly INCOME_STATEMENT: "income_statement";
    readonly CASH_FLOW: "cash_flow";
    readonly TRIAL_BALANCE: "trial_balance";
    readonly TAX_REPORT: "tax_report";
};
export declare const FILE_UPLOAD_LIMITS: {
    readonly MAX_FILE_SIZE: number;
    readonly ALLOWED_DOCUMENT_TYPES: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/jpg", "image/png"];
    readonly ALLOWED_RECEIPT_TYPES: readonly ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
};
export declare const VALIDATION_RULES: {
    readonly PASSWORD_MIN_LENGTH: 6;
    readonly FOUNDATION_NAME_MIN_LENGTH: 2;
    readonly DESCRIPTION_MIN_LENGTH: 10;
    readonly PERSONAL_NUMBER_REGEX: RegExp;
    readonly PHONE_NUMBER_REGEX: RegExp;
    readonly ORGANIZATION_NUMBER_REGEX: RegExp;
};
export declare const API_RATE_LIMITS: {
    readonly WINDOW_MS: number;
    readonly MAX_REQUESTS: 100;
    readonly BANKID_WINDOW_MS: number;
    readonly BANKID_MAX_REQUESTS: 10;
};
//# sourceMappingURL=constants.d.ts.map