"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackupService = void 0;
const database_1 = require("../config/database");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class BackupService {
    static backupDir = path_1.default.join(process.cwd(), 'backups');
    static async createBackup(foundationId) {
        console.log('📦 Creating database backup...');
        if (!fs_1.default.existsSync(this.backupDir)) {
            fs_1.default.mkdirSync(this.backupDir, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = foundationId
            ? `foundation-${foundationId}-backup-${timestamp}.json`
            : `full-backup-${timestamp}.json`;
        const backupPath = path_1.default.join(this.backupDir, backupFileName);
        try {
            const backupData = {};
            const tables = [
                'profiles',
                'foundations',
                'foundation_members',
                'documents',
                'document_versions',
                'meetings',
                'meeting_minutes',
                'expenses',
                'investments',
                'projects',
                'grants',
                'audit_logs'
            ];
            for (const table of tables) {
                console.log(`Backing up table: ${table}`);
                let query = database_1.supabase.from(table).select('*');
                if (foundationId && ['documents', 'meetings', 'expenses', 'investments', 'projects'].includes(table)) {
                    query = query.eq('foundation_id', foundationId);
                }
                else if (foundationId && table === 'foundation_members') {
                    query = query.eq('foundation_id', foundationId);
                }
                else if (foundationId && table === 'foundations') {
                    query = query.eq('id', foundationId);
                }
                else if (foundationId && table === 'grants') {
                    const { data: projects } = await database_1.supabase
                        .from('projects')
                        .select('id')
                        .eq('foundation_id', foundationId);
                    if (projects && projects.length > 0) {
                        const projectIds = projects.map(p => p.id);
                        query = query.in('project_id', projectIds);
                    }
                    else {
                        backupData[table] = [];
                        continue;
                    }
                }
                const { data, error } = await query;
                if (error) {
                    console.error(`Failed to backup table ${table}:`, error);
                    throw error;
                }
                backupData[table] = data || [];
            }
            backupData._metadata = {
                created_at: new Date().toISOString(),
                foundation_id: foundationId || null,
                version: '1.0.0',
                total_records: Object.values(backupData).reduce((sum, records) => sum + (Array.isArray(records) ? records.length : 0), 0)
            };
            fs_1.default.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
            console.log(`✅ Backup created successfully: ${backupFileName}`);
            console.log(`📊 Total records backed up: ${backupData._metadata.total_records}`);
            return backupPath;
        }
        catch (error) {
            console.error('❌ Backup failed:', error);
            throw error;
        }
    }
    static async restoreBackup(backupPath) {
        console.log('📥 Restoring database backup...');
        if (!fs_1.default.existsSync(backupPath)) {
            throw new Error('Backup file not found');
        }
        try {
            const backupData = JSON.parse(fs_1.default.readFileSync(backupPath, 'utf-8'));
            if (!backupData._metadata) {
                throw new Error('Invalid backup file format');
            }
            console.log(`Restoring backup from: ${backupData._metadata.created_at}`);
            console.log(`Total records to restore: ${backupData._metadata.total_records}`);
            const restoreOrder = [
                'profiles',
                'foundations',
                'foundation_members',
                'documents',
                'document_versions',
                'meetings',
                'meeting_minutes',
                'projects',
                'grants',
                'expenses',
                'investments',
                'audit_logs'
            ];
            for (const table of restoreOrder) {
                if (backupData[table] && backupData[table].length > 0) {
                    console.log(`Restoring table: ${table} (${backupData[table].length} records)`);
                    const { error } = await database_1.supabase
                        .from(table)
                        .insert(backupData[table]);
                    if (error) {
                        console.error(`Failed to restore table ${table}:`, error);
                        throw error;
                    }
                }
            }
            console.log('✅ Backup restored successfully');
        }
        catch (error) {
            console.error('❌ Restore failed:', error);
            throw error;
        }
    }
    static async listBackups() {
        if (!fs_1.default.existsSync(this.backupDir)) {
            return [];
        }
        const files = fs_1.default.readdirSync(this.backupDir);
        return files.filter(file => file.endsWith('.json'));
    }
    static async deleteBackup(fileName) {
        const backupPath = path_1.default.join(this.backupDir, fileName);
        if (fs_1.default.existsSync(backupPath)) {
            fs_1.default.unlinkSync(backupPath);
            console.log(`🗑️ Backup deleted: ${fileName}`);
        }
        else {
            throw new Error('Backup file not found');
        }
    }
    static async scheduleBackup(foundationId) {
        try {
            const backupPath = await this.createBackup(foundationId);
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            const backups = await this.listBackups();
            for (const backup of backups) {
                const backupPath = path_1.default.join(this.backupDir, backup);
                const stats = fs_1.default.statSync(backupPath);
                if (stats.mtime.getTime() < thirtyDaysAgo) {
                    await this.deleteBackup(backup);
                }
            }
            console.log('📅 Scheduled backup completed');
        }
        catch (error) {
            console.error('❌ Scheduled backup failed:', error);
        }
    }
}
exports.BackupService = BackupService;
if (require.main === module) {
    const command = process.argv[2];
    const arg = process.argv[3];
    switch (command) {
        case 'create':
            BackupService.createBackup(arg).then(path => {
                console.log(`Backup created: ${path}`);
                process.exit(0);
            }).catch(error => {
                console.error('Backup failed:', error);
                process.exit(1);
            });
            break;
        case 'restore':
            if (!arg) {
                console.error('Please provide backup file path');
                process.exit(1);
            }
            BackupService.restoreBackup(arg).then(() => {
                console.log('Backup restored successfully');
                process.exit(0);
            }).catch(error => {
                console.error('Restore failed:', error);
                process.exit(1);
            });
            break;
        case 'list':
            BackupService.listBackups().then(backups => {
                console.log('Available backups:');
                backups.forEach(backup => console.log(`  ${backup}`));
                process.exit(0);
            }).catch(error => {
                console.error('Failed to list backups:', error);
                process.exit(1);
            });
            break;
        default:
            console.log('Usage:');
            console.log('  npm run backup create [foundation_id]');
            console.log('  npm run backup restore <backup_file>');
            console.log('  npm run backup list');
            process.exit(1);
    }
}
//# sourceMappingURL=backup.js.map