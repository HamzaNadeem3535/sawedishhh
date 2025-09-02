import { BankIDSession, BankIDCompletionData } from '../types/governance';
export declare class BankIDService {
    private static readonly BANKID_ENDPOINT;
    static initiateAuthentication(personalNumber: string, userId: string): Promise<BankIDSession>;
    static initiateSignature(personalNumber: string, userId: string, documentId: string): Promise<BankIDSession>;
    static checkStatus(orderRef: string): Promise<BankIDSession | null>;
    static completeSession(orderRef: string, completionData: BankIDCompletionData): Promise<BankIDSession>;
    static failSession(orderRef: string, reason: string): Promise<void>;
    static cancelSession(orderRef: string): Promise<void>;
    static validatePersonalNumber(personalNumber: string): boolean;
    static generateDigitalSignature(data: string, privateKey: string): string;
    static verifyDigitalSignature(data: string, signature: string, publicKey: string): boolean;
}
//# sourceMappingURL=BankIDService.d.ts.map