import { TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { range } from 'rxjs';

export interface FormErrMsg {
    errorName: string,
    txt: string
}
 
export interface IOption {
    key: any,
    txt: string,
    disabled?: boolean
}
 
export type ControlsOf<T extends Record<string, any>> = {
    [K in keyof T]: T[K] extends Array<any>
    ? FormArray<AbstractControl<T[K][0]>>
    : T[K] extends Record<any, any>
    ? FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K] | null>;
};
 
export type ConfigOf<T> = {
    [K in keyof T]:
    T[K] extends (infer U)[]
    ? U extends Record<any, any>
    ? FormSection<ConfigOf<U>>[]
    : FormField<U>[]
    : T[K] extends Record<any, any>
    ? FormSection<ConfigOf<T[K]>>
    : FormField<T[K]>;
};
 
export class FormSection<T extends {
    [K in keyof T]: FormSection<any> | FormField<any> | (FormSection<any> | FormField<any>)[]; } = any> {
    /** כל פקד חייב זיהוי יחודי - אם יש במסך מקרה שמשתמשים באותו טופס כמה פעמים. */
    public uniqueIdForForm?: string;
    /** אם אמת, הטופס תהיה תוצג כטקסט פשוט. לחיצה על כפתור עדכון -> תשנה את הטקסט לשדות בטופס עם כפתור איקס בפינה לבטל */
    public savePerSection?: boolean;
    /** for use of savePerSectionOnly - האם האזור במצב עריכה כרגע או לא */
    public editing?: boolean;
    /** for use of savePerSectionOnly - האם להציג איקס בפינה לאפשר ביטול של עריכה */
    public stayInCurrentEditingMode?: boolean;
    /** for use of savePerSectionOnly - פונקציה להפעיל אחרי לחיצה על איקס, לבטל עריכה */
    public fCancelEdit?: Function;
    public title?: string;
    public titleTemplate?: TemplateRef<any>;
    public fields: T;
    /** for validation of Form Arrays */
    public validators?: ValidatorFn[];
    /** for validation of Form Arrays */
    public errorMessages?: FormErrMsg[];
 
    constructor(section: {
        uniqueIdForForm?: string;
        savePerSection?: boolean;
        editing?: boolean;
        stayInCurrentEditingMode?: boolean;
        fCancelEdit?: Function;
        title?: string;
        titleTemplate?: TemplateRef<any>;
        fields: T;
        validators?: ValidatorFn[];
        errorMessages?: FormErrMsg[];
    }) {
        this.uniqueIdForForm = section.uniqueIdForForm;
        this.savePerSection = section.savePerSection || false;
        this.editing = section.editing || false;
        this.stayInCurrentEditingMode = section.stayInCurrentEditingMode || false;
        this.fCancelEdit = section.fCancelEdit || undefined;
        this.title = section.title;
        this.titleTemplate = section.titleTemplate;
        this.fields = section.fields;
        this.validators = section.validators || [];
        this.errorMessages = section.errorMessages || [];
    }
}
 
export type FormControlType =
    | 'inputText'
    | 'inputEmail'
    | 'inputNumber'
    | 'inputNumberFormatted'
    | 'inputSwitch'
    | 'textarea'
    | 'checkbox'
    | 'radio'
    | 'select'
    | 'multiple'
    | 'calendar'
    | 'buttonIconOnly'
    | 'buttonTxt'
    | 'template'
    | 'separator'
    | 'number'
    | 'otherType'
    | 'year'       // Add this for the year range
    | 'date'
    | 'range';
 
 
 
 
export class FormField<T> {
    public value: T;
    public controlType: FormControlType;
    public validators?: ValidatorFn[];
    public label?: string;
    public labelTemplate?: TemplateRef<any>;
    public placeholder?: string;
    public isDisabled?: boolean;
    public options?: IOption[];
    public errorMessages?: FormErrMsg[];
    public events?: { name: string, handler: Function }[];
    public autoFocus?: boolean;
    public icon?: string;
    public minDate?: Date;
    public maxDate?: Date;
    public defaultDate?: Date;
    public classNm?: string;
    public showTime?: boolean;
    public showSeconds?: boolean;
    public radioShowGrouped?: boolean;
    public message?: string;
    public tooltip?: string;
    public min?: number; // הכנס מינימום לערך
    public max?: number; // הכנס מקסימום לערך
    public step?: number; // הכנס שלב
    public rangetype?: string; // הכנס סוג טווח
    // public rangeValue?: number[];
    /** אנידיקציה להסתיר כשבמצב טקסט פשוט ולא עריכה */
    public hideWhenSavePerSectionNotEdit?: boolean;
 
    constructor(field: {
        value: T;
        controlType: FormControlType;
        validators?: ValidatorFn[];
        label?: string;
        labelTemplate?: TemplateRef<any>;
        placeholder?: string;
        isDisabled?: boolean;
        options?: IOption[];
        errorMessages?: FormErrMsg[];
        events?: { name: string, handler: Function }[];
        /** לסמן "אמת" את הפקד היחיד שמקבל פוקוס בכניסה לטופס */
        autoFocus?: boolean;
        icon?: string;
        // minDate?: Date;
        // maxDate?: Date;
        defaultDate?: Date;
        classNm?: string;
        showTime?: boolean;
        showSeconds?: boolean;
        message?: string;
 
        /** אם להציג את ה"רדיו" בקופסה כמו אובייקט טקסט */
        radioShowGrouped?: boolean;
        tooltip?: string;
        min?: number;
        max?: number;
        step?: number;
        rangetype?: string; // הכנס סוג טווח
        // rangeValue: number[];
        /** אנידיקציה להסתיר כשבמצב טקסט פשוט ולא עריכה */
        hideWhenSavePerSectionNotEdit?: boolean;
    }) {
        this.value = field.value;
        this.controlType = field.controlType;
        this.validators = field.validators || [];
        this.label = field.label || '';
        this.labelTemplate = field.labelTemplate || null || undefined;
        this.placeholder = field.placeholder || field.label;
        this.isDisabled = field.isDisabled || false;
        this.options = field.options || [];
        this.errorMessages = field.errorMessages || [];
        this.events = field.events || [];
        this.autoFocus = field.autoFocus || false;
        this.icon = field.icon;
        this.min = field.min;
        this.max = field.max
        this.rangetype = field.rangetype || '';
        // this.defaultDate = field.defaultDate || null;
        this.classNm = field.classNm;
        this.showTime = field.showTime || false;
        this.showSeconds = field.showSeconds || false;
        this.radioShowGrouped = field.radioShowGrouped || false;
        this.message = field.message || '';
        this.tooltip = field.tooltip || '';
        this.min = typeof field.min === 'string' ? parseFloat(field.min) : field.min;
        this.max = typeof field.max === 'string' ? parseFloat(field.max) : field.max;
        this.rangetype = field.rangetype || '';
        this.step = field.step;
        //   this.rangeValue=field.rangeValue
        this.hideWhenSavePerSectionNotEdit = field.hideWhenSavePerSectionNotEdit || false;
    }
}