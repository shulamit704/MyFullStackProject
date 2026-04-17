import { Component, Input } from '@angular/core';
import * as XLSX from 'xlsx';
 
@Component({
  selector: 'app-excel-export',
  templateUrl: './excel-export.component.html',
  styleUrl: './excel-export.component.css'
})
export class ExcelExportComponent {
  @Input() allData?: any[];
  @Input() filterData?: any[];
   @Input() ProducerName: string = 'אברהם'; // שם המפיק ברירת מחדל
  @Input() reportName: string = 'export.xlsx'; // שם קובץ ברירת מחדל
  @Input() filterColumns: string[] = []; // שמות העמודות לסינון
 
  exportToExcel(): void {
    console.log("ssssssssssssssssss",this.allData);
    
    if (!this.allData || !this.allData.length) {
      console.error("No data available for export.");
      return;
    }
 
    // תאריך יומי
    const today = new Date();
    const dateOnlyStr = today.toLocaleDateString('he-IL').replace(/\//g, '-'); // תאריך בלבד, לדוג' 30-06-2025
    const dateStr = dateOnlyStr + '_' +
      today.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }).replace(':', '-'); // תאריך_שעה, לדוג' 30-06-2025_14-37
 
 
 
    // כותרות ראשיות
    const headers = Object.keys(this.allData[0]);    
    const titleRow = [this.reportName];
    const dateRow = ['תאריך: ' + dateOnlyStr];
    const subtitleRow = ['שם המפיק: ' + this.ProducerName];
    const emptyRow = [[]];
 
    // כל השורות
    const filterSet = new Set((this.allData || []).map(row =>
      JSON.stringify(headers.map(header => row[header]))
    ));
    const visibleRows = (this.allData || []).map(item => headers.map(header => item[header]));
    const hiddenRows = this.allData
      .filter(item => !filterSet.has(JSON.stringify(headers.map(header => item[header]))))
      .map(item => headers.map(header => item[header]));
 
    const combinedData = [
      titleRow,
      //  dateRow,לבדוק דחוף מה לעשות עם זה
      subtitleRow,
      emptyRow[0],
      headers,
      ...visibleRows,
      ...hiddenRows
    ];
    // const reversedData = this.reverseRows(combinedData);
    // const ws = XLSX.utils.aoa_to_sheet(reversedData);
    const ws = XLSX.utils.aoa_to_sheet(combinedData);
 
    // הגדרת הגיליון לימין לשמאל
    // (ws as any)['!rtl'] = true;
 
    // עיצוב כותרות ראשיות (אם יש תמיכה ב-xlsx-style)
    // for (let c = 0; c < headers.length; c++) {
    //   const titleCell = ws[XLSX.utils.encode_cell({ r: 0, c })];
    //   if (titleCell) {
    //     titleCell.s = {
    //       font: { bold: true, sz: 22, color: { rgb: "FF0000" } },
    //       alignment: { horizontal: 'center', vertical: 'center' }
    //     };
    //   }
    //   const subtitleCell = ws[XLSX.utils.encode_cell({ r: 1, c })];
    //   if (subtitleCell) {
    //     subtitleCell.s = {
    //       font: { bold: true, sz: 18, color: { rgb: "FF0000" } },
    //       alignment: { horizontal: 'center', vertical: 'center' }
    //     };
    //   }
    // }
 
    // עיצוב כותרות עמודות (מרכז + bold)
    const headerRowIndex = 3;
    headers.forEach((header, i) => {
      const cell = ws[XLSX.utils.encode_cell({ r: headerRowIndex, c: i })];
      if (cell) {
        cell.s = {
          font: { bold: true, sz: 14, color: { rgb: "000000" } },
          alignment: { horizontal: 'center', vertical: 'center' }
        };
      }
    });
 
    // מיזוג כותרות ראשיות
ws['!merges'] = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } },
  { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } },
  { s: { r: 2, c: 0 }, e: { r: 2, c: headers.length - 1 } }
];
 
   
// קביעת טווח הפילטר רק לעמודות הרצויות
  if (this.filterColumns && this.filterColumns.length > 0) {
    // מציאת אינדקסים של העמודות לסינון
    const filterIndexes = this.filterColumns.map(col => headers.indexOf(col)).filter(i => i !== -1);
    if (filterIndexes.length > 0) {
      // טווח הפילטר: מהעמודה הראשונה שרוצים עד האחרונה
      const minCol = Math.min(...filterIndexes);
      const maxCol = Math.max(...filterIndexes);
      ws['!autofilter'] = {
        ref: XLSX.utils.encode_range({
          s: { r: headerRowIndex, c: minCol },
          e: { r: headerRowIndex, c: maxCol }
        })
      };
    }
  } else {
    // ברירת מחדל: פילטר על כל העמודות
    ws['!autofilter'] = {
      ref: XLSX.utils.encode_range({ s: { r: headerRowIndex, c: 0 }, e: { r: headerRowIndex, c: headers.length - 1 } })
    };
  }
    // עיצוב עמודות
    ws['!cols'] = headers.map(() => ({ wpx: 150 }));
 
    // הסתרת שורות לא מסוננות
    ws['!rows'] = [];
    for (let i = 0; i < visibleRows.length; i++) {
      ws['!rows'][i + 4] = { hidden: false };
    }
    for (let i = 0; i < hiddenRows.length; i++) {
      ws['!rows'][i + 4 + visibleRows.length] = { hidden: true };
    }
 
    // יצירת workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    const exportFileName = `${this.reportName}_${dateStr}.xlsx`;
    XLSX.writeFile(wb, exportFileName);
  }
}
 