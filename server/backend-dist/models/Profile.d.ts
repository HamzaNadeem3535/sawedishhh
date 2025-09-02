export interface Profile {
    id: string;
    full_name: string;
    avatar_url?: string;
    email: string;
    created_at: string;
    updated_at: string;
}
export declare class ProfileModel {
    static findById(id: string): Promise<Profile | null>;
    static findByEmail(email: string): Promise<Profile | null>;
    static create(profileData: Partial<Profile>): Promise<Profile>;
    static update(id: string, profileData: Partial<Profile>): Promise<Profile>;
    static delete(id: string): Promise<void>;
    static search(query: string): Promise<Profile[]>;
}
//# sourceMappingURL=Profile.d.ts.map