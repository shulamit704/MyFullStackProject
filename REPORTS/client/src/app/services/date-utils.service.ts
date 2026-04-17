import { Injectable } from '@angular/core';


@Injectable({

providedIn: 'root', // This ensures the service is available application-wide

})

export class DateUtilsService {

constructor() {}


convertToMonthValue(year: number, month: number): number {

return year * 100 + month; // Converts to YYYYMM

}


parseMonthValue(value: number): { year: number; month: number } {

const year = Math.floor(value / 100);

const month = value % 100;

return { year, month };

}

}