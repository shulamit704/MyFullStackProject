import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SystemService } from '../services/system.service';
import { FormKey } from '../components/shared/models/app-forms.model';
import { FormSection, ConfigOf, ControlsOf, FormField } from '../components/shared/models/dynamic-form.model';
 
@Injectable()
 
export class DynamicFormService implements OnDestroy {
 
    private dynamicForm: any;
    public dynamicForm$: any;
 
    // public lastActiveElement: HTMLElement;
 public lastActiveElement: HTMLElement | null = null; // עדכון טיפוס לשלב null
 
    /** שמירת מידע כלשהוא אודות שגיאה ברמה של שמירה של הטופס  */
    public apiError = {};
 
    subChanges: { [key: string]: { [key: string]: Subscription } };
 
    navigationKeys: Array<string> = ['Control', 'Shift', 'Insert', 'Delete', 'Backspace', 'Tab', 'Escape', 'Enter', 'Up', 'Down', 'Left', 'Right'];
 
    constructor(private sSrv: SystemService) {
        this.dynamicForm = {};
        this.dynamicForm$ = {};
        this.lastActiveElement = null;
        this.apiError = {};
        this.subChanges = {};
    }
 
    ngOnDestroy(): void {
        this.clearSubscriptions();
    }
 
    public createForm<T extends Record<string, any>>(frmKey: FormKey, frmSections: FormSection<ConfigOf<T>>) {
 
        const form = this.createFormGroup(frmSections, frmSections.validators);
 
        // אינסטנס חדש בשביל הטופס, הוסף אותו לנצפים
        if (!this.subChanges[frmKey]) {
            this.subChanges[frmKey] = {};
        }
        else {
            this.unsubscribeByKey(frmKey);
        }
 
        this.subChanges[frmKey]["valueChanges"] =
            form.valueChanges
                .subscribe(values => {
                    if (form.dirty) {
                        this.sSrv.HasChanges = true;
                    }
                });
 
        this.subChanges[frmKey]["statusChanges"] =
            form.statusChanges.subscribe(() => this.formStatusChanged(frmKey, form));
 
        if (!this.dynamicForm[frmKey]) {
            // אינסטנס חדש בשביל הטופס, הוסף אותו לנצפים
            this.createBehaviorSubject(frmKey, form);
        }
        else {
            //האינסטנס כבר קיים.  יש להודיע על נתונים חדשים
            this.dynamicForm[frmKey].next(form);
        }
    }
 
    clearSubscriptions() {
        Object.keys(this.subChanges).forEach(k => {
            if (this.subChanges[k]) {
                this.unsubscribeByKey(k);
            }
        });
    }
 
    unsubscribeByKey(key: any) {
        Object.keys(this.subChanges[key]).forEach(s => {
            if (this.subChanges[key][s]) this.subChanges[key][s].unsubscribe();
        });
    }
 
    // createBehaviorSubject(key: FormKey, form: FormGroup = null) {
    //     // אינסטנס חדש בשביל הטופס, הוסף אותו לנצפים
    //     this.dynamicForm[key] = new BehaviorSubject<FormGroup>(form);
    //     this.dynamicForm$[key] = this.dynamicForm[key].asObservable();
    // }
    createBehaviorSubject(key: FormKey, form: FormGroup<any> | null = null) {
        // אינסטנס חדש בשביל הטופס, הוסף אותו לנצפים
        this.dynamicForm[key] = new BehaviorSubject<FormGroup<any> | null>(form);
        this.dynamicForm$[key] = this.dynamicForm[key].asObservable();
    }
   
 
    public createFormGroup<T extends Record<string, any>>(section: FormSection<ConfigOf<T>>, validators?: ValidatorFn[])
        : FormGroup<ControlsOf<T>> {
 
        const group = new FormGroup({}, validators);
 
        Object.keys(section.fields).forEach((key: any) => {
            const field = section.fields[key];
            const validators = section.validators;
 
            if (Array.isArray(field)) {
                group.addControl(key, this.createFormArray(field));
            } else {
                if (field instanceof FormSection) {
                    group.addControl(key, this.createFormGroup(field, field.validators));
                } else {
 
                    if (field.controlType.toString().indexOf('button') === -1) {
                        group.addControl(key, new FormControl(field.value, field.validators));
                        // if (field.isDisabled) {
                        //     group.controls[key].disable();
                        // }
                     
                    }
                }
            }
        });
 
        return group as unknown as FormGroup<ControlsOf<T>>;
    }
 
    public createFormArray<T extends Record<string, any>>(fields: unknown[], validators?: ValidatorFn[])
        : FormArray<AbstractControl<T>> {
 
        const array: FormArray<AbstractControl<any>> = new FormArray(
            [], validators
        ) as unknown as FormArray<AbstractControl<T>>;
 
        fields.forEach((field) => {
            if (field instanceof FormSection) {
                array.push(this.createFormGroup(field, field.validators));
            } else {
                const { value, validators } = field as FormField<T>;
                array.push(new FormControl(value, validators));
            }
        });
 
        return array as unknown as FormArray<AbstractControl<T>>;
    }
 
    /** place the form's data in the service
        parent forms can listen for changes inside the form */
    formStatusChanged(frmKey: FormKey, fData: FormGroup) {
        this.dynamicForm[frmKey].next(fData);
    }
 
    /** בחירת פקד בטופס.  אם לא נשלח זהות של פקד, לנסות לבחור את הפקד האחרון שנבחר */
    setFocus(id: string | undefined) {
 
        if (!id) {
            id = this.lastActiveElement?.id;
        }
 
        setTimeout(() => {
            // try to reset focus
            if (id && document.getElementById(id)) {
                const element = document.getElementById(id);
                if (element) {
                    element.focus();
                }
            }
        }, 0);
    }
 
    isNumeric = (e: KeyboardEvent) => {
        //console.debug("KeyboardEvent: " + e.key + " , " + e.ctrlKey);
 
        if (
            // Allow: Delete, Backspace, Tab, Escape, Enter, etc
            this.navigationKeys.indexOf(e.key) > -1 ||
           
            (e.key?.toLowerCase() === 'a' && e.ctrlKey === true) || // Allow: Ctrl+A
            (e.key === 'ש' && e.ctrlKey === true) || // Allow: Ctrl+ש
 
            (e.key?.toLowerCase() === 'c' && e.ctrlKey === true) || // Allow: Ctrl+C
            (e.key === 'ב' && e.ctrlKey === true) || // Allow: Ctrl+ב
 
            (e.key?.toLowerCase() === 'v' && e.ctrlKey === true) || // Allow: Ctrl+V
            (e.key === 'ה' && e.ctrlKey === true) || // Allow: Ctrl+ה
 
            (e.key?.toLowerCase() === 'x' && e.ctrlKey === true) || // Allow: Ctrl+X
            (e.key === 'ס' && e.ctrlKey === true) || // Allow: Ctrl+ס
 
            (e.key?.toLowerCase() === 'a' && e.metaKey === true) || // Cmd+A (Mac)
            (e.key === 'ש' && e.metaKey === true) || // Cmd+ש (Mac)
 
            (e.key?.toLowerCase() === 'c' && e.metaKey === true) || // Cmd+C (Mac)
            (e.key === 'ב' && e.metaKey === true) || // Cmd+ב (Mac)
 
            (e.key?.toLowerCase() === 'v' && e.metaKey === true) || // Cmd+V (Mac)
            (e.key === 'ה' && e.metaKey === true) || // Cmd+ה (Mac)
 
            (e.key?.toLowerCase() === 'x' && e.metaKey === true) || // Cmd+X (Mac)
            (e.key === 'ס' && e.metaKey === true) || // Cmd+ס (Mac)
 
            (e.key === '.') // Allow: .
        ) {
            return;  // let it happen, don't do anything
        }
        // Ensure that it is a number and stop the keypress
        if (e.key === ' ' || isNaN(Number(e.key))) {
            e.preventDefault();
        }
    }
 
//     getErrorMsg(fc: AbstractControl<any, any>, frmConfig: FormField<any> | FormSection<any>) {
 
//         let errs: ValidationErrors | null = fc?.errors;
 
//         if (errs == null || errs == undefined) return '';
 
//         if (!frmConfig) return '';
 
//         if (errs['required'])
//             return this.getBuiltInErrorMsgs(frmConfig, 'required') || 'שדה חובה';
 
//         if (errs['email'])
//             return this.getBuiltInErrorMsgs(frmConfig, 'email') || 'כתובת לא תקין';
 
//         if (errs['min'])
//             return this.getBuiltInErrorMsgs(frmConfig, 'min') || `הערך קטן מ ${errs['min'].min.toString()}`;
 
//         if (errs['max'])
//             return this.getBuiltInErrorMsgs(frmConfig, 'max') || `הערך גדול מ ${errs['max'].max.toString()}`;
 
//         if (errs['minlength'])
//             return this.getBuiltInErrorMsgs(frmConfig, 'minlength') || `מינימום ${errs['minlength'].requiredLength} תווים`;
 
//         if (errs['maxlength'])
//             return this.getBuiltInErrorMsgs(frmConfig, 'maxlength') || `מקסימום ${errs['maxlength'].requiredLength} תווים`;
 
//         if (errs['pattern'])
//             return this.getBuiltInErrorMsgs(frmConfig, 'pattern') || 'הערך אינו בפורמט הנכון';
 
//         for (let index = 0; index < frmConfig?.errorMessages.length; index++) {
//             const e = frmConfig.errorMessages[index];
//             if (e.errorName == errs['key']) return e.txt;
//         }
 
//         return '';
//     }
 
//     getBuiltInErrorMsgs(frmConfig: FormField<any> | FormSection<any>, key: string): string | null {
//         let specialMessage: string = frmConfig.errorMessages.find(em => em.errorName === key)?.txt;
//         return specialMessage ? specialMessage : null;
//     }
 
//     preSave(frmKey: FormKey) {
//         this.apiError.frmKey = null;
//     }
 
}