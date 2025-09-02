import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface User {
            id?: string | number;
            [key: string]: any;
        }
        interface Request {
            user?: User;
        }
    }
}
interface CacheOptions {
    ttl: number;
    key?: (req: Request) => string;
    condition?: (req: Request) => boolean;
}
declare class MemoryCache {
    private cache;
    set(key: string, data: any, ttl: number): void;
    get(key: string): any | null;
    delete(key: string): void;
    clear(): void;
    size(): number;
    cleanup(): void;
}
declare const cache: MemoryCache;
export declare const cacheMiddleware: (options: CacheOptions) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const shortCache: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const mediumCache: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const longCache: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const staticDataCache: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const userDataCache: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const foundationDataCache: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const invalidateCache: {
    user: (userId: string) => void;
    foundation: (foundationId: string) => void;
    all: () => void;
};
export { cache };
//# sourceMappingURL=cache.d.ts.map