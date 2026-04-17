import { Component, inject, Input, OnInit, SimpleChanges, Type } from '@angular/core';
import { Chart, enumType } from '../../../shared/models/chart';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReportsService } from '../../../../services/reports.service';
import { FormKey, TaarifimFilters } from '../../../shared/models/app-forms.model';
import { ConfigOf, FormField, FormSection, IOption } from '../../../shared/models/dynamic-form.model';
import { Router } from '@angular/router';
import { DynamicFormService } from '../../../../services/dynamic-form.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'decisions-amount',
  templateUrl: './decisions-amount.component.html',
  styleUrl: './decisions-amount.component.css'
})

export class DecisionsAmountComponent implements OnInit {

  public readonly formKey: FormKey = FormKey.DecisionsAmount;
  frmControls!: FormSection<ConfigOf<TaarifimFilters>>;
  dynForm$!: FormGroup;
  allData: any;
  lable: any[] = [];
  data: any;
  options: any;
  chart: Chart = {};
  datasets2?: any[];
  id: number = 0;
  subsForm!: Subscription
  filteredData: any
  fileName: any
  flag: boolean = false
  chartType: enumType = enumType.bar; // Default type is bar chart
  enumType = enumType; // Make enumType accessible in the template
  headers: { field: string; header: string }[] = [];
  desicisionType: string = '';
  rangeChange: any = []
  selectOptions: IOption[] = []
  newaray: any[] = [];
  reportName: any
  radioOptions: IOption[] = [
    { key: '1', txt: 'גרף' },
    { key: '2', txt: 'עמודות' },
  ]
  constructor(private reportsService: ReportsService, private fb: FormBuilder, private dfSrv: DynamicFormService, private router: Router) {
    this.decisionTypeChanged = this.decisionTypeChanged.bind(this);
    this.rangeChanged = this.rangeChanged.bind(this);
    this.displayTypeChanged = this.displayTypeChanged.bind(this);
    this.clear = this.clear.bind(this);
    this.radioChanged = this.radioChanged.bind(this);
  }

  public ngOnInit(): void {

    this.reportsService.get2().subscribe((data) => {
      if (data) {
        this.allData = data;
        console.log("Data received from server:", this.allData);

        // יצירת filter ו-lable
        this.filteredData = [...this.allData];

        const currentYear = new Date().getFullYear();
        this.lable = this.allData
          .filter((item: any) => item.Year >= currentYear - 5) // סינון רק לשנים מה-5 האחרונות
          .map((item: any) => item.Year);

        // יצירת selectOptions דינמיים
        const keys = Object.keys(this.allData[0]).filter(key => key !== 'Year'); // כל המפתחות חוץ מ-Year
        this.selectOptions = [
          ...keys.map((key) => ({
            key: key, // המפתח יהיה שם המפתח המקורי
            txt: this.formatKey(key), // עיצוב שם המפתח להצגה
          }))
        ];
        console.log("Select options generated:", this.selectOptions);

        // קריאה ל-setFormControls כדי לעדכן את הטופס
        this.setFormControls();

        // עדכון הגרף
        this.chartData();
      } else {
        console.error('No data received from the server');
      }
    }, (error) => {
      console.error('Error fetching data from the server', error);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.setFormControls();

      this.dfSrv.createForm(this.formKey, this.frmControls);

      this.setSubscriptions();
    }, 0);
  }


  setFormControls() {
    this.frmControls = new FormSection({
      fields: {
        submitButton: new FormField<any>({
          value: "", // יש להגדיר את value כ-undefined
          controlType: 'buttonTxt', // סוג הכפתור
          label: 'נקה סינון', // טקסט הכפתו
          events: [{ name: 'click', handler: this.clear }], // אירוע לחיצה
        }),
        radio: new FormField<string>({
          value: '2',
          controlType: 'radio',
          options: this.radioOptions,
          label: 'בחר תצוגה',
          events: [{ name: 'change', handler: this.radioChanged }]
        }),
        // fuelGroup: new FormField<number | string>({
        //   value: "",
        //   controlType: 'select',
        //   label: 'סוג צו',
        //   placeholder: 'בחר סוג צו',
        //   options: this.selectOptions,
        //   events: [{ name: 'change', handler: this.decisionTypeChanged }],
        // }),
        fuelGroup: new FormField<number | string>({
          value: 0,
          controlType: 'multiple',
          label: 'סוג צו',
          placeholder: 'בחר סוג צו',
          options: this.selectOptions,
          events: [{ name: 'selectionChange', handler: this.decisionTypeChanged }],
        }),

        year: new FormField<any>({
          value: 1,
          controlType: 'range',
          label: 'שנה',
          min: 2020,
          max: new Date().getFullYear(),
          step: 1,
          events: [{ name: 'change', handler: this.rangeChanged }],
        }),
      }
    })
  }

  // פונקציה שמחזירה את כל האפשרויות של enumType
  getEnumOptions(): IOption[] {
    const options = Object.keys(enumType).map((key) => ({
      key: key,
      txt: enumType[key as keyof typeof enumType],
    }));

    return [...options];
  }

  setSubscriptions() {
    this.subsForm = this.dfSrv.dynamicForm$[this.formKey].subscribe((data: any) => {
      this.dynForm$ = data;
    });
  }


  //איפוס סננים ונתונים
  clear() {
    console.log('Clearing all filters and resetting controls...');

    if (!this.allData) {
      console.error('allData is not defined or not an array.');
      return;
    }

    // איפוס כל הפקדים לערכי ברירת המחדל
    if (this.dynForm$) {
      this.dynForm$.reset();
      this.dynForm$.patchValue({
        radio: '2',
        fuelGroup: '',
        year: 1,
      })
    }

    const currentYear = new Date().getFullYear();
    // סנן רק את השנים הרצויות
    this.filteredData = this.allData.filter((item: any) => item.Year >= currentYear - 5);

    // עדכן את הלייבלים בהתאם לנתונים המסוננים
    this.lable = this.filteredData.map((item: any) => item.Year);

    this.chartType = enumType.bar;
    this.desicisionType = ''
    this.rangeChange = []

    // קריאה ל-setFormControls כדי להחזיר את המצב לערכי ברירת המחדל
    this.setFormControls();

    // עדכון הנתונים בגרף
    this.chartData();

    console.log('All filters have been cleared.');
  }


  radioChanged(event: Event) {
    console.log('Radio changed:', event);
    const input = (event.target as HTMLInputElement).id;
    console.log('Selected valueA:', input);
    this.chartType = String(input) === 'radio_1' ? enumType.line : enumType.bar;
    this.checkFilter();
  }



  // פונקציה שמבצעת פעולה כאשר נבחר ערך בטווח
  rangeChanged(event: any) {
    console.log('Selected value:', event);
    this.rangeChange = event; // שמירת הערך הנבחר בטווח
    this.checkFilter()
  }

  //  בכל שינוי
  decisionTypeChanged(event: any) {
  const selectedValue = event?.value ?? '';
    console.log('Selected value:', selectedValue);
    this.desicisionType = selectedValue
    console.log('Decision type changed:', this.desicisionType);
    
    // this.currentFilterValue = selectedValue;
    this.checkFilter()
  }


  //בכל שינוי
  displayTypeChanged(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log('Selected value:', selectedValue);
    this.chartType = selectedValue as enumType;
    console.log(this.chartType);
    this.checkFilter()

  }

  // פונקציה לעיצוב שמות המפתחות
  private formatKey(key: string): string {
    return key
      .replace(/_/g, ' ') // החלפת קווים תחתונים ברווחים
      .replace(/\b\w/g, char => char.toUpperCase()); // אות ראשונה בכל מילה באות גדולה
  }




  checkFilter() {
    console.log("chart", this.chartType);

    this.filteredData = this.allData
    const keys = Object.keys(this.filteredData[0]).filter(key => key !== 'Year');

    // סינון לפי טווח שנים
    if (this.rangeChange.length === 2) {
      // ודא שיש נתונים
      if (!this.filteredData || this.filteredData.length === 0) {
        this.filteredData = [];
        return;
      }
      const currentYear = new Date().getFullYear();
      //   // יצירת טווח שנים מהערכים שנבחרו
      const minYear = Math.max(Number(this.rangeChange[0]), currentYear - 5); // לוודא שהשנה המינימלית לא נמוכה מ-5 השנים האחרונות
      const maxYear = Number(this.rangeChange[1]);

      this.newaray = [];
      for (let i = minYear; i <= maxYear; i++) {
        this.newaray.push(i);
      }

      //   // עדכון ה-labels לפי טווח השנים
      this.lable = this.newaray;
      console.log("Generated labels for range:", this.lable);
      // סינון הנתונים לפי טווח השנים
      this.filteredData = this.newaray.map((year) => {
        const item = this.filteredData.find((data: any) => data.Year === year);
        if (item) {
          return item; // אם יש נתונים לשנה, מחזירים אותם
        } else {
          // אם אין נתונים לשנה, יוצרים אובייקט ריק עם ערכים null
          const emptyItem: any = { Year: year };
          keys.forEach((key) => {
            emptyItem[key] = null;
          });
          return emptyItem;
        }
      });
    }

    // סינון לפי ערך שנבחר ב-select
    // const keys = Object.keys(this.filteredData[0]).filter(key => key !== 'Year');
    if (this.desicisionType && this.desicisionType.length > 0) {
  this.filteredData = this.filteredData.map((item: any) => {
    const filteredItem: any = {};
    keys.forEach((key: any) => {
      filteredItem[key] = this.desicisionType.includes(key) ? item[key] : 0;
    });
    return filteredItem;
  });
  console.log("Filtered data:", this.filteredData);
}
    this.chartData()
  }
  chartData() {
    if (!this.allData || this.allData.length === 0) {
      console.error('No data available for chart generation.');
      return;
    }
    if (!this.filteredData || this.filteredData.length === 0) {
      this.filteredData = this.allData
    }
    const keys = Object.keys(this.filteredData[0]).filter(key => key !== 'Year');
    const filtered = this.filteredData.filter((item: any) =>
      keys.some(key => item[key] !== 0 && item[key] !== null && item[key] !== undefined)
    );

    // עדכון הלייבלים בהתאם לשנים שנשארו
    // this.lable = filtered.map((item: any) => item.Year);

    // יצירת datasets דינמיים
    const colors = [
      '#5DADE2', '#E74C3C', '#F4D03F', '#F78FB3', '#58D68D', '#9B59B6', '#1ABC9C'
    ];

    this.data = {
      labels: this.lable,
      datasets: keys.map((key, index) => ({
        label: this.formatKey(key), // שם המפתח
        backgroundColor: this.chartType === 'line' ? colors[index % colors.length] + '33' : colors[index % colors.length], // צבע רקע שקוף עבור line
        borderColor: colors[index % colors.length], // צבע הקו עבור line
        pointBackgroundColor: colors[index % colors.length], // צבע הנקודות
        pointBorderColor: colors[index % colors.length], // צבע גבול הנקודות
        fill: this.chartType !== 'line', // מילוי רק עבור גרפים שאינם line
        data: filtered.map((item: any) =>
          (item[key] !== 0 && item[key] !== null && item[key] !== undefined) ? item[key] : null
        ),// הצגת הנתונים המסונכרנים עם ה-labels
      })),
    };

    // הגדרות הגרף
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const isMobile = window.innerWidth < 600; // אפשר לשנות את הסף לפי הצורך
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: isMobile ? 0.5 : 0.8, // במובייל 0.5, בדסקטופ 0.8
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: textColor,
            usePointStyle: true,
            pointStyle: 'circle'
          },
          onClick: () => null,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'שנים',
            color: textColorSecondary,
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y: {
          title: {
            display: true,
            text: 'כמות צווים',
            color: textColorSecondary,
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          beginAtZero: true, // הוסף שורה זו

          ticks: {
            stepSize: 1,
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.chart = {
      type: this.chartType,
      data: this.data,
      options: this.options,
    };

    console.log("Chart data:", this.data);
  }



  //מחזיר את שם הדוח+תאריך ושעה
  getFileName(): string {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${this.reportName}_${date}_${hours}:${minutes}.xlsx`; // הוסיפי את הסיומת כאן
  }

  mapHeaders(data: any[]): any[] {
    if (!data || data.length === 0 || !this.lable || this.lable.length === 0) {
      return [];
    }
    // מצא את כל המפתחות חוץ מ-Year
    const keys = Object.keys(data[0]).filter(key => key !== 'Year');
    // עבור כל מפתח, צור אובייקט שבו:
    // key: שם המפתח, וכל עמודה: ערך עבור שנה מסוימת
    return keys.map((key) => {
      const row: any = { 'סוג צו': this.formatKey(key) };
      this.lable.forEach((year: any) => {
        // מצא את האובייקט המתאים לשנה הזו
        const item = data.find((d: any) => d.Year === year);
        row[year] = item ? item[key] : null;
      });
      return row;
    });
  }
}



