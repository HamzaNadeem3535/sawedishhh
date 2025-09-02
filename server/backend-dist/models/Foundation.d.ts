export interface Foundation {
    id: string;
    name: string;
    registration_number?: string;
    status: 'pending_verification' | 'active' | 'inactive' | 'suspended';
    owner_user_id: string;
    description?: string;
    address?: string;
    phone?: string;
    website?: string;
    created_at: string;
    updated_at: string;
}
export interface FoundationMember {
    foundation_id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'member' | 'viewer';
    permissions: Record<string, any>;
    invited_by?: string;
    joined_at: string;
    created_at: string;
}
export declare class FoundationModel {
    static findById(id: string): Promise<Foundation | null>;
    static findByUserId(userId: string): Promise<Foundation[]>;
    static create(foundationData: Partial<Foundation>): Promise<Foundation>;
    static update(id: string, foundationData: Partial<Foundation>): Promise<Foundation>;
    static delete(id: string): Promise<void>;
    static getMembers(foundationId: string): Promise<FoundationMember[]>;
    static addMember(memberData: Partial<FoundationMember>): Promise<FoundationMember>;
    static updateMember(foundationId: string, userId: string, memberData: Partial<FoundationMember>): Promise<FoundationMember>;
    static removeMember(foundationId: string, userId: string): Promise<void>;
    static checkUserAccess(foundationId: string, userId: string): Promise<FoundationMember | null>;
}
//# sourceMappingURL=Foundation.d.ts.map