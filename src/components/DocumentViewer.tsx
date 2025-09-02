import React from 'react';
import { X, Download, Eye, FileText, Image, File } from 'lucide-react';
import { Button } from './Button';

interface DocumentViewerProps {
  document: {
    id: string;
    file_name: string;
    file_path: string;
    mime_type?: string;
    file_size?: number;
    document_type: string;
    status: string;
    created_at: string;
    uploaded_by?: string;
    profiles?: { full_name?: string };
  };
  onClose: () => void;
  onDownload: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
  onDownload
}) => {
  const isImage = document.mime_type?.startsWith('image/');
  const isPDF = document.mime_type === 'application/pdf';
  const isText = document.mime_type?.startsWith('text/') || 
                 document.mime_type === 'application/msword' ||
                 document.mime_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getFileIcon = () => {
    if (isImage) return <Image className="w-8 h-8 text-blue-500" />;
    if (isPDF) return <FileText className="w-8 h-8 text-red-500" />;
    if (isText) return <File className="w-8 h-8 text-green-500" />;
    return <File className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {getFileIcon()}
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{document.file_name}</h2>
              <p className="text-sm text-gray-600">
                {document.document_type.replace('_', ' ')} • {formatFileSize(document.file_size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={Download}
              onClick={onDownload}
            >
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>

        {/* Document Info */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document.status)}`}>
                {document.status.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Uploaded:</span>
              <span className="ml-2 text-gray-600">{formatDate(document.created_at)}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Type:</span>
              <span className="ml-2 text-gray-600 capitalize">{document.document_type.replace('_', ' ')}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">By:</span>
              <span className="ml-2 text-gray-600">{document.profiles?.full_name || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-auto p-6">
          {isImage ? (
            <div className="text-center">
              <img
                src={document.file_path}
                alt={document.file_name}
                className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'block';
                }}
              />
              <div className="hidden mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-600">Image preview not available</p>
                <p className="text-sm text-gray-500">Use download button to view the file</p>
              </div>
            </div>
          ) : isPDF ? (
            <div className="text-center">
              <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-16 h-16 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Document</h3>
              <p className="text-gray-600 mb-4">
                This is a PDF document. Use the download button to view it in your PDF reader.
              </p>
              <Button icon={Download} onClick={onDownload}>
                Download PDF
              </Button>
            </div>
          ) : isText ? (
            <div className="text-center">
              <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <File className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Text Document</h3>
              <p className="text-gray-600 mb-4">
                This is a text document. Use the download button to view it in your text editor.
              </p>
              <Button icon={Download} onClick={onDownload}>
                Download Document
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <File className="w-16 h-16 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Document Preview</h3>
              <p className="text-gray-600 mb-4">
                Preview not available for this file type. Use the download button to view the file.
              </p>
              <Button icon={Download} onClick={onDownload}>
                Download File
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


