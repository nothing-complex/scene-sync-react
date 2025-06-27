
import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { CallsheetData } from '@/contexts/CallsheetContext';
import { PDFCustomization, DEFAULT_PDF_CUSTOMIZATION } from '@/types/pdfTypes';
import { CallsheetPDFDocument } from './callsheetDocument_backup';
import { registerPDFFonts } from './fontUtils_backup';

export class ReactPDFService {
  protected customization: PDFCustomization;
  private fontsRegistered: boolean = false;

  constructor(customization: Partial<PDFCustomization> = {}) {
    this.customization = { ...DEFAULT_PDF_CUSTOMIZATION, ...customization };
    console.log('ReactPDFService initialized with customization:', this.customization);
  }

  public async ensureFontsRegistered(): Promise<void> {
    if (!this.fontsRegistered) {
      try {
        console.log('Registering PDF fonts...');
        registerPDFFonts();
        this.fontsRegistered = true;
        console.log('PDF fonts registered successfully');
        // Give fonts more time to register properly
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.warn('Font registration failed:', error);
        // Continue without custom fonts - this should not break PDF generation
      }
    }
  }

  async generatePDF(callsheet: CallsheetData): Promise<Blob> {
    console.log('=== ReactPDFService.generatePDF Start ===');
    console.log('Generating PDF blob with full callsheet data:', callsheet);
    console.log('Using customization:', this.customization);
    
    try {
      // DEBUGGING: Enhanced validation
      if (!callsheet) {
        throw new Error('CallsheetData is null or undefined');
      }
      
      if (!callsheet.projectTitle || callsheet.projectTitle.trim() === '') {
        throw new Error('Project title is required and cannot be empty');
      }
      
      if (!callsheet.shootDate || callsheet.shootDate.trim() === '') {
        throw new Error('Shoot date is required and cannot be empty');
      }
      
      console.log('Callsheet validation passed');

      // Ensure fonts are registered before generating PDF
      await this.ensureFontsRegistered();

      console.log('Creating PDF document...');
      // Create the document using JSX syntax which returns the Document element directly
      const documentElement = (
        <CallsheetPDFDocument
          callsheet={callsheet}
          customization={this.customization}
        />
      );

      console.log('PDF document element created, generating blob...');
      // Pass the document element directly to pdf()
      const blob = await pdf(documentElement).toBlob();
      console.log('PDF blob generated successfully, size:', blob.size, 'bytes');
      
      // DEBUGGING: Additional validation of the generated blob
      if (!blob || blob.size === 0) {
        throw new Error('Generated PDF blob is empty or invalid');
      }
      
      return blob;
    } catch (error) {
      console.error('=== ReactPDFService.generatePDF Error ===');
      console.error('Error details:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('Callsheet data that failed:', JSON.stringify(callsheet, null, 2));
      
      // IMPROVED: More descriptive error messages
      if (error instanceof Error) {
        throw new Error(`PDF generation failed: ${error.message}`);
      } else {
        throw new Error('PDF generation failed due to an unknown error');
      }
    }
  }

  async savePDF(callsheet: CallsheetData, filename?: string): Promise<void> {
    console.log('=== ReactPDFService.savePDF Start ===');
    console.log('Saving PDF for callsheet:', callsheet.projectTitle);
    
    try {
      const blob = await this.generatePDF(callsheet);
      
      // DEBUGGING: Validate filename generation
      const sanitizedTitle = (callsheet.projectTitle || 'callsheet')
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      const fileName = filename || `${sanitizedTitle}_callsheet.pdf`;
      
      console.log('Creating download link for:', fileName);
      console.log('Blob size:', blob.size, 'bytes');
      console.log('Blob type:', blob.type);
      
      // IMPROVED: Enhanced download mechanism with better error handling
      const url = URL.createObjectURL(blob);
      if (!url) {
        throw new Error('Failed to create object URL for PDF download');
      }
      
      console.log('Object URL created successfully:', url);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      // DEBUGGING: Ensure link is properly added to DOM
      document.body.appendChild(link);
      console.log('Download link added to DOM, triggering click...');
      
      // Add event listeners to track download success/failure
      link.addEventListener('click', () => {
        console.log('Download link clicked successfully');
      });
      
      // Trigger the download
      try {
        link.click();
        console.log('Download click triggered successfully');
      } catch (clickError) {
        console.error('Error triggering download click:', clickError);
        throw new Error(`Failed to trigger download: ${clickError instanceof Error ? clickError.message : 'Unknown click error'}`);
      }
      
      console.log('Cleaning up download link...');
      
      // Clean up immediately after click
      setTimeout(() => {
        try {
          if (document.body.contains(link)) {
            document.body.removeChild(link);
            console.log('Download link removed from DOM');
          }
        } catch (removeError) {
          console.warn('Error removing download link:', removeError);
        }
      }, 100);
      
      // Clean up the URL after a short delay
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
          console.log('Object URL cleaned up');
        } catch (revokeError) {
          console.warn('Error revoking object URL:', revokeError);
        }
      }, 1000);
      
      console.log('PDF download process completed successfully');
    } catch (error) {
      console.error('=== ReactPDFService.savePDF Error ===');
      console.error('Error saving PDF:', error);
      
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`PDF download failed: ${error.message}`);
      } else {
        throw new Error('PDF download failed due to an unknown error');
      }
    }
  }

  async previewPDF(callsheet: CallsheetData): Promise<void> {
    console.log('=== ReactPDFService.previewPDF Start ===');
    console.log('Previewing PDF for callsheet:', callsheet.projectTitle);
    
    try {
      const blob = await this.generatePDF(callsheet);
      console.log('PDF blob generated for preview, size:', blob.size, 'bytes');
      
      // IMPROVED: Enhanced preview mechanism
      const url = URL.createObjectURL(blob);
      if (!url) {
        throw new Error('Failed to create object URL for PDF preview');
      }
      
      console.log('Opening PDF preview in new window...');
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        console.warn('Popup blocked, trying alternative method...');
        // Fallback method if popup is blocked
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.display = 'none';
        document.body.appendChild(link);
        
        try {
          link.click();
          console.log('Fallback preview link clicked');
        } catch (clickError) {
          console.error('Error with fallback preview:', clickError);
          throw new Error(`Failed to open PDF preview: ${clickError instanceof Error ? clickError.message : 'Unknown error'}`);
        } finally {
          document.body.removeChild(link);
        }
      }
      
      // Clean up the URL after a delay to allow the browser to load it
      setTimeout(() => {
        try {
          URL.revokeObjectURL(url);
          console.log('Preview URL cleaned up');
        } catch (revokeError) {
          console.warn('Error revoking preview URL:', revokeError);
        }
      }, 5000);
      
      console.log('PDF preview opened successfully');
    } catch (error) {
      console.error('=== ReactPDFService.previewPDF Error ===');
      console.error('Error previewing PDF:', error);
      
      // Re-throw with more context
      if (error instanceof Error) {
        throw new Error(`PDF preview failed: ${error.message}`);
      } else {
        throw new Error('PDF preview failed due to an unknown error');
      }
    }
  }
}
