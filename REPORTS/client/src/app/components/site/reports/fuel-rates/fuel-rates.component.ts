import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { min, Subscription } from 'rxjs';
import { Chart, enumType } from '../../../shared/models/chart';
import { ReportsService } from '../../../../services/reports.service';
import { FormKey, TaarifimFilters } from '../../../shared/models/app-forms.model';
import { ConfigOf, FormField, FormSection, IOption } from '../../../shared/models/dynamic-form.model';
import { DynamicFormService } from '../../../../services/dynamic-form.service';
@Component({
  selector: 'app-fuel-rates',
  templateUrl: './fuel-rates.component.html',
  styleUrl: './fuel-rates.component.css'
})
export class FuelRatesComponent implements OnInit {
 
  public readonly formKey: FormKey = FormKey.FuelRates;
  frmControls!: FormSection<ConfigOf<TaarifimFilters>>;
  dynForm$!: FormGroup;
  allData: any;
  data: any;
  options: any;
  chart: Chart = {};
  subsForm!: Subscription
  years: any[] = [];
  chartType: enumType = enumType.bar;
  currentFilterValue: string = '';
  currentFilterValue2: any = '';
  minYear = 2020;
  maxYear = 2025;
    reportName: any
  ProducerName: string = 'אברהם'; // שם המפיק ברירת מחדל
  filterColumns: string[] = []; // שמות העמודות לסינון
  selectOptions: IOption[] = [];
  radioOptions: IOption[] = [
    { key: '1', txt: 'גרף' },
    { key: '2', txt: 'עמודות' },
  ]
 
  constructor(private reportsService: ReportsService, private dfSrv: DynamicFormService) {
    this.fuelGroupTypeChanged = this.fuelGroupTypeChanged.bind(this);
    this.rangeChanged = this.rangeChanged.bind(this);
    this.clear = this.clear.bind(this);
    this.radioChanged = this.radioChanged.bind(this);
  }
 
  public ngOnInit(): void {
    this.reportsService.getfualRates().subscribe((data: Array<{ [key: string]: any; Year: number }>) => {
      if (data) {
        console.log(data);
        this.allData = data;
        this.buildLabels();
        this.buildOptions();
        this.setFormControls();
        this.chartData();
        this.reportName='דו"ח תעריפי דלק' // הגדרת שם הדו"ח
         this.ProducerName='יוזר נוכחי' // הגדרת שם המפיק
        this.filterColumns=['מספר צו', 'קבוצת דלק בסיס','קבוצת דלק בפטור']
      } else {
        console.error('No data received from the server');
      }
    }, (error) => {
      console.error('Error fetching data from the server', error);
    });
  }
  private formatKey(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
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
          value: "",
          controlType: 'buttonTxt',
          label: 'איפוס',
          events: [{ name: 'click', handler: this.clear }],
        }),
        radio: new FormField<string>({
          value: '2',
          controlType: 'radio',
          options: this.radioOptions,
          // label: 'בחר תצוגה',
          events: [{ name: 'change', handler: this.radioChanged }]
        }),
        fuelGroup: new FormField< number|null>({
          value: null,
          label: 'שם קבוצת דלק',
          controlType: 'multiple',
          placeholder: 'בחר קבוצת דלק',
          options: this.selectOptions,
          events: [{ name: 'selectionChange', handler: this.fuelGroupTypeChanged }],
        }),
        year: new FormField<number | string>({
          value: '',
          controlType: 'range',
          label: 'שנה',
          rangetype: 'number',
          min: this.minYear,
          max: this.maxYear,
          events: [{ name: 'change', handler: this.rangeChanged }],
        }),
      },
    });
  }
  buildLabels() {
    const arrlabel: any[] = [];
    const max = new Date().getFullYear();
    const min = max - 5;
    for (let i = min; i <= max; i++) {
      arrlabel.push(i);
    }
    this.years = arrlabel;
    console.log(this.years);
  }
 
  buildOptions() {
    const filteredData = this.allData.filter(
      (item: any) => item.reason && item.TblFugID !== undefined && item.TblFugID !== null
    );
    const fugMap = new Map<number, string>();
    for (const item of filteredData) {
      if (!fugMap.has(item.TblFugID)) {
        fugMap.set(item.TblFugID, item.reason);
      }
    }
 
    this.selectOptions = [
      ...Array.from(fugMap.entries()).map(([key, value]) => ({
        key,
        txt: this.formatKey(value),
      })),
    ];
    console.log("selectedOption", this.selectOptions);
  }
 
  setSubscriptions() {
    this.subsForm = this.dfSrv.dynamicForm$[this.formKey].subscribe((data: any) => {
      this.dynForm$ = data;
    });
  }
  radioChanged(event: Event) {
    const input = (event.target as HTMLInputElement).id;
    console.log('Selected valueA:', input);
    this.chartType = String(input) === 'radio_1' ? enumType.line : enumType.bar;
    this.chartDataByFilters({});
  }
  fuelGroupTypeChanged(event: any) {
    const selectedValue = event?.value ?? '';
    console.log('Selected value:', selectedValue);
    this.currentFilterValue = selectedValue;
    this.chartDataByFilters({ groups: selectedValue });
  }
 
  rangeChanged = (event: any) => {
    const selectedValue = event ?? '';
    console.log('Selected value:Rang', selectedValue);
    this.chartDataByFilters({ years: selectedValue });
  };
 
  getEnumOptions(): IOption[] {
    return Object.keys(enumType).map((key) => ({
      key: key,
      txt: enumType[key as keyof typeof enumType],
    }));
  }
  clear() {
    this.currentFilterValue = '';
    this.dynForm$.reset();
    this.dynForm$.patchValue({
      radio: '2',
      year: '',
      inputSwitch: false,
    })
    this.chartType = enumType.bar
    this.setFormControls();
    this.chartData();
  }
  newaray: string[] = [];
  datasets: any
  lastSelectedGroups: number[] | null = null;
  lastSelectedYears: number[] | null = null;
 
  chartDataByFilters(filter: { years?: number[] | null, groups?: number[] | null }) {
    console.log('Selected Value: Filter', filter);
    // שמור את הערכים הקיימים אם לא התקבלו חדשים
    const updatedYears = filter.years ?? this.lastSelectedYears;
    const updatedGroups = filter.groups ?? this.lastSelectedGroups;
 
    // עדכן את המשתנים הכלליים
    this.lastSelectedYears = updatedYears;
    this.lastSelectedGroups = updatedGroups;
 
    // קריאה לגרף עם הסינונים המאוחדים
    this.chartData({
      years: updatedYears ?? undefined,
      groups: updatedGroups ?? undefined
    });
  }
 
  chartData(filter: { groups?: number[], years?: number[] } = {}): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
 
    const colors = [
      documentStyle.getPropertyValue('--blue-500') || '#3b82f6',
      documentStyle.getPropertyValue('--red-500') || '#ff3d32',
      documentStyle.getPropertyValue('--yellow-500') || '#eab308',
      documentStyle.getPropertyValue('--pink-500') || '#ec4899',
      documentStyle.getPropertyValue('--green-500') || '#22c55e',
      documentStyle.getPropertyValue('--purple-500') || '#AB47BC',
    ];
 
    this.lastSelectedGroups = filter.groups ?? null;
    this.lastSelectedYears = filter.years?.length === 2
      ? [Number(filter.years[0]), Number(filter.years[1])]
      : null;
 
    const expandedData = this.allData.flatMap((item: any) => {
      const fromYear = Number(item.FromDate);
      const toYear = Number(item.ToDate);
      if (isNaN(fromYear) || isNaN(toYear)) return [];
      return Array.from({ length: toYear - fromYear + 1 }, (_, i) => ({
        year: fromYear + i,
        rate: item.rate,
        TblFugID: item.TblFugID,
        reason: item.reason,
      }));
    });
 
    const groupedByFug: { [key: number]: { [year: number]: number } } = {};
    for (const item of expandedData) {
      groupedByFug[item.TblFugID] ||= {};
      groupedByFug[item.TblFugID][item.year] = item.rate;
    }
 
    const currentYear = new Date().getFullYear();
    const defaultRange = [currentYear - 5, currentYear];
    const [startYear, endYear] = this.lastSelectedYears ?? defaultRange;
    const labels = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
 
    const selectedGroupIds = this.lastSelectedGroups ?? [];
    const datasets = Object.entries(groupedByFug).map(([fugIdStr, yearMap], index) => {
      const TblFugID = Number(fugIdStr);
      const color = colors[index % colors.length];
      const availableYears = Object.keys(yearMap).map(Number);
      const [minY, maxY] = [Math.min(...availableYears), Math.max(...availableYears)];
      let lastRate: number | null = null;
 
      const fullData = labels.map((year) => {
        if (year >= minY && year <= maxY) {
          if (yearMap[year] != null) lastRate = yearMap[year];
          return lastRate;
        }
        return null;
      });
 
      const label = this.allData.find((item: any) => item.TblFugID === TblFugID)?.reason ?? `קבוצה ${TblFugID}`;
 
      const isSelected = selectedGroupIds.length === 0 || selectedGroupIds.includes(TblFugID);
 
      return {
        TblFugID,
        label,
        data: isSelected ? fullData : labels.map(() => null),
        backgroundColor: color,
        borderColor: color,
        fill: false,
        // tension: 0,
        hidden: false,
      };
    });
 
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            color: textColor,
            usePointStyle: true,
            pointStyle: 'circle',
          },
          onClick: () => null, // אפשר לאפשר לחיצה אם תרצה
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'שנים',
            color: textColorSecondary,
            font: { size: 14, weight: 'bold' },
          },
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { color: surfaceBorder, drawBorder: false },
        },
        y: {
          title: {
            display: true,
            text: 'תעריף הדלק',
            color: textColorSecondary,
            font: { size: 14, weight: 'bold' },
          },
          ticks: { stepSize: 1, color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: false },
        },
      },
    };
 
    this.data = { labels, datasets };
    this.chart = {
      type: this.chartType,
      data: this.data,
      options: this.options,
    };
 
    console.log('Chart Data:', this.chart);
  }
 
 
mapHeaders(data: any[]): any[] {
  if (data && data.length > 0) {
    // פונקציה לעיצוב תאריך
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}-${year}`;
    };
    return data.map((item: any) => ({
      'מספר צו': item.FuelGroupNo,
          'תאור הקבוצה  ': item.reason,
 
          'תאריך התחלה': formatDate(item.FromDate),
      'תאריך סיום': formatDate(item.ToDate),
      'תעריף ': item.rate
    }));
  }
  return [];
}
 
}
 
 