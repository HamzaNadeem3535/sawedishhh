"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const database_1 = require("../config/database");
const errorHandler_1 = require("../middleware/errorHandler");
class DocumentController {
    static getDocuments = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id, document_type, status } = req.query;
        let query = database_1.supabase
            .from('documents')
            .select(`
        *,
        foundations(name),
        profiles!documents_uploaded_by_fkey(full_name, email)
      `)
            .order('created_at', { ascending: false });
        if (foundation_id) {
            query = query.eq('foundation_id', foundation_id);
        }
        if (document_type) {
            query = query.eq('document_type', document_type);
        }
        if (status) {
            query = query.eq('status', status);
        }
        const { data: documents, error } = await query;
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 500);
        }
        res.json({
            documents: documents || [],
            total: documents?.length || 0
        });
    });
    static getDocumentById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { data: document, error } = await database_1.supabase
            .from('documents')
            .select(`
        *,
        foundations(name),
        profiles!documents_uploaded_by_fkey(full_name, email),
        document_versions(*)
      `)
            .eq('id', id)
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)('Document not found', 404);
        }
        res.json({ document });
    });
    static uploadDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { foundation_id, document_type, notes } = req.body;
        const file = req.file;
        if (!file) {
            throw (0, errorHandler_1.createError)('No file uploaded', 400);
        }
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = `documents/${foundation_id}/${fileName}`;
        const { error: uploadError } = await database_1.supabase.storage
            .from('documents')
            .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });
        if (uploadError) {
            throw (0, errorHandler_1.createError)('File upload failed', 500);
        }
        const { data: document, error: documentError } = await database_1.supabase
            .from('documents')
            .insert({
            foundation_id,
            uploaded_by: req.user?.id,
            document_type,
            file_name: file.originalname,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.mimetype,
            status: 'uploaded',
            approval_notes: notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        })
            .select()
            .single();
        if (documentError) {
            await database_1.supabase.storage.from('documents').remove([filePath]);
            throw (0, errorHandler_1.createError)(documentError.message, 400);
        }
        res.status(201).json({
            message: 'Document uploaded successfully',
            document
        });
    });
    static updateDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { status, approval_notes } = req.body;
        const { data: document, error } = await database_1.supabase
            .from('documents')
            .update({
            status,
            approval_notes,
            approved_by: status === 'approved' ? req.user?.id : null,
            approved_at: status === 'approved' ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({
            message: 'Document updated successfully',
            document
        });
    });
    static deleteDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { data: document, error: fetchError } = await database_1.supabase
            .from('documents')
            .select('file_path')
            .eq('id', id)
            .single();
        if (fetchError) {
            throw (0, errorHandler_1.createError)('Document not found', 404);
        }
        if (document.file_path) {
            await database_1.supabase.storage
                .from('documents')
                .remove([document.file_path]);
        }
        const { error } = await database_1.supabase
            .from('documents')
            .delete()
            .eq('id', id);
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 400);
        }
        res.json({ message: 'Document deleted successfully' });
    });
    static downloadDocument = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { data: document, error: documentError } = await database_1.supabase
            .from('documents')
            .select('file_path, file_name, mime_type')
            .eq('id', id)
            .single();
        if (documentError) {
            throw (0, errorHandler_1.createError)('Document not found', 404);
        }
        const { data: signedUrl, error: urlError } = await database_1.supabase.storage
            .from('documents')
            .createSignedUrl(document.file_path, 3600);
        if (urlError) {
            throw (0, errorHandler_1.createError)('Failed to generate download URL', 500);
        }
        res.json({
            download_url: signedUrl.signedUrl,
            file_name: document.file_name,
            mime_type: document.mime_type
        });
    });
    static getDocumentVersions = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { data: versions, error } = await database_1.supabase
            .from('document_versions')
            .select(`
        *,
        profiles!document_versions_uploaded_by_fkey(full_name, email)
      `)
            .eq('document_id', id)
            .order('version_number', { ascending: false });
        if (error) {
            throw (0, errorHandler_1.createError)(error.message, 500);
        }
        res.json({
            versions: versions || [],
            total: versions?.length || 0
        });
    });
    static uploadDocumentVersion = (0, errorHandler_1.asyncHandler)(async (req, res) => {
        const { id } = req.params;
        const { change_notes } = req.body;
        const file = req.file;
        if (!file) {
            throw (0, errorHandler_1.createError)('No file uploaded', 400);
        }
        const { data: document, error: documentError } = await database_1.supabase
            .from('documents')
            .select('foundation_id')
            .eq('id', id)
            .single();
        if (documentError) {
            throw (0, errorHandler_1.createError)('Document not found', 404);
        }
        const { data: lastVersion, error: versionError } = await database_1.supabase
            .from('document_versions')
            .select('version_number')
            .eq('document_id', id)
            .order('version_number', { ascending: false })
            .limit(1)
            .single();
        const nextVersionNumber = (lastVersion?.version_number || 0) + 1;
        const fileName = `${Date.now()}-v${nextVersionNumber}-${file.originalname}`;
        const filePath = `documents/${document.foundation_id}/versions/${fileName}`;
        const { error: uploadError } = await database_1.supabase.storage
            .from('documents')
            .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false
        });
        if (uploadError) {
            throw (0, errorHandler_1.createError)('File upload failed', 500);
        }
        const { data: version, error: versionInsertError } = await database_1.supabase
            .from('document_versions')
            .insert({
            document_id: id,
            version_number: nextVersionNumber,
            file_path: filePath,
            file_name: file.originalname,
            file_size: file.size,
            uploaded_by: req.user?.id,
            change_notes,
            created_at: new Date().toISOString()
        })
            .select()
            .single();
        if (versionInsertError) {
            await database_1.supabase.storage.from('documents').remove([filePath]);
            throw (0, errorHandler_1.createError)(versionInsertError.message, 400);
        }
        res.status(201).json({
            message: 'Document version uploaded successfully',
            version
        });
    });
}
exports.DocumentController = DocumentController;
//# sourceMappingURL=DocumentController.js.map