export interface Investment {
    id: string;
    foundation_id: string;
    type: 'stock' | 'bond' | 'mutual_fund' | 'real_estate' | 'commodity' | 'cash' | 'other';
    name: string;
    amount: number;
    currency: string;
    acquisition_date: string;
    current_value?: number;
    performance?: number;
    notes?: string;
    managed_by: string;
    created_at: string;
    updated_at: string;
}
export declare class InvestmentModel {
    static findById(id: string): Promise<Investment | null>;
    static findByFoundation(foundationId: string): Promise<Investment[]>;
    static create(investmentData: Partial<Investment>): Promise<Investment>;
    static update(id: string, investmentData: Partial<Investment>): Promise<Investment>;
    static delete(id: string): Promise<void>;
    static updateValue(id: string, currentValue: number, performance?: number): Promise<Investment>;
    static getPortfolioSummary(foundationId: string): Promise<any>;
}
//# sourceMappingURL=Investment.d.ts.map