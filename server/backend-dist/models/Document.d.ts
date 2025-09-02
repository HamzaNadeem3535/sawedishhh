export interface Document {
    id: string;
    foundation_id: string;
    uploaded_by: string;
    document_type: 'articles_of_association' | 'bylaws' | 'financial_statement' | 'board_resolution' | 'other';
    file_name: string;
    file_path: string;
    file_size?: number;
    mime_type?: string;
    status: 'uploaded' | 'pending_approval' | 'approved' | 'rejected';
    approval_notes?: string;
    approved_by?: string;
    approved_at?: string;
    created_at: string;
    updated_at: string;
}
export interface DocumentVersion {
    id: string;
    document_id: string;
    version_number: number;
    file_path: string;
    file_name: string;
    file_size?: number;
    uploaded_by: string;
    change_notes?: string;
    created_at: string;
}
export declare class DocumentModel {
    static findById(id: string): Promise<Document | null>;
    static findByFoundation(foundationId: string): Promise<Document[]>;
    static create(documentData: Partial<Document>): Promise<Document>;
    static update(id: string, documentData: Partial<Document>): Promise<Document>;
    static delete(id: string): Promise<void>;
    static getVersions(documentId: string): Promise<DocumentVersion[]>;
    static createVersion(versionData: Partial<DocumentVersion>): Promise<DocumentVersion>;
}
//# sourceMappingURL=Document.d.ts.map