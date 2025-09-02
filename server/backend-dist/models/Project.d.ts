export interface Project {
    id: string;
    foundation_id: string;
    name: string;
    description?: string;
    status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
    start_date?: string;
    end_date?: string;
    budget?: number;
    currency?: string;
    project_manager_id?: string;
    progress_percentage: number;
    created_at: string;
    updated_at: string;
}
export interface Grant {
    id: string;
    project_id: string;
    grant_name: string;
    grantor_name: string;
    amount: number;
    currency: string;
    status: 'applied' | 'under_review' | 'awarded' | 'rejected' | 'completed' | 'cancelled';
    application_date: string;
    award_date?: string;
    completion_date?: string;
    requirements: any[];
    reporting_schedule: any[];
    notes?: string;
    created_at: string;
    updated_at: string;
}
export declare class ProjectModel {
    static findById(id: string): Promise<Project | null>;
    static findByFoundation(foundationId: string): Promise<Project[]>;
    static create(projectData: Partial<Project>): Promise<Project>;
    static update(id: string, projectData: Partial<Project>): Promise<Project>;
    static delete(id: string): Promise<void>;
    static updateProgress(id: string, progressPercentage: number): Promise<Project>;
    static getGrants(projectId: string): Promise<Grant[]>;
}
export declare class GrantModel {
    static findById(id: string): Promise<Grant | null>;
    static create(grantData: Partial<Grant>): Promise<Grant>;
    static update(id: string, grantData: Partial<Grant>): Promise<Grant>;
    static delete(id: string): Promise<void>;
}
//# sourceMappingURL=Project.d.ts.map