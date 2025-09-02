export interface Expense {
    id: string;
    foundation_id: string;
    user_id: string;
    amount: number;
    currency: string;
    category: 'office_supplies' | 'travel' | 'meals' | 'utilities' | 'professional_services' | 'marketing' | 'other';
    description: string;
    receipt_url?: string;
    expense_date: string;
    status: 'pending' | 'approved' | 'rejected';
    approved_by?: string;
    approved_at?: string;
    rejection_reason?: string;
    created_at: string;
    updated_at: string;
}
export declare class ExpenseModel {
    static findById(id: string): Promise<Expense | null>;
    static findByFoundation(foundationId: string): Promise<Expense[]>;
    static findByUser(userId: string): Promise<Expense[]>;
    static create(expenseData: Partial<Expense>): Promise<Expense>;
    static update(id: string, expenseData: Partial<Expense>): Promise<Expense>;
    static delete(id: string): Promise<void>;
    static approve(id: string, approvedBy: string): Promise<Expense>;
    static reject(id: string, approvedBy: string, rejectionReason: string): Promise<Expense>;
}
//# sourceMappingURL=Expense.d.ts.map