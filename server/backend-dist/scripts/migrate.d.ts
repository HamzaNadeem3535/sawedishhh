export declare class MigrationService {
    private static migrationsDir;
    static runMigrations(): Promise<void>;
    private static ensureMigrationsTable;
    private static getMigrationFiles;
    private static getAppliedMigrations;
    private static runMigration;
    static rollbackMigration(fileName: string): Promise<void>;
    static getMigrationStatus(): Promise<any[]>;
}
//# sourceMappingURL=migrate.d.ts.map