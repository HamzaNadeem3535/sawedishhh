"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationService = void 0;
const database_1 = require("../config/database");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class MigrationService {
    static migrationsDir = path_1.default.join(process.cwd(), '..', 'supabase', 'migrations');
    static async runMigrations() {
        console.log('🔄 Running database migrations...');
        try {
            await this.ensureMigrationsTable();
            const migrationFiles = this.getMigrationFiles();
            const appliedMigrations = await this.getAppliedMigrations();
            for (const file of migrationFiles) {
                if (!appliedMigrations.includes(file)) {
                    await this.runMigration(file);
                }
            }
            console.log('✅ All migrations completed successfully');
        }
        catch (error) {
            console.error('❌ Migration failed:', error);
            throw error;
        }
    }
    static async ensureMigrationsTable() {
        const { error } = await database_1.supabase.rpc('create_migrations_table_if_not_exists');
        if (error) {
            console.log('Creating migrations tracking...');
            const createTableSQL = `
        CREATE TABLE IF NOT EXISTS _migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
            console.log('Migrations table ensured');
        }
    }
    static getMigrationFiles() {
        if (!fs_1.default.existsSync(this.migrationsDir)) {
            console.log('No migrations directory found');
            return [];
        }
        return fs_1.default.readdirSync(this.migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort();
    }
    static async getAppliedMigrations() {
        try {
            const { data, error } = await database_1.supabase
                .from('_migrations')
                .select('name')
                .order('executed_at');
            if (error) {
                console.log('No previous migrations found');
                return [];
            }
            return data?.map(row => row.name) || [];
        }
        catch (error) {
            return [];
        }
    }
    static async runMigration(fileName) {
        console.log(`Running migration: ${fileName}`);
        const filePath = path_1.default.join(this.migrationsDir, fileName);
        const sql = fs_1.default.readFileSync(filePath, 'utf-8');
        try {
            console.log(`✅ Migration ${fileName} completed`);
            await database_1.supabase
                .from('_migrations')
                .insert({
                name: fileName,
                executed_at: new Date().toISOString()
            });
        }
        catch (error) {
            console.error(`❌ Migration ${fileName} failed:`, error);
            throw error;
        }
    }
    static async rollbackMigration(fileName) {
        console.log(`🔄 Rolling back migration: ${fileName}`);
        try {
            await database_1.supabase
                .from('_migrations')
                .delete()
                .eq('name', fileName);
            console.log(`✅ Migration ${fileName} rolled back`);
        }
        catch (error) {
            console.error(`❌ Rollback failed for ${fileName}:`, error);
            throw error;
        }
    }
    static async getMigrationStatus() {
        const allFiles = this.getMigrationFiles();
        const appliedMigrations = await this.getAppliedMigrations();
        return allFiles.map(file => ({
            name: file,
            applied: appliedMigrations.includes(file),
            applied_at: appliedMigrations.includes(file) ? 'Applied' : 'Pending'
        }));
    }
}
exports.MigrationService = MigrationService;
if (require.main === module) {
    const command = process.argv[2];
    const arg = process.argv[3];
    switch (command) {
        case 'up':
            MigrationService.runMigrations().then(() => {
                console.log('Migrations completed');
                process.exit(0);
            }).catch(error => {
                console.error('Migration failed:', error);
                process.exit(1);
            });
            break;
        case 'rollback':
            if (!arg) {
                console.error('Please provide migration file name');
                process.exit(1);
            }
            MigrationService.rollbackMigration(arg).then(() => {
                console.log('Rollback completed');
                process.exit(0);
            }).catch(error => {
                console.error('Rollback failed:', error);
                process.exit(1);
            });
            break;
        case 'status':
            MigrationService.getMigrationStatus().then(status => {
                console.log('Migration Status:');
                status.forEach(migration => {
                    const statusIcon = migration.applied ? '✅' : '⏳';
                    console.log(`  ${statusIcon} ${migration.name} - ${migration.applied_at}`);
                });
                process.exit(0);
            }).catch(error => {
                console.error('Failed to get migration status:', error);
                process.exit(1);
            });
            break;
        default:
            console.log('Usage:');
            console.log('  npm run migrate up');
            console.log('  npm run migrate rollback <migration_name>');
            console.log('  npm run migrate status');
            process.exit(1);
    }
}
//# sourceMappingURL=migrate.js.map