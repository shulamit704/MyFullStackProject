export enum FiltersType{
    multiselect="multiselect",
    yearfilter="yearfilter"
}


export enum Fieldtype{
    select='select',
    range='range'
}

export interface FormField {
    typeFildes?: Fieldtype;
    options?:any;
    formControlName?: any;
    optionLabel?: any;
    placeholder?: any;
    rangeValues?: any;
  }
