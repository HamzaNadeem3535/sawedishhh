export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export interface Foundation {
  id: string;
  name: string;
  registration_number: string;
  status: 'pending_verification' | 'active' | 'inactive' | 'suspended';
  owner_user_id: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  foundation_id: string;
  uploaded_by: string;
  document_type: 'articles_of_association' | 'bylaws' | 'financial_statement' | 'board_resolution' | 'other';
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: 'uploaded' | 'pending_approval' | 'approved' | 'rejected';
  approval_notes?: string;
  approved_by?: string;
  approved_at?: string;
  current_version: number;
  created_at: string;
  updated_at: string;
}

export interface DocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  change_notes?: string;
  uploaded_by: string;
  created_at: string;
}

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
  attendees: string[];
  created_at: string;
}

export interface Expense {
  id: string;
  foundation_id: string;
  user_id: string;
  amount: number;
  currency: string;
  category: 'office_supplies' | 'travel' | 'meals' | 'utilities' | 'professional_services' | 'marketing' | 'other';
  description: string;
  receipt_url?: string;
  expense_date: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

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
  created_at: string;
}

export interface Project {
  id: string;
  foundation_id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  start_date?: string;
  end_date?: string;
  budget?: number;
  progress_percentage: number;
  created_at: string;
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
  created_at: string;
}

// Mock Data
export const mockUser: User = {
  id: '1',
  full_name: 'John Doe',
  email: 'john.doe@example.com',
  avatar_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
  created_at: '2024-01-15T10:00:00Z'
};

export const mockFoundations: Foundation[] = [
  {
    id: '1',
    name: 'Green Future Foundation',
    registration_number: 'GFF-2024-001',
    status: 'active',
    owner_user_id: '1',
    description: 'Dedicated to environmental sustainability and green technology initiatives.',
    address: 'Stockholm, Sweden',
    phone: '+46 8 123 456 78',
    website: 'https://greenfuture.se',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Education for All Foundation',
    registration_number: 'EFA-2024-002',
    status: 'pending_verification',
    owner_user_id: '1',
    description: 'Promoting equal access to quality education worldwide.',
    address: 'Gothenburg, Sweden',
    phone: '+46 31 987 654 32',
    created_at: '2024-02-01T14:30:00Z',
    updated_at: '2024-02-01T14:30:00Z'
  }
];

export const mockDocuments: Document[] = [
  {
    id: '1',
    foundation_id: '1',
    uploaded_by: '1',
    document_type: 'articles_of_association',
    file_name: 'Articles_of_Association_GFF.pdf',
    file_path: '/documents/articles_gff.pdf',
    file_size: 2048576,
    mime_type: 'application/pdf',
    status: 'approved',
    approval_notes: 'Document approved by board',
    approved_by: '2',
    approved_at: '2024-01-17T11:30:00Z',
    current_version: 3,
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-01-17T11:30:00Z'
  },
  {
    id: '2',
    foundation_id: '1',
    uploaded_by: '1',
    document_type: 'financial_statement',
    file_name: 'Financial_Statement_Q1_2024.pdf',
    file_path: '/documents/financial_q1_2024.pdf',
    file_size: 1536000,
    mime_type: 'application/pdf',
    status: 'pending_approval',
    current_version: 1,
    created_at: '2024-03-01T15:45:00Z',
    updated_at: '2024-03-01T15:45:00Z'
  },
  {
    id: '3',
    foundation_id: '1',
    uploaded_by: '1',
    document_type: 'bylaws',
    file_name: 'Foundation_Bylaws_v2.pdf',
    file_path: '/documents/bylaws_v2.pdf',
    file_size: 1024000,
    mime_type: 'application/pdf',
    status: 'approved',
    approval_notes: 'Updated bylaws approved',
    approved_by: '2',
    approved_at: '2024-02-15T14:20:00Z',
    current_version: 2,
    created_at: '2024-02-10T10:00:00Z',
    updated_at: '2024-02-15T14:20:00Z'
  },
  {
    id: '4',
    foundation_id: '1',
    uploaded_by: '1',
    document_type: 'board_resolution',
    file_name: 'Board_Resolution_2024_001.pdf',
    file_path: '/documents/board_resolution_001.pdf',
    file_size: 512000,
    mime_type: 'application/pdf',
    status: 'approved',
    approval_notes: 'Board resolution approved unanimously',
    approved_by: '2',
    approved_at: '2024-01-20T16:00:00Z',
    current_version: 1,
    created_at: '2024-01-18T13:00:00Z',
    updated_at: '2024-01-20T16:00:00Z'
  },
  {
    id: '5',
    foundation_id: '2',
    uploaded_by: '1',
    document_type: 'articles_of_association',
    file_name: 'EFA_Articles_of_Association.pdf',
    file_path: '/documents/efa_articles.pdf',
    file_size: 1792000,
    mime_type: 'application/pdf',
    status: 'uploaded',
    current_version: 1,
    created_at: '2024-02-01T14:30:00Z',
    updated_at: '2024-02-01T14:30:00Z'
  }
];

export const mockDocumentVersions: DocumentVersion[] = [
  // Articles of Association versions
  {
    id: 'v1_1',
    document_id: '1',
    version_number: 1,
    file_name: 'Articles_of_Association_GFF_v1.pdf',
    file_path: '/documents/articles_gff_v1.pdf',
    file_size: 1892352,
    mime_type: 'application/pdf',
    change_notes: 'Initial version',
    uploaded_by: '1',
    created_at: '2024-01-16T09:00:00Z'
  },
  {
    id: 'v1_2',
    document_id: '1',
    version_number: 2,
    file_name: 'Articles_of_Association_GFF_v2.pdf',
    file_path: '/documents/articles_gff_v2.pdf',
    file_size: 1955840,
    mime_type: 'application/pdf',
    change_notes: 'Updated board composition and voting procedures',
    uploaded_by: '1',
    created_at: '2024-01-16T16:30:00Z'
  },
  {
    id: 'v1_3',
    document_id: '1',
    version_number: 3,
    file_name: 'Articles_of_Association_GFF_v3.pdf',
    file_path: '/documents/articles_gff_v3.pdf',
    file_size: 2048576,
    mime_type: 'application/pdf',
    change_notes: 'Final approved version with legal review',
    uploaded_by: '1',
    created_at: '2024-01-17T09:00:00Z'
  },
  // Bylaws versions
  {
    id: 'v3_1',
    document_id: '3',
    version_number: 1,
    file_name: 'Foundation_Bylaws_v1.pdf',
    file_path: '/documents/bylaws_v1.pdf',
    file_size: 896000,
    mime_type: 'application/pdf',
    change_notes: 'Initial bylaws document',
    uploaded_by: '1',
    created_at: '2024-02-10T10:00:00Z'
  },
  {
    id: 'v3_2',
    document_id: '3',
    version_number: 2,
    file_name: 'Foundation_Bylaws_v2.pdf',
    file_path: '/documents/bylaws_v2.pdf',
    file_size: 1024000,
    mime_type: 'application/pdf',
    change_notes: 'Updated meeting procedures and member rights',
    uploaded_by: '1',
    created_at: '2024-02-12T14:00:00Z'
  },
  // Financial Statement versions
  {
    id: 'v2_1',
    document_id: '2',
    version_number: 1,
    file_name: 'Financial_Statement_Q1_2024.pdf',
    file_path: '/documents/financial_q1_2024.pdf',
    file_size: 1536000,
    mime_type: 'application/pdf',
    change_notes: 'Q1 2024 financial statement',
    uploaded_by: '1',
    created_at: '2024-03-01T15:45:00Z'
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: '1',
    foundation_id: '1',
    organizer_id: '1',
    title: 'Board Meeting - Q1 Review',
    description: 'Quarterly review of foundation activities and financial status.',
    start_time: '2024-04-15T14:00:00Z',
    end_time: '2024-04-15T16:00:00Z',
    location: 'Stockholm Office',
    meeting_type: 'board_meeting',
    status: 'scheduled',
    attendees: ['1', '2', '3'],
    created_at: '2024-03-20T10:00:00Z'
  },
  {
    id: '2',
    foundation_id: '1',
    organizer_id: '1',
    title: 'Annual General Assembly',
    description: 'Annual meeting with all stakeholders.',
    start_time: '2024-05-20T10:00:00Z',
    end_time: '2024-05-20T15:00:00Z',
    location: 'Conference Center Stockholm',
    meeting_type: 'general_assembly',
    status: 'scheduled',
    attendees: ['1', '2', '3', '4', '5'],
    created_at: '2024-04-01T12:00:00Z'
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    foundation_id: '1',
    user_id: '1',
    amount: 2500.00,
    currency: 'SEK',
    category: 'office_supplies',
    description: 'Office furniture and equipment',
    receipt_url: '/receipts/office_supplies_receipt.pdf',
    expense_date: '2024-03-15',
    status: 'approved',
    created_at: '2024-03-16T08:30:00Z'
  },
  {
    id: '2',
    foundation_id: '1',
    user_id: '1',
    amount: 1200.00,
    currency: 'SEK',
    category: 'travel',
    description: 'Business trip to Gothenburg',
    expense_date: '2024-03-20',
    status: 'pending',
    created_at: '2024-03-21T14:15:00Z'
  }
];

export const mockInvestments: Investment[] = [
  {
    id: '1',
    foundation_id: '1',
    type: 'stock',
    name: 'Green Energy Corp',
    amount: 50000.00,
    currency: 'SEK',
    acquisition_date: '2024-01-20',
    current_value: 52500.00,
    performance: 5.0,
    notes: 'Sustainable energy company with strong growth potential',
    created_at: '2024-01-20T12:00:00Z'
  },
  {
    id: '2',
    foundation_id: '1',
    type: 'bond',
    name: 'Swedish Government Bond',
    amount: 100000.00,
    currency: 'SEK',
    acquisition_date: '2024-02-01',
    current_value: 101200.00,
    performance: 1.2,
    notes: 'Low-risk government bond',
    created_at: '2024-02-01T10:30:00Z'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    foundation_id: '1',
    name: 'Solar Panel Initiative',
    description: 'Installing solar panels in rural communities',
    status: 'in_progress',
    start_date: '2024-02-01',
    end_date: '2024-12-31',
    budget: 500000.00,
    progress_percentage: 35,
    created_at: '2024-01-25T09:00:00Z'
  },
  {
    id: '2',
    foundation_id: '1',
    name: 'Educational Scholarship Program',
    description: 'Providing scholarships for underprivileged students',
    status: 'planning',
    start_date: '2024-06-01',
    budget: 200000.00,
    progress_percentage: 10,
    created_at: '2024-03-10T11:00:00Z'
  }
];

export const mockGrants: Grant[] = [
  {
    id: '1',
    project_id: '1',
    grant_name: 'EU Green Energy Grant',
    grantor_name: 'European Union',
    amount: 300000.00,
    currency: 'EUR',
    status: 'awarded',
    application_date: '2024-01-10',
    award_date: '2024-02-15',
    created_at: '2024-01-10T14:00:00Z'
  },
  {
    id: '2',
    project_id: '2',
    grant_name: 'Education Excellence Grant',
    grantor_name: 'Swedish Education Ministry',
    amount: 150000.00,
    currency: 'SEK',
    status: 'under_review',
    application_date: '2024-03-01',
    created_at: '2024-03-01T16:30:00Z'
  }
];

export const mockRecentActivities = [
  {
    id: '1',
    type: 'document_approved',
    description: 'Articles of Association approved for Green Future Foundation',
    timestamp: '2024-01-17T11:30:00Z',
    foundation_name: 'Green Future Foundation'
  },
  {
    id: '2',
    type: 'meeting_scheduled',
    description: 'Board Meeting scheduled for April 15th',
    timestamp: '2024-03-20T10:00:00Z',
    foundation_name: 'Green Future Foundation'
  },
  {
    id: '3',
    type: 'expense_submitted',
    description: 'Travel expense submitted for approval',
    timestamp: '2024-03-21T14:15:00Z',
    foundation_name: 'Green Future Foundation'
  }
]