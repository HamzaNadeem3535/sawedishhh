"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeeder = void 0;
const database_1 = require("../config/database");
class DatabaseSeeder {
    static async seedDatabase() {
        console.log('🌱 Starting database seeding...');
        try {
            if (process.env.NODE_ENV === 'development') {
                await this.clearExistingData();
            }
            await this.seedRoles();
            await this.seedFoundations();
            await this.seedDocuments();
            await this.seedMeetings();
            await this.seedExpenses();
            await this.seedInvestments();
            await this.seedProjects();
            await this.seedGrants();
            console.log('✅ Database seeding completed successfully');
        }
        catch (error) {
            console.error('❌ Database seeding failed:', error);
            throw error;
        }
    }
    static async clearExistingData() {
        console.log('🧹 Clearing existing data...');
        await database_1.supabase.from('grants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await database_1.supabase.from('document_versions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await database_1.supabase.from('meeting_minutes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await database_1.supabase.from('expenses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await database_1.supabase.from('investments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await database_1.supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await database_1.supabase.from('meetings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await database_1.supabase.from('documents').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await database_1.supabase.from('foundation_members').delete().neq('foundation_id', '00000000-0000-0000-0000-000000000000');
        await database_1.supabase.from('foundations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }
    static async seedRoles() {
        console.log('👥 Seeding roles...');
        const roles = [
            {
                name: 'admin',
                description: 'System administrator with full access'
            },
            {
                name: 'foundation_owner',
                description: 'Foundation owner with management rights'
            },
            {
                name: 'board_member',
                description: 'Board member with governance rights'
            },
            {
                name: 'member',
                description: 'Regular foundation member'
            },
            {
                name: 'viewer',
                description: 'Read-only access to foundation data'
            }
        ];
        const { error } = await database_1.supabase.from('roles').insert(roles);
        if (error) {
            console.error('Failed to seed roles:', error);
        }
    }
    static async seedFoundations() {
        console.log('🏢 Seeding foundations...');
        const { data: users } = await database_1.supabase
            .from('profiles')
            .select('id')
            .limit(1);
        if (!users || users.length === 0 || !users[0]) {
            console.log('No users found, skipping foundation seeding');
            return;
        }
        const ownerId = users[0].id;
        const foundations = [
            {
                name: 'Green Future Foundation',
                registration_number: 'GFF-2024-001',
                status: 'active',
                owner_user_id: ownerId,
                description: 'Dedicated to environmental sustainability and green technology initiatives.',
                address: 'Kungsgatan 12, 111 43 Stockholm, Sweden',
                phone: '+46 8 123 456 78',
                website: 'https://greenfuture.se',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                name: 'Education for All Foundation',
                registration_number: 'EFA-2024-002',
                status: 'pending_verification',
                owner_user_id: ownerId,
                description: 'Promoting equal access to quality education worldwide.',
                address: 'Avenyn 15, 411 36 Göteborg, Sweden',
                phone: '+46 31 987 654 32',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ];
        const { error } = await database_1.supabase.from('foundations').insert(foundations);
        if (error) {
            console.error('Failed to seed foundations:', error);
        }
    }
    static async seedDocuments() {
        console.log('📄 Seeding documents...');
        const { data: foundations } = await database_1.supabase
            .from('foundations')
            .select('id, owner_user_id')
            .limit(2);
        if (!foundations || foundations.length === 0)
            return;
        const documents = foundations.flatMap(foundation => [
            {
                foundation_id: foundation.id,
                uploaded_by: foundation.owner_user_id,
                document_type: 'articles_of_association',
                file_name: 'Articles_of_Association.pdf',
                file_path: `/documents/${foundation.id}/articles.pdf`,
                file_size: 1024000,
                mime_type: 'application/pdf',
                status: 'approved',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                foundation_id: foundation.id,
                uploaded_by: foundation.owner_user_id,
                document_type: 'financial_statement',
                file_name: 'Financial_Statement_Q1_2024.pdf',
                file_path: `/documents/${foundation.id}/financial_q1.pdf`,
                file_size: 2048000,
                mime_type: 'application/pdf',
                status: 'pending_approval',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]);
        const { error } = await database_1.supabase.from('documents').insert(documents);
        if (error) {
            console.error('Failed to seed documents:', error);
        }
    }
    static async seedMeetings() {
        console.log('📅 Seeding meetings...');
        const { data: foundations } = await database_1.supabase
            .from('foundations')
            .select('id, owner_user_id')
            .limit(2);
        if (!foundations || foundations.length === 0)
            return;
        const meetings = foundations.flatMap(foundation => [
            {
                foundation_id: foundation.id,
                organizer_id: foundation.owner_user_id,
                title: 'Board Meeting - Q1 Review',
                description: 'Quarterly review of foundation activities and financial status.',
                start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
                location: 'Stockholm Office',
                meeting_type: 'board_meeting',
                status: 'scheduled',
                attendees: [foundation.owner_user_id],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]);
        const { error } = await database_1.supabase.from('meetings').insert(meetings);
        if (error) {
            console.error('Failed to seed meetings:', error);
        }
    }
    static async seedExpenses() {
        console.log('💰 Seeding expenses...');
        const { data: foundations } = await database_1.supabase
            .from('foundations')
            .select('id, owner_user_id')
            .limit(2);
        if (!foundations || foundations.length === 0)
            return;
        const expenses = foundations.flatMap(foundation => [
            {
                foundation_id: foundation.id,
                user_id: foundation.owner_user_id,
                amount: 2500.00,
                currency: 'SEK',
                category: 'office_supplies',
                description: 'Office furniture and equipment',
                expense_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'approved',
                approved_by: foundation.owner_user_id,
                approved_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                foundation_id: foundation.id,
                user_id: foundation.owner_user_id,
                amount: 1200.00,
                currency: 'SEK',
                category: 'travel',
                description: 'Business trip to Gothenburg',
                expense_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]);
        const { error } = await database_1.supabase.from('expenses').insert(expenses);
        if (error) {
            console.error('Failed to seed expenses:', error);
        }
    }
    static async seedInvestments() {
        console.log('📈 Seeding investments...');
        const { data: foundations } = await database_1.supabase
            .from('foundations')
            .select('id, owner_user_id')
            .limit(2);
        if (!foundations || foundations.length === 0)
            return;
        const investments = foundations.flatMap(foundation => [
            {
                foundation_id: foundation.id,
                type: 'stock',
                name: 'Green Energy Corp',
                amount: 50000.00,
                currency: 'SEK',
                acquisition_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                current_value: 52500.00,
                performance: 5.0,
                notes: 'Sustainable energy company with strong growth potential',
                managed_by: foundation.owner_user_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            },
            {
                foundation_id: foundation.id,
                type: 'bond',
                name: 'Swedish Government Bond',
                amount: 100000.00,
                currency: 'SEK',
                acquisition_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                current_value: 101200.00,
                performance: 1.2,
                notes: 'Low-risk government bond',
                managed_by: foundation.owner_user_id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]);
        const { error } = await database_1.supabase.from('investments').insert(investments);
        if (error) {
            console.error('Failed to seed investments:', error);
        }
    }
    static async seedProjects() {
        console.log('🚀 Seeding projects...');
        const { data: foundations } = await database_1.supabase
            .from('foundations')
            .select('id, owner_user_id')
            .limit(2);
        if (!foundations || foundations.length === 0)
            return;
        const projects = foundations.flatMap(foundation => [
            {
                foundation_id: foundation.id,
                name: 'Solar Panel Initiative',
                description: 'Installing solar panels in rural communities',
                status: 'in_progress',
                start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                end_date: new Date(Date.now() + 300 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                budget: 500000.00,
                currency: 'SEK',
                project_manager_id: foundation.owner_user_id,
                progress_percentage: 35,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        ]);
        const { error } = await database_1.supabase.from('projects').insert(projects);
        if (error) {
            console.error('Failed to seed projects:', error);
        }
    }
    static async seedGrants() {
        console.log('🎁 Seeding grants...');
        const { data: projects } = await database_1.supabase
            .from('projects')
            .select('id')
            .limit(2);
        if (!projects || projects.length === 0)
            return;
        const grants = projects.map(project => ({
            project_id: project.id,
            grant_name: 'EU Green Energy Grant',
            grantor_name: 'European Union',
            amount: 300000.00,
            currency: 'EUR',
            status: 'awarded',
            application_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            award_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            requirements: ['Environmental impact assessment', 'Progress reports'],
            reporting_schedule: ['Monthly progress reports', 'Final completion report'],
            notes: 'Grant for renewable energy projects in rural areas',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));
        const { error } = await database_1.supabase.from('grants').insert(grants);
        if (error) {
            console.error('Failed to seed grants:', error);
        }
    }
    static async createTestUser() {
        const testEmail = 'test@foundation.se';
        const testPassword = 'password123';
        const { data: authData, error: authError } = await database_1.supabase.auth.admin.createUser({
            email: testEmail,
            password: testPassword,
            email_confirm: true,
            user_metadata: {
                full_name: 'Test User'
            }
        });
        if (authError) {
            console.error('Failed to create test user:', authError);
            throw authError;
        }
        const { error: profileError } = await database_1.supabase
            .from('profiles')
            .insert({
            id: authData.user.id,
            full_name: 'Test User',
            email: testEmail,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        if (profileError) {
            console.error('Failed to create test user profile:', profileError);
            throw profileError;
        }
        console.log(`✅ Test user created: ${testEmail} / ${testPassword}`);
        return authData.user.id;
    }
    static async runSeeder() {
        try {
            console.log('🚀 Starting database seeding process...');
            await this.createTestUser();
            await this.seedDatabase();
            console.log('🎉 Database seeding completed successfully!');
            console.log('📧 Test user: test@foundation.se / password123');
        }
        catch (error) {
            console.error('💥 Seeding failed:', error);
            process.exit(1);
        }
    }
}
exports.DatabaseSeeder = DatabaseSeeder;
if (require.main === module) {
    DatabaseSeeder.runSeeder();
}
//# sourceMappingURL=seedDatabase.js.map