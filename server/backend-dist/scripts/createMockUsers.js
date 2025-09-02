"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUserService = void 0;
const database_1 = require("../config/database");
const AuditService_1 = require("../services/AuditService");
const mockUsers = [
    {
        email: 'admin@example.com',
        password: 'AdminPass123',
        full_name: 'System Administrator',
        role: 'admin'
    },
    {
        email: 'manager@example.com',
        password: 'ManagerPass123',
        full_name: 'Foundation Manager',
        role: 'foundation_owner'
    },
    {
        email: 'developer@example.com',
        password: 'DevPass123',
        full_name: 'Developer User',
        role: 'member'
    }
];
class MockUserService {
    static async createMockUsers() {
        console.log('🔧 Creating mock users for testing...');
        try {
            for (const mockUser of mockUsers) {
                await this.createUser(mockUser);
            }
            console.log('✅ Mock users created successfully');
            console.log('\n📧 Test Credentials:');
            mockUsers.forEach(user => {
                console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
            });
        }
        catch (error) {
            console.error('❌ Failed to create mock users:', error);
            throw error;
        }
    }
    static async createUser(userData) {
        console.log(`Creating ${userData.role} user: ${userData.email}`);
        const { data: existingUser } = await database_1.supabase
            .from('profiles')
            .select('id')
            .eq('email', userData.email)
            .single();
        if (existingUser) {
            console.log(`User ${userData.email} already exists, skipping...`);
            return;
        }
        const { data: authData, error: authError } = await database_1.supabase.auth.admin.createUser({
            email: userData.email,
            password: userData.password,
            email_confirm: true,
            user_metadata: {
                full_name: userData.full_name,
                role: userData.role
            }
        });
        if (authError) {
            console.error(`Failed to create auth user for ${userData.email}:`, authError);
            throw authError;
        }
        if (!authData.user) {
            throw new Error(`Failed to create user ${userData.email}`);
        }
        const { error: profileError } = await database_1.supabase
            .from('profiles')
            .upsert({
            id: authData.user.id,
            full_name: userData.full_name,
            email: userData.email,
            role: userData.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        });
        if (profileError) {
            console.error(`Failed to create profile for ${userData.email}:`, profileError);
            await database_1.supabase.auth.admin.deleteUser(authData.user.id);
            throw profileError;
        }
        const { data: roleData, error: roleError } = await database_1.supabase
            .from('roles')
            .select('id')
            .eq('name', userData.role)
            .single();
        if (roleError || !roleData) {
            console.error(`Role ${userData.role} not found`);
            return;
        }
        const { error: roleAssignError } = await database_1.supabase
            .from('user_roles')
            .insert({
            user_id: authData.user.id,
            role_id: roleData.id,
            assigned_by: authData.user.id,
            assigned_at: new Date().toISOString()
        });
        if (roleAssignError) {
            console.error(`Failed to assign role to ${userData.email}:`, roleAssignError);
        }
        if (userData.role === 'foundation_owner') {
            await this.createMockFoundation(authData.user.id, userData.full_name);
        }
        console.log(`✅ Created ${userData.role} user: ${userData.email}`);
    }
    static async createMockFoundation(ownerId, ownerName) {
        const { data: foundation, error } = await database_1.supabase
            .from('foundations')
            .insert({
            name: 'Test Foundation',
            registration_number: 'TEST-2024-001',
            status: 'active',
            owner_user_id: ownerId,
            description: 'Test foundation for demonstration purposes',
            address: 'Stockholm, Sweden',
            phone: '+46 8 123 456 78',
            website: 'https://testfoundation.se',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .select()
            .single();
        if (error) {
            console.error('Failed to create mock foundation:', error);
            return;
        }
        console.log(`✅ Created test foundation for ${ownerName}`);
        await AuditService_1.AuditService.log({
            user_id: ownerId,
            foundation_id: foundation.id,
            action: 'foundation_created',
            target_table: 'foundations',
            target_id: foundation.id,
            details: {
                name: foundation.name,
                created_for_testing: true
            }
        });
    }
    static async cleanupMockUsers() {
        console.log('🧹 Cleaning up mock users...');
        try {
            for (const mockUser of mockUsers) {
                const { data: profile } = await database_1.supabase
                    .from('profiles')
                    .select('id')
                    .eq('email', mockUser.email)
                    .single();
                if (profile) {
                    await database_1.supabase.auth.admin.deleteUser(profile.id);
                    console.log(`🗑️ Deleted user: ${mockUser.email}`);
                }
            }
            console.log('✅ Mock users cleanup completed');
        }
        catch (error) {
            console.error('❌ Failed to cleanup mock users:', error);
        }
    }
    static async listMockUsers() {
        console.log('📋 Mock Users List:');
        console.log('==================');
        for (const user of mockUsers) {
            const { data: profile } = await database_1.supabase
                .from('profiles')
                .select('id, full_name, role, created_at')
                .eq('email', user.email)
                .single();
            if (profile) {
                console.log(`✅ ${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
                console.log(`   Name: ${profile.full_name}`);
                console.log(`   ID: ${profile.id}`);
                console.log(`   Created: ${new Date(profile.created_at).toLocaleString()}`);
            }
            else {
                console.log(`❌ ${user.role.toUpperCase()}: ${user.email} (NOT FOUND)`);
            }
            console.log('');
        }
    }
}
exports.MockUserService = MockUserService;
if (require.main === module) {
    const command = process.argv[2];
    switch (command) {
        case 'create':
            MockUserService.createMockUsers().then(() => {
                console.log('\n🎉 Mock users setup completed!');
                console.log('You can now test role-based access with these credentials.');
                process.exit(0);
            }).catch(error => {
                console.error('Mock user creation failed:', error);
                process.exit(1);
            });
            break;
        case 'cleanup':
            MockUserService.cleanupMockUsers().then(() => {
                console.log('Cleanup completed');
                process.exit(0);
            }).catch(error => {
                console.error('Cleanup failed:', error);
                process.exit(1);
            });
            break;
        case 'list':
            MockUserService.listMockUsers().then(() => {
                process.exit(0);
            }).catch(error => {
                console.error('Failed to list users:', error);
                process.exit(1);
            });
            break;
        default:
            console.log('Usage:');
            console.log('  npm run create-mock-users create');
            console.log('  npm run create-mock-users cleanup');
            console.log('  npm run create-mock-users list');
            process.exit(1);
    }
}
//# sourceMappingURL=createMockUsers.js.map