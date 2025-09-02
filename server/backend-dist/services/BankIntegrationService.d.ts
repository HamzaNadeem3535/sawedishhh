import { BankAccount, BankTransaction } from '../types/financial';
export interface BankAPICredentials {
    bank_name: string;
    api_endpoint: string;
    client_id: string;
    client_secret: string;
    certificate_path?: string;
}
export declare class BankIntegrationService {
    private static bankCredentials;
    static connectBankAccount(foundationId: string, bankName: string, accountNumber: string, iban?: string): Promise<BankAccount>;
    static syncTransactions(bankAccountId: string): Promise<BankTransaction[]>;
    private static generateMockTransactions;
    static reconcileTransaction(transactionId: string, journalEntryId?: string): Promise<BankTransaction>;
    static getAccountBalance(bankAccountId: string): Promise<number>;
    static updateAccountBalance(bankAccountId: string, newBalance: number): Promise<void>;
    static validateBankConnection(bankName: string, accountNumber: string): Promise<boolean>;
    static disconnectBankAccount(bankAccountId: string): Promise<void>;
}
//# sourceMappingURL=BankIntegrationService.d.ts.map