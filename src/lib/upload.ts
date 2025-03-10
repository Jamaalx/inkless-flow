// File upload helpers
export function uploadFile(file: File): Promise<{ url: string; key: string }> {
    // In a real implementation, this would upload to a storage service
    return new Promise((resolve) => {
      setTimeout(() => {
        const key = `documents/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const url = `/api/documents/${key}`;
        resolve({ url, key });
      }, 1000);
    });
  }
  
  export function isSupportedDocumentType(file: File): boolean {
    const supportedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/tiff',
    ];
    
    return supportedTypes.includes(file.type);
  }
  
  export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }