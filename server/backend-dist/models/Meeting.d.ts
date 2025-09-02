export interface Meeting {
    id: string;
    foundation_id: string;
    organizer_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    location?: string;
    meeting_type: 'board_meeting' | 'general_assembly' | 'committee_meeting' | 'other';
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
    meeting_url?: string;
    attendees: string[];
    created_at: string;
    updated_at: string;
}
export interface MeetingMinutes {
    id: string;
    meeting_id: string;
    content: string;
    attendees_present: string[];
    decisions_made: any[];
    action_items: any[];
    created_by: string;
    approved_by?: string;
    approved_at?: string;
    status: 'draft' | 'pending_approval' | 'approved';
    created_at: string;
    updated_at: string;
}
export declare class MeetingModel {
    static findById(id: string): Promise<Meeting | null>;
    static findByFoundation(foundationId: string): Promise<Meeting[]>;
    static create(meetingData: Partial<Meeting>): Promise<Meeting>;
    static update(id: string, meetingData: Partial<Meeting>): Promise<Meeting>;
    static delete(id: string): Promise<void>;
    static getMinutes(meetingId: string): Promise<MeetingMinutes[]>;
    static createMinutes(minutesData: Partial<MeetingMinutes>): Promise<MeetingMinutes>;
    static updateMinutes(id: string, minutesData: Partial<MeetingMinutes>): Promise<MeetingMinutes>;
}
//# sourceMappingURL=Meeting.d.ts.map