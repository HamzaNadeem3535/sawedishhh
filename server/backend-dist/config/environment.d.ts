export interface EnvironmentConfig {
    port: number;
    nodeEnv: string;
    frontendUrl: string;
    supabaseUrl: string;
    supabaseAnonKey: string;
    supabaseServiceKey: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    maxFileSize: number;
    allowedFileTypes: string[];
    smtpHost?: string | undefined;
    smtpPort?: number | undefined;
    smtpUser?: string | undefined;
    smtpPass?: string | undefined;
    bankidEndpoint?: string | undefined;
    bankidCertPath?: string | undefined;
    bankidCertPassword?: string | undefined;
    bankApiEndpoint?: string | undefined;
    bankApiKey?: string | undefined;
    logLevel: string;
    logFile?: string | undefined;
    rateLimitWindow: number;
    rateLimitMax: number;
}
declare class Environment {
    private static config;
    static load(): EnvironmentConfig;
    private static validateConfig;
    static get(): EnvironmentConfig;
    static isDevelopment(): boolean;
    static isProduction(): boolean;
    static isTest(): boolean;
}
export default Environment;
//# sourceMappingURL=environment.d.ts.map