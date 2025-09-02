import { Request, Response, NextFunction } from 'express';
export interface LogEntry {
    timestamp: string;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    meta?: Record<string, unknown> | undefined;
}
export declare class Logger {
    private static logDir;
    private static logFile;
    static init(): void;
    static log(level: LogEntry['level'], message: string, meta?: Record<string, unknown>): void;
    static info(message: string, meta?: Record<string, unknown>): void;
    static warn(message: string, meta?: Record<string, unknown>): void;
    static error(message: string, meta?: Record<string, unknown>): void;
    static debug(message: string, meta?: Record<string, unknown>): void;
}
export declare const requestLogging: (req: Request, res: Response, next: NextFunction) => void;
export declare const errorLogging: (error: unknown, req: Request, res: Response, next: NextFunction) => void;
export declare const performanceMonitoring: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=logging.d.ts.map