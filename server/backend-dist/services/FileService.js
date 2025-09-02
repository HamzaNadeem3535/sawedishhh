"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const database_1 = require("../config/database");
class FileService {
    static async uploadFile(bucket, filePath, fileBuffer, contentType, upsert = false) {
        const { error } = await database_1.supabase.storage
            .from(bucket)
            .upload(filePath, fileBuffer, {
            contentType,
            upsert
        });
        if (error) {
            throw new Error(`File upload failed: ${error.message}`);
        }
        return filePath;
    }
    static async deleteFile(bucket, filePath) {
        const { error } = await database_1.supabase.storage
            .from(bucket)
            .remove([filePath]);
        if (error) {
            throw new Error(`File deletion failed: ${error.message}`);
        }
    }
    static async getSignedUrl(bucket, filePath, expiresIn = 3600) {
        const { data, error } = await database_1.supabase.storage
            .from(bucket)
            .createSignedUrl(filePath, expiresIn);
        if (error) {
            throw new Error(`Failed to generate signed URL: ${error.message}`);
        }
        return data.signedUrl;
    }
    static async getPublicUrl(bucket, filePath) {
        const { data } = database_1.supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);
        return data.publicUrl;
    }
    static async moveFile(bucket, fromPath, toPath) {
        const { error } = await database_1.supabase.storage
            .from(bucket)
            .move(fromPath, toPath);
        if (error) {
            throw new Error(`File move failed: ${error.message}`);
        }
    }
    static async copyFile(bucket, fromPath, toPath) {
        const { error } = await database_1.supabase.storage
            .from(bucket)
            .copy(fromPath, toPath);
        if (error) {
            throw new Error(`File copy failed: ${error.message}`);
        }
    }
    static validateFileType(mimetype, allowedTypes) {
        return allowedTypes.includes(mimetype);
    }
    static validateFileSize(size, maxSize) {
        return size <= maxSize;
    }
    static generateUniqueFileName(originalName, prefix) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const extension = originalName.split('.').pop();
        const baseName = originalName.split('.').slice(0, -1).join('.');
        return prefix
            ? `${prefix}-${timestamp}-${random}-${baseName}.${extension}`
            : `${timestamp}-${random}-${baseName}.${extension}`;
    }
}
exports.FileService = FileService;
//# sourceMappingURL=FileService.js.map