
import * as XLSX from 'xlsx';
import { CallsheetData } from '@/types/callsheet';

export class ExcelExportService {
  static exportSingleCallsheet(callsheet: CallsheetData): void {
    const workbook = XLSX.utils.book_new();

    // Summary worksheet
    const summaryData = [
      ['Project Title', callsheet.projectTitle],
      ['Shoot Date', callsheet.shootDate],
      ['General Call Time', callsheet.generalCallTime],
      ['Location', callsheet.location],
      ['Location Address', callsheet.locationAddress],
      ['Parking Instructions', callsheet.parkingInstructions],
      ['Basecamp Location', callsheet.basecampLocation],
      ['Weather', callsheet.weather],
      ['Special Notes', callsheet.specialNotes],
      ['Created', new Date(callsheet.createdAt).toLocaleDateString()],
      ['Last Updated', new Date(callsheet.updatedAt).toLocaleDateString()],
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWs, 'Summary');

    // Cast worksheet
    if (callsheet.cast.length > 0) {
      const castHeaders = ['Name', 'Role', 'Character', 'Phone', 'Email'];
      const castData = [
        castHeaders,
        ...callsheet.cast.map(member => [
          member.name,
          member.role,
          member.character || '',
          member.phone,
          member.email || ''
        ])
      ];
      const castWs = XLSX.utils.aoa_to_sheet(castData);
      XLSX.utils.book_append_sheet(workbook, castWs, 'Cast');
    }

    // Crew worksheet
    if (callsheet.crew.length > 0) {
      const crewHeaders = ['Name', 'Role', 'Department', 'Phone', 'Email', 'Company'];
      const crewData = [
        crewHeaders,
        ...callsheet.crew.map(member => [
          member.name,
          member.role,
          member.department || '',
          member.phone,
          member.email || '',
          member.company || ''
        ])
      ];
      const crewWs = XLSX.utils.aoa_to_sheet(crewData);
      XLSX.utils.book_append_sheet(workbook, crewWs, 'Crew');
    }

    // Schedule worksheet
    if (callsheet.schedule.length > 0) {
      const scheduleHeaders = ['Scene Number', 'Int/Ext', 'Description', 'Location', 'Page Count', 'Estimated Time'];
      const scheduleData = [
        scheduleHeaders,
        ...callsheet.schedule.map(item => [
          item.sceneNumber,
          item.intExt,
          item.description,
          item.location,
          item.pageCount,
          item.estimatedTime
        ])
      ];
      const scheduleWs = XLSX.utils.aoa_to_sheet(scheduleData);
      XLSX.utils.book_append_sheet(workbook, scheduleWs, 'Schedule');
    }

    // Emergency Contacts worksheet
    if (callsheet.emergencyContacts.length > 0) {
      const emergencyHeaders = ['Name', 'Role', 'Phone', 'Email'];
      const emergencyData = [
        emergencyHeaders,
        ...callsheet.emergencyContacts.map(contact => [
          contact.name,
          contact.role,
          contact.phone,
          contact.email || ''
        ])
      ];
      const emergencyWs = XLSX.utils.aoa_to_sheet(emergencyData);
      XLSX.utils.book_append_sheet(workbook, emergencyWs, 'Emergency Contacts');
    }

    // Apply basic formatting
    this.applyWorkbookFormatting(workbook);

    // Generate filename
    const sanitizedTitle = callsheet.projectTitle.replace(/[^a-zA-Z0-9]/g, '_');
    const date = new Date(callsheet.shootDate).toISOString().split('T')[0];
    const filename = `${sanitizedTitle}_${date}_callsheet.xlsx`;

    // Write and download
    XLSX.writeFile(workbook, filename);
  }

  static exportMultipleCallsheets(callsheets: CallsheetData[]): void {
    const workbook = XLSX.utils.book_new();

    // Overview worksheet with all callsheets
    const overviewHeaders = ['Project Title', 'Shoot Date', 'Call Time', 'Location', 'Cast Count', 'Crew Count', 'Scenes Count'];
    const overviewData = [
      overviewHeaders,
      ...callsheets.map(cs => [
        cs.projectTitle,
        cs.shootDate,
        cs.generalCallTime,
        cs.location,
        cs.cast.length,
        cs.crew.length,
        cs.schedule.length
      ])
    ];
    const overviewWs = XLSX.utils.aoa_to_sheet(overviewData);
    XLSX.utils.book_append_sheet(workbook, overviewWs, 'Overview');

    // All Cast worksheet
    const allCastHeaders = ['Project', 'Name', 'Role', 'Character', 'Phone', 'Email'];
    const allCastData = [allCastHeaders];
    callsheets.forEach(cs => {
      cs.cast.forEach(member => {
        allCastData.push([
          cs.projectTitle,
          member.name,
          member.role,
          member.character || '',
          member.phone,
          member.email || ''
        ]);
      });
    });
    if (allCastData.length > 1) {
      const allCastWs = XLSX.utils.aoa_to_sheet(allCastData);
      XLSX.utils.book_append_sheet(workbook, allCastWs, 'All Cast');
    }

    // All Crew worksheet
    const allCrewHeaders = ['Project', 'Name', 'Role', 'Department', 'Phone', 'Email', 'Company'];
    const allCrewData = [allCrewHeaders];
    callsheets.forEach(cs => {
      cs.crew.forEach(member => {
        allCrewData.push([
          cs.projectTitle,
          member.name,
          member.role,
          member.department || '',
          member.phone,
          member.email || '',
          member.company || ''
        ]);
      });
    });
    if (allCrewData.length > 1) {
      const allCrewWs = XLSX.utils.aoa_to_sheet(allCrewData);
      XLSX.utils.book_append_sheet(workbook, allCrewWs, 'All Crew');
    }

    this.applyWorkbookFormatting(workbook);

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `callsheets_export_${timestamp}.xlsx`;

    XLSX.writeFile(workbook, filename);
  }

  private static applyWorkbookFormatting(workbook: XLSX.WorkBook): void {
    // Apply basic formatting to all worksheets
    workbook.SheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
      
      // Auto-fit column widths
      const colWidths: Array<{ wch: number }> = [];
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let maxWidth = 10;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = worksheet[cellAddress];
          if (cell && cell.v) {
            const cellLength = cell.v.toString().length;
            maxWidth = Math.max(maxWidth, Math.min(cellLength + 2, 50));
          }
        }
        colWidths.push({ wch: maxWidth });
      }
      worksheet['!cols'] = colWidths;
    });
  }
}
