
export class DownloadManager {
  async downloadBlob(blob: Blob, fileName: string): Promise<void> {
    console.log('DownloadManager: Starting download for:', fileName);
    
    try {
      // Create blob URL
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      // Add to DOM and trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 1000);
      
      console.log('DownloadManager: Download completed successfully');
    } catch (error) {
      console.error('DownloadManager: Download failed:', error);
      throw new Error(`Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async previewBlob(blob: Blob): Promise<void> {
    console.log('DownloadManager: Opening PDF preview');
    
    try {
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        // Fallback for popup blockers
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      }
      
      // Clean up after delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
      
      console.log('DownloadManager: Preview opened successfully');
    } catch (error) {
      console.error('DownloadManager: Preview failed:', error);
      throw new Error(`Preview failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
