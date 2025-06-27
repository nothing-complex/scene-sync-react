
export class DownloadManager {
  static async downloadBlob(blob: Blob, filename: string): Promise<void> {
    console.log('DownloadManager: Starting download for:', filename);
    
    try {
      // Modern browsers with File System Access API
      if ('showSaveFilePicker' in window) {
        console.log('DownloadManager: Using File System Access API');
        await this.downloadWithFileSystemAPI(blob, filename);
        return;
      }

      // Fallback to traditional download method
      console.log('DownloadManager: Using traditional download method');
      await this.downloadWithLink(blob, filename);
    } catch (error) {
      console.error('DownloadManager: Download failed:', error);
      throw new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private static async downloadWithFileSystemAPI(blob: Blob, filename: string): Promise<void> {
    try {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'PDF files',
          accept: { 'application/pdf': ['.pdf'] }
        }]
      });

      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      
      console.log('DownloadManager: File saved successfully with File System API');
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('DownloadManager: User cancelled download');
        return;
      }
      throw error;
    }
  }

  private static async downloadWithLink(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob);
    
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log('DownloadManager: Download triggered with link method');
    } finally {
      // Clean up the object URL
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }
  }

  static async openPreview(blob: Blob): Promise<void> {
    console.log('DownloadManager: Opening PDF preview in new tab');
    
    try {
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        throw new Error('Popup blocked by browser. Please allow popups and try again.');
      }

      // Clean up URL after a delay to allow the browser to load it
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      
      console.log('DownloadManager: Preview opened successfully');
    } catch (error) {
      console.error('DownloadManager: Error opening preview:', error);
      throw error;
    }
  }
}
