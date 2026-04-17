import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { FormKey } from '../../../models/app-forms.model';

// import { FormField, FormSection } from '@shared/models/dynamic-form.model';
// import { DynamicFormService } from '../../providers/dynamic-form.service'
import { FormField, FormSection } from '../../../models/dynamic-form.model';
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent implements OnInit {
  private fieldConfig?: FormField<any>;
  private sectionConfig?: FormSection<any>;
  private arrayConfig?: (FormSection<any> | FormField<any>)[];
  private sectionFieldsArray?: [string, FormField<any>][];

  /** מפתח של הטופס */
  @Input() public formKey?: FormKey;

  /** הטופס עצמו */
  @Input() public group!: FormGroup ;

  /** מבנה האובייקט בטופס. זה יכול להיות קבוצה, מערך, או שדה */
  // @Input() public set config(
  //   config: FormField<any> | FormSection<any> | (FormSection<any> | FormField<any>)[]
  // ) {
  //   this.fieldConfig = config instanceof FormField ? config : undefined;
  //   this.arrayConfig = Array.isArray(config) ? config : undefined;
  //   this.sectionConfig = config instanceof FormSection ? config : undefined;
  //   this.sectionFieldsArray = Object.entries(this.sectionConfig?.fields || {});
  // }
  @Input() public set config(
    config: FormField<any> | FormSection<any> | (FormSection<any> | FormField<any>)[] | undefined
  ) {
    if (config) { // אם config קיים
      this.fieldConfig = config instanceof FormField ? config : undefined;
      this.arrayConfig = Array.isArray(config) ? config : undefined;
      this.sectionConfig = config instanceof FormSection ? config : undefined;
      this.sectionFieldsArray = this.sectionConfig ? Object.entries(this.sectionConfig?.fields || {}) : [];
    } else {
      // במידה ו- config הוא undefined, אתה יכול לאתחל ערכים ברירת מחדל
      this.fieldConfig = undefined;
      this.arrayConfig = undefined;
      this.sectionConfig = undefined;
      this.sectionFieldsArray = [];
    }
    
  }
  

  /** מסמן אם הפקד הזה "ילד" של אלמנט אחר. אין צורך לשלוח. לשימוש פנימי בלבד  */
  @Input() isChild?: boolean = false;

  /** מפתח של האובייקט בטופס. זה יכול להיות מפתח לקבוצה, מערך, או שדה. אין צורך לשלוח. לשימוש פנימי בלבד  */
  @Input() key!: string;

  /** זיהוי לשדה עבור אירועים. אין צורך לשלוח. לשימוש פנימי בלבד  */
  @Input() id?: string;

  /** אינדקס במערך אם יש. אין צורך לשלוח. לשימוש פנימי בלבד  */
  @Input() indx?: string;

  /** כל פקד חייב זיהוי יחודי - אם יש במסך מקרה שמשתמשים באותו טופס כמה פעמים. */
  @Input() uniqueIdForForm?: string;

  /** אינדקציה עם מוצג כטקסט פשוט והופך לעריכה רק בלחיצה על העיפרון  */
  @Input() savePerSection?: boolean;

  /** אינדיקציה - האם להפוך לעריכה, הטקסט שהתחיל כפשוט  */
  @Input() editing?: boolean;
  //#region ~~~~~  Getters  ~~~~~
  get sectionFields(): [string, FormField<any>][] {
    return this.sectionFieldsArray || [];
  }

  get field(): FormField<any> | undefined {
    return this.fieldConfig;
  }

  get section(): FormSection<any> | undefined {
    return this.sectionConfig;
  }

  get array(): (FormSection<any> | FormField<any>)[] | undefined {
    return this.arrayConfig;
  }

  get sectionGroup(): FormGroup {
    return this.group?.get(this.key) as FormGroup;
  }

  get formArray(): FormArray {
    return this.group?.get(this.key) as FormArray;
  }

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
  //#endregion

  dynform!: FormGroup;
  json: typeof JSON = JSON;

  // constructor(private dfSrv: DynamicFormService) { }

  ngOnInit() {
    if (!this.id) this.id = this.key;
    if (!this.editing) this.editing = false;
  }

  // cancelEdit(): void {
  //   this.sectionGroup.reset; 
  
  //   if (this.section?.fCancelEdit) {
  //     this.section.fCancelEdit(this.sectionGroup, this.key);
  //   }
  //   this.section?.editing = false;
  // }
  cancelEdit(): void {
    this.sectionGroup.reset;  // קריאה לפונקציה reset עם סוגריים
  
    if (this.section?.fCancelEdit) {
      this.section.fCancelEdit(this.sectionGroup, this.key);
    }
  
    // בדיקה אם section קיים לפני ההשמה
    if (this.section) {
      this.section.editing = false;
    }
  }
  

  get ErrorMsg(): string {
    return ""
    // return this.dfSrv.getErrorMsg(this.fc, (this.field || this.section || this.arrayConfig[0]));
  }

  get MainFormErrorMsg(): string {
    // return this.dfSrv.getErrorMsg(this.group, this.section);
    return ""
  }


  setEditing(value: boolean): void {
    if (this.section) {
      this.section.editing = value;
    }
  }
  
}