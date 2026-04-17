import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
// import { LastPath } from '../../../src/components/shared/models/';
// import { ConfigOf, ControlsOf, FormField, FormSection } from '../../../src/components/shared/models/dynamic-form.model';
 
import { Dialog } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
 
export enum ModeWorking {
    READONLY,
    UPDATE,
    INSERT
}
 
@Injectable({
    providedIn: 'root'
})
export class SystemService {
   
    _hasChanges: boolean;
   
    /** דגל שמראה אם יש שינויים במסך  */
    public get HasChanges() : boolean {
        return this._hasChanges;
    }
   
    public set HasChanges(v : boolean) {
        this._hasChanges = v;
    }
 
       
    private _parentMenu: string = "";
    /** שם בתוך התפריט של עמוד האבא עבור הדף הנוכחי */
    public get ParentMenu(): string {
        return this._parentMenu;
    }
    public set ParentMenu(value: string) {
        setTimeout(() => {
            this._parentMenu = value;
        }, 0);
    }
 
    constructor(private confirmationService: ConfirmationService,
                private router: Router,) {
        this._hasChanges = false;
    }
 
 
    navigate(url: string) {
        // clear out the old link, and refresh the page in case its the same page and just the
        // parameter is different.
        this.router.navigateByUrl('clear', { skipLocationChange: true }).then(() =>
            this.router.navigate([url], { skipLocationChange: (location.pathname.indexOf('clear') == -1) }));
    }
 
}
 
 