
export enum FormKey{
    DecisionsAmount = "DecisionsAmount",
    FuelRates="FuelRates",
   Metrix="metrix"
 
}
// interface DecisionsAmount {
//     mySelectField: string;
//     anotherField: number;
// }
export interface TaarifimFilters {
    fuelGroup?:  number | string | null,
    year?:number|string,
    display?:  string ,
    submitButton?: string,
    allYear?: number | string,
    inputSwitch?: boolean,
    radio?: string,
}
// export interface PtorDecision {
//     fuelGroup?:  number|string,
//      year?:number, 
//     precent?: number,
//     clear?:number|string,
//     submitButton?: string,
//     calander?: string,

// }

export interface PtorDecision {
    fuelGroup?: number | string;
    year?: number; // שינוי ל- number[]
    precent?: number;
    clear?: number | string;
    submitButton?: string;
    calander?: number[]; // שינוי ל- number[]
    ptorfuelGroup?: number | string;
    basefuelGroup?: number | string;

}