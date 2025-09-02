"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankIntegrationService = void 0;
const database_1 = require("../config/database");
class BankIntegrationService {
    static bankCredentials = new Map([
        ['swedbank', {
                bank_name: 'Swedbank',
                api_endpoint: 'https://api.swedbank.se/v1/',
                client_id: process.env.SWEDBANK_CLIENT_ID || '',
                client_secret: process.env.SWEDBANK_CLIENT_SECRET || ''
            }],
        ['handelsbanken', {
                bank_name: 'Handelsbanken',
                api_endpoint: 'https://api.handelsbanken.se/v1/',
                client_id: process.env.HANDELSBANKEN_CLIENT_ID || '',
                client_secret: process.env.HANDELSBANKEN_CLIENT_SECRET || ''
            }],
        ['seb', {
                bank_name: 'SEB',
                api_endpoint: 'https://api.seb.se/v1/',
                client_id: process.env.SEB_CLIENT_ID || '',
                client_secret: process.env.SEB_CLIENT_SECRET || ''
            }]
    ]);
    static async connectBankAccount(foundationId, bankName, accountNumber, iban) {
        const credentials = this.bankCredentials.get(bankName.toLowerCase());
        if (!credentials) {
            throw new Error(`Bank ${bankName} is not supported`);
        }
        const { data: account, error } = await database_1.supabase
            .from('bank_accounts')
            .insert({
            foundation_id: foundationId,
            account_name: `${bankName} Account`,
            bank_name: bankName,
            account_number: accountNumber,
            iban,
            currency: 'SEK',
            account_type: 'business',
            current_balance: 0,
            is_primary: false,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to create bank account: ${error.message}`);
        }
        return account;
    }
    static async syncTransactions(bankAccountId) {
        const { data: account, error: accountError } = await database_1.supabase
            .from('bank_accounts')
            .select('*')
            .eq('id', bankAccountId)
            .single();
        if (accountError) {
            throw new Error(`Bank account not found: ${accountError.message}`);
        }
        const credentials = this.bankCredentials.get(account.bank_name.toLowerCase());
        if (!credentials) {
            throw new Error(`Bank ${account.bank_name} integration not configured`);
        }
        const mockTransactions = this.generateMockTransactions(bankAccountId);
        const { data: transactions, error } = await database_1.supabase
            .from('bank_transactions')
            .insert(mockTransactions)
            .select();
        if (error) {
            throw new Error(`Failed to sync transactions: ${error.message}`);
        }
        await database_1.supabase
            .from('bank_accounts')
            .update({ last_sync_at: new Date().toISOString() })
            .eq('id', bankAccountId);
        return transactions || [];
    }
    static generateMockTransactions(bankAccountId) {
        const transactions = [];
        const today = new Date();
        for (let i = 0; i < 5; i++) {
            const transactionDate = new Date(today);
            transactionDate.setDate(today.getDate() - i);
            const isCredit = Math.random() > 0.5;
            const amount = isCredit
                ? Math.floor(Math.random() * 50000) + 1000
                : -(Math.floor(Math.random() * 15000) + 500);
            transactions.push({
                bank_account_id: bankAccountId,
                transaction_date: transactionDate.toISOString().split('T')[0] ?? '',
                description: isCredit
                    ? `Donation from ${['Green Tech AB', 'Eco Solutions', 'Sustainable Corp'][Math.floor(Math.random() * 3)]}`
                    : `Payment to ${['Office Supplies', 'Legal Services', 'Utilities'][Math.floor(Math.random() * 3)]}`,
                reference_number: `REF-${Date.now()}-${i}`,
                amount,
                transaction_type: isCredit ? 'credit' : 'debit',
                balance_after: 1000000 + amount,
                category: isCredit ? 'Donations' : 'Operating Expenses',
                is_reconciled: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }
        return transactions;
    }
    static async reconcileTransaction(transactionId, journalEntryId) {
        const { data: transaction, error } = await database_1.supabase
            .from('bank_transactions')
            .update({
            is_reconciled: true,
            journal_entry_id: journalEntryId,
            updated_at: new Date().toISOString()
        })
            .eq('id', transactionId)
            .select()
            .single();
        if (error) {
            throw new Error(`Failed to reconcile transaction: ${error.message}`);
        }
        return transaction;
    }
    static async getAccountBalance(bankAccountId) {
        const { data: account, error } = await database_1.supabase
            .from('bank_accounts')
            .select('current_balance')
            .eq('id', bankAccountId)
            .single();
        if (error) {
            throw new Error(`Failed to get account balance: ${error.message}`);
        }
        return account.current_balance;
    }
    static async updateAccountBalance(bankAccountId, newBalance) {
        const { error } = await database_1.supabase
            .from('bank_accounts')
            .update({
            current_balance: newBalance,
            updated_at: new Date().toISOString()
        })
            .eq('id', bankAccountId);
        if (error) {
            throw new Error(`Failed to update account balance: ${error.message}`);
        }
    }
    static async validateBankConnection(bankName, accountNumber) {
        const credentials = this.bankCredentials.get(bankName.toLowerCase());
        if (!credentials) {
            return false;
        }
        return true;
    }
    static async disconnectBankAccount(bankAccountId) {
        const { error } = await database_1.supabase
            .from('bank_accounts')
            .update({
            is_active: false,
            updated_at: new Date().toISOString()
        })
            .eq('id', bankAccountId);
        if (error) {
            throw new Error(`Failed to disconnect bank account: ${error.message}`);
        }
    }
}
exports.BankIntegrationService = BankIntegrationService;
//# sourceMappingURL=BankIntegrationService.js.map