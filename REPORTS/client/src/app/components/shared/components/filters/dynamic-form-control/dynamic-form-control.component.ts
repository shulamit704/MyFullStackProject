import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { FormField } from '../../../models/dynamic-form.model';
import { debounceTime } from 'rxjs';
// import { SystemService } from '@app/core/providers/system.service';
// import { DynamicFormService } from '@app/shared/providers/dynamic-form.service';

@Component({
  selector: 'app-dynamic-form-control',
  templateUrl: './dynamic-form-control.component.html',
  styleUrls: ['./dynamic-form-control.component.css'],
  
})

export class DynamicFormControlComponent implements OnInit, AfterViewInit {
  /** של הפקד fieldConfig  */
  @Input() field?: FormField<any> | undefined;
  /** הקבוצה של הפקדים  */
  @Input() public group!: FormGroup;
  /** מפתח של האובייקט בטופס   */
  @Input() key!: string;
  /**  זיהוי לשדה עבור אירועים. לא חייבים לשלוח. אם אין ערך, ברירת מחדל: ערך המפתח   */
  @Input() id?: string;
  /** אינדקס במערך אם יש   */
  @Input() indx?: string;
  /** כל פקד חייב זיהוי יחודי - אם יש במסך מקרה שמשתמשים באותו טופס כמה פעמים. */
  @Input() uniqueIdForForm?: string;
  /** אינדקציה עם מוצג כטקסט פשוט והופך לעריכה רק בלחיצה על העיפרון  */
  @Input() savePerSection?: boolean;
  /** אינדיקציה - האם להפוך לעריכה, הטקסט שהתחיל כפשוט  */
  @Input() editing?: boolean;

  // rangeValues?: number=3;

  @Input() selection: number[] = [2019, 2025]; // ערך ברירת מחדל

  currentValue2: number = this.selection[0];
  currentValue3: number = this.selection[1];

  get fc(): AbstractControl | undefined {
    return this.group?.get(this.key) as AbstractControl;
  }

  get isValid() {
    return this.fc ? this.fc.valid : true;
  }

  get isDirty() {
    return this.fc ? this.fc.dirty : false;
  }

  get isTouched() {
    return this.fc ? this.fc.touched : false;
  }

  get isRequired(): boolean {
    return this.fc ? this.fc.hasValidator(Validators.required) : false;
  }

  // get GeneralShowElement(): boolean {
  //   return (!this.savePerSection || 
  // (this.savePerSection && (!this.field?.hideWhenSavePerSectionNotEdit ||
  //     (this.field.hideWhenSavePerSectionNotEdit && this.editing))));
  // }
  get GeneralShowElement(): boolean {
    // אם field או hideWhenSavePerSectionNotEdit לא קיימים, תחזור false
    const hideWhenSavePerSectionNotEdit = this.field?.hideWhenSavePerSectionNotEdit ?? false;
  
    // טיפול בתנאים כך שתמיד יחזור boolean
    const savePerSection = this.savePerSection ?? false;
    const editing = this.editing ?? false;
  
    return (
      !savePerSection || 
      (savePerSection && 
        (!hideWhenSavePerSectionNotEdit || 
          (hideWhenSavePerSectionNotEdit && editing))
      )
    );
  }
  


  // handleButtonClick(field: any): void {
  //   const clickEvent = field.events?.find((e: any) => e.name === 'click');
  //   if (clickEvent?.handler) {
  //     clickEvent.handler(); // מפעיל את ה-handler פעם אחת בלבד
  //   }
  // }
    
  get SimpleTextValue(): any {
    switch (this.field?.controlType) {
      case 'calendar':
        let dt = new Date(this.fc?.value);
        // if (dt.toDateString() === new Date(this.sSrv.ForEverDate).toDateString())
        //   return 'נצח';
        // dt.setMonth(dt.getMonth());
        return this.datePipe.transform(dt, 'dd.MM.yyyy');
      case 'select':
        return this.field.options?.find(o => o.key === this.fc?.value)?.txt;
      case 'inputNumberFormatted':
        return Intl.NumberFormat('he-il', { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(this.fc?.value);
        case 'number':
          return Intl.NumberFormat('he-il', { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(this.fc?.value);
          case 'range':
            if (Array.isArray(this.fc?.value)) {
                return this.fc.value.map((val: number) => 
                    Intl.NumberFormat('he-il', { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(this.fc?.value)
                );
            } else {
                return Intl.NumberFormat('he-il', { maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(this.fc?.value);
            }  
      default:
        return this.fc?.value;  
           }
  }

  get GetId(): string {
    let s: string = this.id ? this.id : this.key;
    // must have a unique id. 
    s += (this.uniqueIdForForm ? ('_' + this.uniqueIdForForm) : '');
    return s;
  }

// get GetMainId(): string {
//   return this.GetId + (this.field?.controlType === 'radio' && this.field?.options?.length > 0 ?
//     ('_' + this.field.options[0].key) : '');
// }
get GetMainId(): string {
  return this.GetId + (this.field?.controlType === 'radio' && this.field?.options && this.field.options.length > 0 ? 
    ('_' + this.field.options[0].key) : '');
}



  noCtrlHeader: boolean;

  // constructor(private Srv: DynamicFormService, private elRef: ElementRef, private datePipe: DatePipe,
  //             private sSrv: SystemService) {
  //   this.noCtrlHeader = false;
  // }

constructor(private elRef: ElementRef, private datePipe: DatePipe) {
   this.noCtrlHeader = false;
  
}
  // ngOnInit() {
    
  //   if (this.field?.controlType === 'inputNumber') {
  //     this.field?.validators?.push(Validators.pattern("^[0-9]*$"));
  //   }
  //   //לא מציגים טקסט מעל רדיו או צ'ק בוקס או כפתור
  //   this.noCtrlHeader = (this.field?.label?.length === 0 &&
  //     (this.field.controlType === 'radio' || this.field.controlType === 'checkbox') ||
  //     (this.field?.controlType.toString().indexOf('button') > -1));
  // }
  
  ngOnInit() {

    // לוודא ש-field קיים לפני הגישה אליו
    if (this.field && this.field.controlType === 'inputNumber') {
      this.field.validators?.push(Validators.pattern("^[0-9]*$"));
    }
   

  // this.fc?.valueChanges.subscribe(value => {
  //   console.log('New value:', value);
  // });
    // לא מציגים טקסט מעל רדיו, צ'ק בוקס או כפתור
    if (this.field) {
      this.noCtrlHeader = (
        this.field.label?.length === 0 &&
        (this.field.controlType === 'radio' || this.field.controlType === 'checkbox') ||
        (this.field.controlType?.toString().indexOf('button') > -1)
      );
    }
  }

  
  ngAfterViewInit() {
    if (!this.field || !this.GetId || this.field.controlType === 'template' || this.field.controlType === 'separator') return;

    this.field.events?.forEach(e=> {
      if (this.field?.controlType === 'radio') {
        this.field.options?.forEach(o => {
          this.addEvent(e, `${this.GetId}_${o.key}`);
        });
      } else {
        this.addEvent(e, this.GetId);
      }
    });

    if (this.field.controlType === 'radio') {
      this.field.options?.forEach(o => {
        this.addEvent({ name: 'focusin', handler: this.onFocus }, `${this.GetId}_${o.key}`);
      });
    } else {
      this.addEvent({ name: 'focusin', handler: this.onFocus }, this.GetId);
    }

    // בחר את הפקד הראשון
    // if (this.field.autoFocus) {
    //   let id: string = this.GetId;
    //   if (this.field.controlType === 'radio') {
    //     id = `${this.GetId}_${this.field.options[0].key}`;
    //   }
    //   setTimeout(() => {
    //     this.elRef.nativeElement.querySelector("#" + id).focus();
    //   }, 0);
    // }
    // בחר את הפקד הראשון
if (this.field && this.field.autoFocus) {
  let id: string = this.GetId;
  
  // בדוק אם controlType הוא 'radio' ו־options קיימים
  if (this.field.controlType === 'radio' && this.field.options && this.field.options.length > 0) {
    id = `${this.GetId}_${this.field.options[0].key}`;
  }
  
  // חכה לזמן מסוים ואז יישם את הפוקוס על האלמנט
  setTimeout(() => {
    const element = this.elRef.nativeElement.querySelector("#" + id);
    if (element) {
      element.focus();
    }
  }, 0);
}

  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
  }

  // addEvent(e: { name: string, handler: Function }, ctrlId: string) {
  //   this.elRef.nativeElement.querySelector("#" + ctrlId).addEventListener(e.name, e.handler.bind(this));
  //   console.log("addEvent", e.name, ctrlId);
    
  // }


  addEvent(e: { name: string, handler: Function }, ctrlId: string) {
    const element = this.elRef.nativeElement.querySelector("#" + ctrlId);
    if (element) {
      element.addEventListener(e.name, e.handler.bind(this));
      console.log("addEvent", e.name, "sssssssss",ctrlId);
    } else {
      console.warn(`Element with ID ${ctrlId} not found. Event ${e.name} was not added.`);
    }
  }
  isNumeric(event: any) {
    // return this.dfSrv.isNumeric(event);
  }

  specialEvent(name: string, event: any, frmControl: AbstractControl | undefined) {
 
    // console.log("specialEvent", name, event, frmControl);
    
    if (!frmControl) {
      // טיפול במקרה שאין AbstractControl
      return;
    }
    const found = this.field?.events?.find((evts) => {
      return evts.name === name;
    });  
    return found?.handler(event, frmControl) || undefined;
  }
  

  onFocus = (e: Event) => {
    // this.dfSrv.lastActiveElement = e.target as HTMLElement;
  }

  // checkMax = () => {
  //   if (this.isValid) return;
  //   const reqLen = this.fc?.errors?.maxlength.requiredLength || 0;
  //   if (reqLen > 0) {
  //     return this.fc?.errors?.maxlength.requiredLength;
  //   }
  // }


  
  checkMax = () => {
    if (this.isValid) return;
    const reqLen = this.fc?.errors?.['maxlength']?.requiredLength || 0;
    if (reqLen > 0) {
      return this.fc?.errors?.['maxlength']?.requiredLength;
    }
  }

  needPlaceHolder(): boolean {
    const currentVal = this.fc?.value;
    if (!currentVal || currentVal == '') return true;

    //check that the value is in the current options list
    let found: boolean = true;
    // if (this.field?.controlType === 'select') {
    //   found = false;
    //   for (let index = 0; index < this.field.options.length; index++) {
    //     const element = this.field?.options?[index];
    //     if (element.key == currentVal) {
    //       found = true;
    //       break;
    //     }
    //   }
    // }
    if (this.field?.controlType === 'select') {
      found = false;
      
      // בדוק אם options קיימים לפני המעבר עליהם
      if (this.field.options?.length) {
        for (let index = 0; index < this.field.options.length; index++) {
          const element = this.field.options[index];
          if (element.key == currentVal) {
            found = true;
            break;
          }
        }
      }
    }
    
    if (!found) {
      this.fc?.setValue(null);
    }
    return !found;
  }

  get ErrorMsg(): string {
    return ""
    // return this.dfSrv.getErrorMsg(this.fc, (this.field));
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  
}