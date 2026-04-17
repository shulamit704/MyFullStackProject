import { Component, OnInit } from '@angular/core';
import { Chart, enumType } from '../../../shared/models/chart';
import { FormGroup } from '@angular/forms';
import { ReportsService } from '../../../../services/reports.service';
import { FormKey, TaarifimFilters } from '../../../shared/models/app-forms.model';
import { ConfigOf, FormField, FormSection, IOption } from '../../../shared/models/dynamic-form.model';
import { DynamicFormService } from '../../../../services/dynamic-form.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-metrix',
  templateUrl: './metrix.component.html',
  styleUrl: './metrix.component.css'
})
export class MetrixComponent implements OnInit {
  public readonly formKey: FormKey = FormKey.Metrix;
  frmControls!: FormSection<ConfigOf<TaarifimFilters>>;
  dynForm$!: FormGroup;
  allData: any;
  lable: any[] = [];
  data: any;
  options: any;
  chart: Chart = {};
  subsForm!: Subscription
  years: any[] = [];
  filter: any[] = [];
  enumType = enumType;
  chartType: enumType = enumType.bar;
  currentFilterValue: string = '';
  currentFilterValue2: string = '';
  arrlabel: any[] = [];
  count: number = 1;
  selectOptions: IOption[] = [];
  radioOptions: IOption[] = [
    { key: '1', txt: 'גרף' },
    { key: '2', txt: 'עמודות' },
  ];
  groupedData: any;
  reportName: any
  ProducerName: string = 'אברהם'; 
  filterColumns: string[] = []; 
  constructor(private reportsService: ReportsService, private dfSrv: DynamicFormService) {
    this.YearChanged = this.YearChanged.bind(this);
    this.displayTypeChanged = this.displayTypeChanged.bind(this);
    this.clear = this.clear.bind(this);
    this.radioChanged = this.radioChanged.bind(this);
  }

  public ngOnInit(): void {

    this.reportsService.getMetrix().subscribe((data: Array<{ [key: string]: any; Year: number }>) => {
      if (data) {
        this.allData = data;
        console.log(this.allData);
        this.years = Array.from(
          new Set(
            this.allData.map((item: any) => {
              return item.StartDate;
            })
          )
        );
        console.log("years", this.years);
        // קיבוץ הנתונים לפי שנה
        this.groupedData = this.allData.reduce((acc: { [key: string]: any[] }, item: any) => {
          const year = new Date(item.MadadDate).getFullYear();
          if (!acc[year]) {
            acc[year] = [];
          }
          acc[year].push(item);
          return acc;
        }, {});
        console.log("groupData", this.groupedData);

        // יצירת selectOptions דינמיים
        const keys = Object.keys(this.groupedData); // כל המפתחות חוץ מ-Year
        console.log("keys", keys);
        const filteredData = data.filter(
          (item: any) => item.MadadDate !== undefined && item.MadadDate !== null
        );
        console.log("filteredData", filteredData);

        // יוצרים מזהים ייחודיים


        this.selectOptions = [
          // { key: '', txt: 'בחר שנה' },
          // { key: 'all', txt: 'כל השנים' },
          ...keys.map((year: string) => ({
            key: year,       // עכשיו key הוא השנה עצמה!
            txt: this.formatKey(year),
          })),
        ];

        console.log("Select options generated:", this.selectOptions);
        this.setFormControls()
        this.chartData()
        this.reportName = "דוח מדדים"
        this.ProducerName='יוזר נוכחי' // הגדרת שם המפיק
        this.filterColumns=['אחוז המדד', 'תאריך מדד', 'מספר צו','תעריף מדד']; // הגדרת עמודות לסינון
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

  setSubscriptions() {
    this.subsForm = this.dfSrv.dynamicForm$[this.formKey].subscribe((data: any) => {
      this.dynForm$ = data;
    });
  }
  setFormControls() {
    this.frmControls = new FormSection({
      fields: {
        submitButton: new FormField<any>({
          value: "",
          controlType: 'buttonTxt',
          label: 'איפוס',
          events: [{ name: 'click', handler: this.clear }],
        }),
        radio: new FormField<string>({
          value: '2',
          controlType: 'radio',
          options: this.radioOptions,
          label: 'בחר תצוגה',
          events: [{ name: 'change', handler: this.radioChanged }]
        }),
        year: new FormField<number | string>({
          value: 0,
          controlType: 'multiple',
          label: 'שנים',
          placeholder: 'בחר שנה',
          options: this.selectOptions,
          events: [{ name: 'selectionChange', handler: this.YearChanged }],
        }),
      },


    });
  }

  clear() {
    this.currentFilterValue = '';
    this.currentFilterValue2 = '';
    this.dynForm$.reset();
    this.dynForm$.patchValue({
      radio: '2', // ברירת מחדל היא עמודות
      year: '',
      display: enumType.line, // ברירת מחדל היא קו
      inputSwitch: false, // ברירת מחדל היא עמודות
    })
    this.chartType = enumType.bar; // ברירת מחדל היא עמודות
    this.chartData();
  }

  private formatKey(key: string): string {
    return key
      .replace(/_/g, ' ') // החלפת קווים תחתונים ברווחים
      .replace(/\b\w/g, char => char.toUpperCase()); // אות ראשונה בכל מילה באות גדולה
  }
  YearChanged(event: any) {
  const selectedValue = event?.value ?? '';
  this.chartDataByFilters({ groups: selectedValue });
  }
  radioChanged(event: Event) {
    const input = (event.target as HTMLInputElement).id;
    console.log('Selected valueA:', input);
    if (String(input) === 'radio_1') {
      console.log("1");

      this.chartType = enumType.line; // אם נבחר קו
      this.chartDataByFilters({});
    }
    else {
      console.log("2");

      this.chartType = enumType.bar; // אם נבחר עמודות
      this.chartDataByFilters({});
    }
    this.currentFilterValue = this.currentFilterValue || "";
    if (this.currentFilterValue2 !== '') {
      if (this.currentFilterValue2 === 'any') {
        // this.chartData2(this.currentFilterValue2);
        this.dynForm$.get('year')?.reset();
        this.dynForm$.patchValue({
          year: 0,
        })
      }
    }
  }
  displayTypeChanged(event: Event) {
    const selectedValue = (event as any).checked;
    console.log('Selected value:', selectedValue);
    if (selectedValue == true) {
      this.chartType = enumType.line; // אם נבחר קו
      // this.chartData(this.currentFilterValue);
    }
    else {
      this.chartType = enumType.bar; // אם נבחר עמודות
      // this.chartData(this.currentFilterValue);
    }

    // this.chartType = selectedValue as enumType;
    this.currentFilterValue = this.currentFilterValue || "";
    if (this.currentFilterValue2 !== '') {
      if (this.currentFilterValue2 === 'any') {
        // this.chartData2(this.currentFilterValue2);
        this.dynForm$.get('year')?.reset();
        this.dynForm$.patchValue({
          year: 0,
        })
      }
    }

  }

  getEnumOptions(): IOption[] {
    return Object.keys(enumType).map((key) => ({
      key: key,
      txt: enumType[key as keyof typeof enumType],
    }));
  }
  newaray: string[] = [];
  datasets: any
  filteredData: any
  lastSelectedGroups: number[] | null = null;
  lastSelectedYears: number[] | null = null;
  chartDataByFilters(filter: { years?: number[] | null, groups?: number[] | null }) {
    console.log('Selected Value: Filter', filter);
    // שמור את הערכים הקיימים אם לא התקבלו חדשים
    // const updatedYears = filter.years ?? this.lastSelectedYears;
    const updatedGroups = filter.groups ?? this.lastSelectedGroups;

    // עדכן את המשתנים הכלליים
    // this.lastSelectedYears = updatedYears;
    this.lastSelectedGroups = updatedGroups;

    // קריאה לגרף עם הסינונים המאוחדים
    this.chartData({
      // years: updatedYears ?? undefined,
      groups: updatedGroups ?? undefined
    });
  }

  chartData(filter: { groups?: number[] } = {}): void {
    const colors = ['#3b82f6', '#ff3d32', '#eab308', '#ec4899', '#22c55e'];

    const monthsLabels = this.years;
    const monthsShort = this.years.map(label => label.split('.')[1]);
    const selectedYears = filter.groups?.map(Number) ?? [];

    // כל השנים שקיימות בכלל הנתונים
    const allYearsSet = new Set<number>();
    this.allData.forEach((item: any) => {
      const year = new Date(item.MadadDate).getFullYear();
      allYearsSet.add(year);
    });
    const allYears = Array.from(allYearsSet).sort();

    // קיבוץ נתונים לפי שנה וחודש
    const dataByYearMonth = new Map<number, Map<string, number>>();
    this.allData.forEach((item: any) => {
      const date = new Date(item.MadadDate);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      if (!monthsShort.includes(month)) return;

      if (!dataByYearMonth.has(year)) {
        dataByYearMonth.set(year, new Map<string, number>());
      }
      dataByYearMonth.get(year)!.set(month, item.MadadRate);
    });
      console.log("dataByYearMonth", dataByYearMonth);

    // יצירת datasets
    const datasets = allYears.map((year, index) => {
      if (selectedYears.length > 0 && !selectedYears.includes(year)) {
        return {
          label: `${year}`,
          data: monthsShort.map(() => null),
          backgroundColor: colors[index % colors.length],
          borderColor: colors[index % colors.length],
          fill: false,
          tension: 0,
        };
      }

      const monthRates = dataByYearMonth.get(year) || new Map<string, number>();
      const data = monthsShort.map(month => monthRates.get(month) ?? null);
      console.log(`Dataset for year ${year}:`, data);

      return {
        label: `${year}`,
        data,
        backgroundColor: colors[index % colors.length],
        borderColor: colors[index % colors.length],
        fill: false,
        // tension: 0,
      };
    });
    const isMobile = window.innerWidth < 600;
    // הגדרות גרף כולל סנכרון ל־legend
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: isMobile ? 0.5 : 0.8,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
          },
          onClick: () => {
            null
           },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'חודש מדד',
            font: { size: 14, weight: 'bold' },
          },
          ticks: { font: { weight: 500 } },
          grid: { drawBorder: false },
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: 'ערך מדד',
            font: { size: 14, weight: 'bold' },
          },
          ticks: { stepSize: 1 },
          grid: { drawBorder: false },
        },
      },
    };

    // בניית הגרף
    this.data = {
      labels: monthsLabels,
      datasets,
    };

    this.chart = {
      type: this.chartType,
      data: this.data,
      options: this.options,
    };

    console.log('Chart Data:', this.chart);
  }

mapHeaders(data: any[]): any[] {
  console.log("mapHeaders data", data);
  
  if (data && data.length > 0) {
      return data.map((item: any) => ({
          'מספר צו': item.MadadNo,
          'תאריך מדד': item.MadadDate,
          'אחוז המדד': item.MadadRate,
          'תעריף מדד': item.PeriodId,
      }));
  }
  return []; // החזרת מערך ריק כאשר data הוא undefined או ריק
}




}



