export declare class FileService {
    static uploadFile(bucket: string, filePath: string, fileBuffer: Buffer, contentType: string, upsert?: boolean): Promise<string>;
    static deleteFile(bucket: string, filePath: string): Promise<void>;
    static getSignedUrl(bucket: string, filePath: string, expiresIn?: number): Promise<string>;
    static getPublicUrl(bucket: string, filePath: string): Promise<string>;
    static moveFile(bucket: string, fromPath: string, toPath: string): Promise<void>;
    static copyFile(bucket: string, fromPath: string, toPath: string): Promise<void>;
    static validateFileType(mimetype: string, allowedTypes: string[]): boolean;
    static validateFileSize(size: number, maxSize: number): boolean;
    static generateUniqueFileName(originalName: string, prefix?: string): string;
}
//# sourceMappingURL=FileService.d.ts.map