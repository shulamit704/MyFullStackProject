
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload'; // Import necessary types
 
interface UploadEvent {
  originalEvent: Event; // This may need to be updated
  files: File[];
}
 
@Component({
  selector: 'app-convert-xml-to-json',
  templateUrl: './convert-xml-to-json.component.html',
  styleUrls: ['./convert-xml-to-json.component.css'] // Corrected from styleUrl to styleUrls
})
export class ConvertXmlToJsonComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload; // Reference to the file upload component
  constructor(private messageService: MessageService,private router: Router) { }
 
 
  onUpload(event: any) {
    const uploadedFiles = event.files;
    console.log(uploadedFiles); // Log the uploaded files
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'XML File Uploaded' });
  }
 
 
 
 
  onSelect(event: any) {
    const filesArray = Array.from(event.files);
 
    console.log("Files array:", filesArray);
 
    filesArray.forEach(file => {
        const fileReader = new FileReader();
 
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
            const xmlContent = e.target?.result;
 
            console.log("XML Content:", xmlContent);
 
            // Convert XML to JSON using the custom function
            const jsonResult = this.xmlToJson(xmlContent as string);
 
            if (jsonResult) {
                console.log("JSON Output:", jsonResult);
                this.saveJsonToFile(jsonResult); // Save JSON to file
 
                this.fileUpload.clear();
            }
        };
 
        fileReader.readAsText(file as File);
    });
}
 
 
  xmlToJson(xml: string): any {
    let obj = {};
 
    try {
      // בדיקה אם ה-XML ריק
      if (!xml || xml.trim() === "") {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The XML file is empty.' });
        return null;
      }
 
      // ניקוי רווחים מיותרים
      xml = xml.trim().replace(/>\s+</g, '><');
 
      // Parse the XML string into an XML Document
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "application/xml");
 
// בדיקה לשגיאות בניתוח ה-XML
const parserError = xmlDoc.getElementsByTagName("parsererror");
if (parserError.length > 0) {
  const errorMessage = parserError[0].textContent || "Unknown parsing error.";
 
  // הוספת פרטים נוספים לשגיאה
  const detailedError = `
    Error parsing XML:
    ${errorMessage}
    Problematic XML:
    ${xml.trim()}
  `;
 
  this.messageService.add({
    severity: 'error',
    summary: 'Error',
    detail: detailedError
  });
 
  console.error(detailedError);
  return null;
}
      // בדיקה אם ה-XML מכיל תוכן
      if (!xmlDoc.documentElement || !xmlDoc.documentElement.nodeName) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The XML file does not contain valid content.' });
        console.error("The XML file does not contain valid content.");
        return null;
      }
 
      // פונקציה רקורסיבית לבדיקה אם כל תגית סגורה כראוי
     const validateNesting = (node: Node): boolean => {
        const stack: string[] = [];
        const traverse = (currentNode: Node): boolean => {
          if (currentNode.nodeType === Node.ELEMENT_NODE) {
            const tagName = currentNode.nodeName;
            stack.push(tagName);
     
            for (let i = 0; i < currentNode.childNodes.length; i++) {
              if (!traverse(currentNode.childNodes[i])) {
                return false;
              }
            }
     
            const lastTag = stack.pop();
            if (lastTag !== tagName) {
              // הצגת שם התגית הבעייתית
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: `Tag mismatch: expected </${lastTag}> but found </${tagName}>.`,
              });
              console.error(`Tag mismatch: expected </${lastTag}> but found </${tagName}>.`);
              return false;
            }
          }
          return true;
        };
     
        return traverse(node);
      };
 
 
      // בדיקה אם הקינון תקין
      // if (!validateNesting(xmlDoc.documentElement)) {
      //   return null; // הפונקציה תעצור אם יש בעיה בקינון
      // }
 
      // בדיקה אם הקינון תקין
      if (!validateNesting(xmlDoc.documentElement)) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'The XML file contains improperly nested tags.' });
        console.error("The XML file contains improperly nested tags.");
        return null;
      }
 
      // פונקציה רקורסיבית להמרת XML ל-JSON
      function traverse(node: Node): any {
        // אם הצומת הוא מסוג טקסט, נחזיר את התוכן שלו
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.nodeValue?.trim();
          return text && text.length > 0 ? text : null; // מחזיר null אם הטקסט ריק
        }
 
        // אם הצומת הוא מסוג אלמנט, נמשיך לעבד אותו
        if (node.nodeType === Node.ELEMENT_NODE) {
          const result: any = {};
          const element = node as Element;
 
          // עיבוד מאפיינים (Attributes)
          if (element.attributes) {
            for (let i = 0; i < element.attributes.length; i++) {
              const attr = element.attributes[i];
              result[`@${attr.name}`] = attr.value;
            }
          }
 
          // עיבוד צמתים פנימיים
          let textContent = null; // משתנה לשמירת טקסט פנימי
          for (let i = 0; i < node.childNodes.length; i++) {
            const child = node.childNodes[i];
            const childName = child.nodeName;
            const childValue = traverse(child);
 
            if (child.nodeType === Node.TEXT_NODE && childValue !== null) {
              textContent = childValue; // שמירת הטקסט הפנימי
            } else if (childValue !== null) {
              if (result[childName]) {
                if (!Array.isArray(result[childName])) {
                  result[childName] = [result[childName]];
                }
                result[childName].push(childValue);
              } else {
                result[childName] = childValue;
              }
            }
          }
 
          // אם יש רק טקסט פנימי ואין צמתים נוספים, נחזיר את הטקסט
          if (Object.keys(result).length === 0 && textContent !== null) {
            return textContent;
          }
 
          return result;
        }
 
        return null; // מתעלם מצמתים שאינם טקסט או אלמנט
      }
 
      // המרת ה-XML ל-JSON
      obj = traverse(xmlDoc.documentElement);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'XML successfully converted to JSON and JSON file has been downloaded.' });
      return obj;
 
    } catch (error) {
      // טיפול בשגיאות כלליות
      console.error("Unexpected error:", error);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An unexpected error occurred while processing the XML file.' });
      return null;
    }
 
  }
 
  saveJsonToFile(json: any) {
    const jsonString = JSON.stringify(json, null, 2); // Format JSON with 2 spaces
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
   
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json'; // Set the default file name
    document.body.appendChild(a); // Append to body to make it work in Firefox
    a.click(); // Programmatically click to trigger download
    document.body.removeChild(a); // Clean up after download
   
    // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'JSON file has been downloaded.' });
}
}
 
// onUpload(event: any) {
//   const uploadedFiles = event.files;
//   if (uploadedFiles && uploadedFiles.length > 0) {
//       console.log('Uploaded file:', uploadedFiles[0]);
//       this.messageService.add({ severity: 'info', summary: 'Success', detail: 'XML File Uploaded' });
//   } else {
//       console.error('No file uploaded');
//   }
 