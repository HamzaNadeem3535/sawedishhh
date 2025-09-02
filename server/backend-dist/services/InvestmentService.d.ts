export interface Investment {
    id: string;
    foundation_id: string;
    name: string;
    type: string;
    amount: number;
    current_value?: number;
    performance?: number;
    updated_at?: string;
}
export interface MarketData {
    symbol: string;
    current_price: number;
    change_percent: number;
    volume: number;
    last_updated: string;
}
export interface PortfolioSummary {
    total_invested: number;
    current_value: number;
    total_gain_loss: number;
    total_gain_loss_percent: number;
    by_type: Record<string, {
        invested: number;
        current_value: number;
        count: number;
    }>;
    performance_metrics: {
        best_performer: Investment | null;
        worst_performer: Investment | null;
        average_performance: number;
    };
}
export declare class InvestmentService {
    static getPortfolioSummary(foundationId: string): Promise<PortfolioSummary>;
    static updateInvestmentValues(foundationId: string): Promise<Investment[]>;
    private static fetchMarketData;
    static calculatePortfolioRisk(foundationId: string): Promise<Record<string, any>>;
    static generateInvestmentReport(foundationId: string, startDate: string, endDate: string): Promise<Record<string, any>>;
    static rebalancePortfolio(foundationId: string, targetAllocations: Record<string, number>): Promise<Record<string, any>>;
}
//# sourceMappingURL=InvestmentService.d.ts.map