import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { PrimeNGConfig } from 'primeng/api';
import { min } from 'rxjs';
 
@Component({
  selector: 'app-range',
  templateUrl: './range.component.html',
  styleUrls: ['./range.component.css']
})
export class RangeComponent implements OnChanges {
  // step = 1;
  @Input() max: number =new Date().getFullYear() ; // ערך ברירת מחדל
  @Input() min: number = this.max-5; // ערך ברירת מחדל
  @Input() step: number = 1; // ערך ברירת מחדל
  @Input() rangetype: string = 'number'; // ערך ברירת מחדל
  @Input() selection: number[] = []; // ערך ברירת מחדל
  @Input() formControlName: string = ''; // ערך ברירת מחדל
  private isInternalChange: boolean = false;
  currentValue2: number = this.selection[0];
  currentValue3: number = this.selection[1];
  @Input() sss!: (eventType: string, event: any, fc: AbstractControl | undefined) => void;
  @Input() fc: AbstractControl | undefined;
  @Output() valueChanged = new EventEmitter<any>(); // שם חדש למניעת בלבול
  date1: Date | undefined = new Date(Date.now() + this.selection[0]);
  date2: Date | undefined = new Date(Date.now() + this.selection[1]);
  minDate: Date | undefined; // תאריך מינימום
  maxDate: Date | undefined; // תאריך מקסימום
  yearRange: string = ''; // טווח השנים עבור yearNavigator
  calendarSliderSelection: number[] = [0, 0];
  value1: number = 20;
  value2: number = 10;
  value3: number = 25;
 
  constructor(private primengConfig: PrimeNGConfig) { }
 
 
 
  ngOnInit() {
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;
    const currentYear = new Date().getFullYear();
    const lastFiveYears = [currentYear - 5, currentYear]; // טווח של 5 השנים האחרונות
    if (this.rangetype === 'calendar') {
      if (!this.minDate) this.minDate = new Date(new Date().getFullYear() - 5, 0, 1);
      if (!this.maxDate) this.maxDate = new Date(new Date().getFullYear(), 11, 31);
      this.date1 = new Date(Math.floor(this.selection[0] / 100), (this.selection[0] % 100) - 1);
      this.date2 = new Date(Math.floor(this.selection[1] / 100), (this.selection[1] % 100) - 1);
      this.calendarSliderSelection = [
        this.getMonthsOffsetFromDate(this.date1),
        this.getMonthsOffsetFromDate(this.date2)
      ];
      this.yearRange = `${this.minDate.getFullYear()}:${this.maxDate.getFullYear()}`;
    }
 
 
    this.primengConfig.setTranslation({
      firstDayOfWeek: 0,
      dayNames: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
      dayNamesShort: ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"],
      dayNamesMin: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
      monthNames: [
        "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
        "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
      ],
      monthNamesShort: [
        "ינו", "פבר", "מרץ", "אפר", "מאי", "יונ",
        "יול", "אוג", "ספט", "אוק", "נוב", "דצמ"
      ],
    });
  }
 
 
  ngOnChanges(changes: SimpleChanges): void {
    console.log("hiiiiiiiiiiiiiiiiiiii");
    if (changes['min'] || changes['max'] || changes['selection']) {
      // עדכון selection
      this.selection = [this.min, this.max];
      if (this.rangetype === 'number') {
        this.currentValue2 = this.selection[0];
        this.currentValue3 = this.selection[1];
      } else if (this.rangetype === 'calendar') {
        // עדכון minDate ו-maxDate לפי min/max בפורמט YYYYMM
        this.minDate = new Date(Math.floor(this.min / 100), (this.min % 100) - 1, 1);
        this.maxDate = new Date(Math.floor(this.max / 100), (this.max % 100) - 1, 1);
        console.log(" this.minDate", this.minDate);
        console.log("maxDate", this.maxDate);
        // עדכון date1/date2 לפי selection
        this.date1 = new Date(Math.floor(this.selection[0] / 100), (this.selection[0] % 100) - 1, 1);
        this.date2 = new Date(Math.floor(this.selection[1] / 100), (this.selection[1] % 100) - 1, 1);
        console.log("date1", this.date1);
        console.log("date2", this.date2);
 
 
        // עדכון calendarSliderSelection לפי ההיסט מהתאריך המינימלי
        this.calendarSliderSelection = [
          this.getMonthsOffsetFromDate(this.date1),
          this.getMonthsOffsetFromDate(this.date2)
        ];
 
        // עדכון yearRange
        this.yearRange = `${this.minDate.getFullYear()}:${this.maxDate.getFullYear()}`;
      }
    }
  }
 

  onNumberChange(value: any, index: number): void {
    console.log("onNumberChange called with value:", value, "and index:", index);
      if (value < this.min) {
    value = this.min;
  }
  if (value > this.max) {
    value = this.max;
  }
    if (value === null || value === undefined) {
      console.log("Value is null or undefined, setting to default value");
      value = index === 0 ? this.min : this.max;
      console.log("value after setting default:", value);
      this.currentValue2 = this.min;
      this.currentValue3 = this.max;
    }
    // if (value < this.min) value = this.min;
    // if (value > this.max) value = this.max;
 
   
    console.log("value after clamping:", value);
    console.log("curent3Value3", this.currentValue3);
   
   
    if (value>this.currentValue3) {
      console.log("Value is greater than currentValue3, setting currentValue2 to currentValue3");
    // value= this.currentValue3-0.2;
    }
    this.selection = [...this.selection];
    this.selection[index] = value;
    if (this.rangetype == 'number') {
      this.currentValue2 = this.selection[0];
      this.currentValue3 = this.selection[1];
    }
    else {
      this.date1 = new Date(this.selection[0]);
      this.date2 = new Date(this.selection[1]);
    }
    if (!this.isInternalChange) {
      this.isInternalChange = true;
      this.valueChanged.emit(this.selection);
      if (this.sss) {
        this.sss('test', this.selection, this.fc);
      }
      this.isInternalChange = false;
    }
 
  }
 
 
  onDateChange(value: Date, index: number): void {
    //     if (value === null || value === undefined ) {
    // console.log("Value is null or undefined, setting to default value");
    //   value = index === 0 ? this.min : this.max;
    //   console.log("value after setting default:", value);
    // }
    //   // המרה למספר ייחודי (לדוגמה: YYYYMM)
    if(this.date2){
    if (value> this.date2) {
      console.log("Value is greater than currentValue3, setting currentValue2 to currentValue3");
   value = this.date2 ?? new Date();
    }}
    const formattedValue = value.getFullYear() * 100 + (value.getMonth() + 1);
 
    // עדכון הערך המתאים במערך
    this.selection[index] = formattedValue;
 
    // עדכון התאריך המתאים
    if (index === 0) {
      this.date1 = value;
    } else {
      this.date2 = value;
    }
 
    // עדכון הסליידר של calendar
    if (this.rangetype === 'calendar') {
      this.calendarSliderSelection = [
        this.getMonthsOffsetFromDate(this.date1!),
        this.getMonthsOffsetFromDate(this.date2!)
      ];
    }
 
    // שליחת הערכים המעודכנים
    const defaultDate1 = this.date1 || new Date(this.minDate || Date.now());
    const defaultDate2 = this.date2 || new Date(this.maxDate || Date.now());
 
    if (!this.isInternalChange) {
      this.isInternalChange = true;
      this.valueChanged.emit([
        defaultDate1.getFullYear() * 100 + (defaultDate1.getMonth() + 1),
        defaultDate2.getFullYear() * 100 + (defaultDate2.getMonth() + 1),
      ]);
      if (this.sss) {
        this.sss('test', this.selection, this.fc);
      }
      this.isInternalChange = false;
    }
  }
 
 
  get monthsRange(): number {
    if (!this.minDate || !this.maxDate) return 0;
    return (this.maxDate.getFullYear() - this.minDate.getFullYear()) * 12 +
      (this.maxDate.getMonth() - this.minDate.getMonth());
  }
 
  getDateFromMonthsOffset(offset: number): Date {
    if (!this.minDate) return new Date();
    const date = new Date(this.minDate);
    date.setMonth(date.getMonth() + offset);
    return date;
  }
 
  getMonthsOffsetFromDate(date: Date): number {
    if (!this.minDate) return 0;
    return (date.getFullYear() - this.minDate.getFullYear()) * 12 +
      (date.getMonth() - this.minDate.getMonth());
  }
 
 
  handle(event: any): void {
    if (event.values) {
    if (event.values[0]>event.values[1]) {
      console.log("Value is greater than currentValue3, setting currentValue2 to currentValue3");
    event.values[0]= event.values[1];
    }
      if (this.rangetype === 'number') {
           if (event.values[0]>event.values[1]) {
      console.log("Value is greater than currentValue3, setting currentValue2 to currentValue3");
    event.values[0]= event.values[1]-0.2;
    }
        this.selection = event.values;
        this.currentValue2 = this.selection[0];
        this.currentValue3 = this.selection[1];
      } else if (this.rangetype === 'calendar') {
           if (event.values[0]>event.values[1]) {
      console.log("Value is greater than currentValue3, setting currentValue2 to currentValue3");
    event.values[0]= event.values[1];
    }
        const minOffset = event.values[0];
        const maxOffset = event.values[1];
        this.date1 = this.getDateFromMonthsOffset(minOffset);
        this.date2 = this.getDateFromMonthsOffset(maxOffset);
        this.selection = [
          this.date1.getFullYear() * 100 + (this.date1.getMonth() + 1),
          this.date2.getFullYear() * 100 + (this.date2.getMonth() + 1)
        ];
        this.calendarSliderSelection = [minOffset, maxOffset];
      }
      if (!this.isInternalChange) {
        this.isInternalChange = true;
        this.valueChanged.emit(this.selection);
        if (this.sss) {
          this.sss('test', this.selection, this.fc);
        }
        this.isInternalChange = false;
      }
    }
  }
preventMoreThan3Digits(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const currentValue = input.value;

  // אם יש כבר 3 ספרות והוקש עוד תו מספר – מבטל את ההקלדה
  if (currentValue.length >= 3 && /^[0-9]$/.test(event.key)) {
    event.preventDefault();
  }
}


}
 
 