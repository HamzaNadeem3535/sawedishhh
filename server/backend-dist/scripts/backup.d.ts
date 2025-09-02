export declare class BackupService {
    private static backupDir;
    static createBackup(foundationId?: string): Promise<string>;
    static restoreBackup(backupPath: string): Promise<void>;
    static listBackups(): Promise<string[]>;
    static deleteBackup(fileName: string): Promise<void>;
    static scheduleBackup(foundationId?: string): Promise<void>;
}
//# sourceMappingURL=backup.d.ts.map