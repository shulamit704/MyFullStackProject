import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../../../services/reports.service';
import { Chart, enumType } from '../../../shared/models/chart';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormKey, PtorDecision } from '../../../shared/models/app-forms.model';
import { ConfigOf, FormField, FormSection, IOption } from '../../../shared/models/dynamic-form.model';
import { DynamicFormService } from '../../../../services/dynamic-form.service';

@Component({
  selector: 'app-ptor-decision',
  templateUrl: './ptor-decision.component.html',
  styleUrl: './ptor-decision.component.css'
})

export class PtorDecisionComponent implements OnInit {
  public readonly formKey: FormKey = FormKey.DecisionsAmount;
  frmControls!: FormSection<ConfigOf<PtorDecision>>;
  dynForm$!: FormGroup;
  lable: any[] = [];
  data: any;
  allData: any;
  options: any;
  chart: Chart = {};
  subsForm!: Subscription
  newaray: number[] = []; // Declare newaray as a property of the class
  filter: { FuelGroup1: number; FuelGroup2: number; FuelGroup3: number; FuelGroup4: number; Total: number }[] = []; // Declare filter
  chartType: enumType = enumType.line;
  filteredData: any;
  datasets: any
  selectOptions: IOption[] = []
  selectOptionsPtor: IOption[] = []
  groupLabel: any
  selectedRange: any[] = [];          // e.g. [2021, 2025] or ["01-2021", "12-2025"]
  selectedFuelGroup: string = '';    // currently selected BaseFuelGroupName
  percentFilter2: [number, number] | null = [1, 100];
  selectedRangecalander: any[] = [];
  base: any
  ptor: any
  labelColorMap: any;
  reportName: any
  ProducerName: string = 'אברהם'; 
  filterColumns: string[] = []; 
  
  constructor(private reportsService: ReportsService, private fb: FormBuilder, private dfSrv: DynamicFormService, private router: Router) {
    this.basefuelGroupChanged = this.basefuelGroupChanged.bind(this);
    this.rangeChanged = this.rangeChanged.bind(this);
    this.precentChanged = this.precentChanged.bind(this);
    this.clear = this.clear.bind(this);
    this.ptorfuelGroupChanged = this.ptorfuelGroupChanged.bind(this);
    this.calanderChanged = this.calanderChanged.bind(this)
  }

  ngOnInit(): void {
    this.reportsService.getPtorDecision().subscribe((data) => {
      if (data) {
        this.allData = data;
        console.log(this.allData);
        this.reportName = "דוח צווי הפטור"
        const fromDate = new Date(Math.min(...this.allData.map((item: any) => new Date(item.FromDate).getTime())));
        const toDate = new Date(Math.max(...this.allData.map((item: any) => new Date(item.ToDate).getTime())));
        const labels: string[] = [];
        console.log('FromDate:', fromDate);
        console.log('ToDate:', toDate);

        let currentDate = new Date(fromDate);
        while (currentDate <= toDate) {
          const year = currentDate.getFullYear();
          const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // מוסיף אפס מוביל לחודשים 1-9
          labels.push(`${month}-${year}`); // פורמט "שנה-חודש"
          currentDate.setMonth(currentDate.getMonth() + 1); // מעבר לחודש הבא
        }
        this.lable = labels;
        console.log('Labels:', this.lable);

        const uniqueGroups = [...new Set(this.allData.map((item: any) => item.BaseFuelGroupName
        ))];

        this.selectOptions = [
          { key: '', txt: 'בחר דלק בסיס  ' },
          ...uniqueGroups.map(groupName => ({ key: groupName as string, txt: groupName as string }))
        ];
        const uniqueGroupsptor = [...new Set(this.allData.map((item: any) => item.PtorFuelGroupName
        ))];
        this.selectOptionsPtor = [
          { key: '', txt: 'בחר דלק בפטור  ' },
          ...uniqueGroupsptor.map(groupName => ({ key: groupName as string, txt: groupName as string }))
        ];

        console.log('Select options:', this.selectOptions);
        this.ProducerName='יוזר נוכחי' 
        this.filterColumns=['מספר צו', 'קבוצת דלק בסיס','קבוצת דלק בפטור']
        this.setFormControls();
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
  // חישוב ערכי מינימום ומקסימום דינמיים לאחוזים
  const percentValues = this.allData?.map((item: any) => item.PercentPartialPtor) ?? [1, 100];
  const minPercent = Math.min(...percentValues);
  const maxPercent = Math.max(...percentValues);

  // חישוב ערכי מינימום ומקסימום דינמיים לתאריכים
  const fromDates = this.allData?.map((item: any) => new Date(item.FromDate)) ?? [new Date(2020, 0)];
  const toDates = this.allData?.map((item: any) => new Date(item.ToDate)) ?? [new Date(2025, 11)];
  const minDate = new Date(Math.min(...fromDates.map((d:any) => d.getTime())));
  const maxDate = new Date(Math.max(...toDates.map((d:any) => d.getTime())));
  const minCal = minDate.getFullYear() * 100 + (minDate.getMonth() + 1);
  const maxCal = maxDate.getFullYear() * 100 + (maxDate.getMonth() + 1);


    this.frmControls = new FormSection({
      fields: {
        submitButton: new FormField<any>({
          value: "", 
          controlType: 'buttonTxt',
          label: 'נקה סינון', 
          events: [{ name: 'click', handler: this.clear }],
        }),
        basefuelGroup: new FormField<number | string>({
          value: '',
          controlType: 'select',
          label: 'בחר דלק בסיס',
          placeholder: 'בחר דלק בסיס',
          options: this.selectOptions,
          events: [{ name: 'change', handler: this.basefuelGroupChanged }],
        }),
        ptorfuelGroup: new FormField<number | string>({
          value: '',
          controlType: 'select',
          label: 'בחר דלק בפטור',
          placeholder: 'בחר דלק בפטור',
          options: this.selectOptionsPtor,
          events: [{ name: 'change', handler: this.ptorfuelGroupChanged }],
        }),
        calander: new FormField<any>({
          value:  [202001, 202512],
          controlType: 'range',
          label: 'בחר טווח פטור',
          rangetype: 'calendar',
          step: 1,
          min:minCal,
          max: maxCal,
          events: [{ name: 'change', handler: this.calanderChanged }],
        }),
        precent: new FormField<any>({
          value: '', 
          controlType: 'range',
          label: 'בחר אחוזים',
          step: 1,
          min: 10,
          max: 80,
          events: [{ name: 'change', handler: this.precentChanged }],
        }),
      },
    });
  }
  setSubscriptions() {
    this.subsForm = this.dfSrv.dynamicForm$[this.formKey].subscribe((data: any) => {
      this.dynForm$ = data;
    });
  }


  calanderChanged(event: any) {
    const calendarValues = event.map((val: any) => {
      const year = Math.floor(val / 100);
      const month = val % 100;
      return `${month.toString().padStart(2, '0')}/${year}`;
    });

    console.log('Selected value calander:', calendarValues)
    this.selectedRangecalander = calendarValues; // שמור את כל הערכים במערך
    console.log(this.selectedRangecalander); // עכשיו זה ידפיס את המערך המלא

    this.checkFilter();
  }

  basefuelGroupChanged(event: Event) {
    this.ptor = ''
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log('Selected BaseFuelGroupName:', selectedValue);

    // אם לא נבחר ערך ב"דלק בסיס", הצג את כל האפשרויות של דלקי הבסיס
    if (!selectedValue) {
      const uniqueGroupsBase = [...new Set(this.allData.map((item: any) => item.BaseFuelGroupName))];
      this.selectOptions = [
        { key: '', txt: 'בחר דלק בסיס  ' },
        ...uniqueGroupsBase.map(groupName => ({ key: groupName as string, txt: groupName as string }))
      ];

      // עדכון האפשרויות בטופס
      if (this.frmControls.fields.basefuelGroup) {
        this.frmControls.fields.basefuelGroup.options = [...this.selectOptions];
      }

      // איפוס הרשימה של דלקי הפטור
      const uniqueGroupsPtor = [...new Set(this.allData.map((item: any) => item.PtorFuelGroupName))];
      this.selectOptionsPtor = [
        { key: '', txt: 'בחר דלק בפטור  ' },
        ...uniqueGroupsPtor.map(groupName => ({ key: groupName as string, txt: groupName as string }))
      ];

      if (this.frmControls.fields.ptorfuelGroup) {
        this.frmControls.fields.ptorfuelGroup.options = [...this.selectOptionsPtor];
      }
      this.base = ''
      if (this.frmControls.fields.basefuelGroup) {
        this.frmControls.fields.basefuelGroup.placeholder = 'בחר דלק בסיס';
      }
      this.checkFilter()

      return;
    }
    // עדכון אפשרויות הסלקט של הפטורים בהתאם לבחירה ב"דלק בסיס"
    const filteredPtorGroups = this.allData
      .filter((item: any) => item.BaseFuelGroupName === selectedValue)
      .map((item: any) => item.PtorFuelGroupName);

    const uniquePtorGroups = [...new Set(filteredPtorGroups)];
    this.selectOptionsPtor = [
      { key: '', txt: 'בחר דלק בפטור  ' },
      ...uniquePtorGroups.map(groupName => ({ key: groupName as string, txt: groupName as string }))
    ];

    // עדכון האפשרויות בטופס
    if (this.frmControls.fields.ptorfuelGroup) {
      this.frmControls.fields.ptorfuelGroup.options = [...this.selectOptionsPtor];
      if (filteredPtorGroups.length == 1) {
        this.frmControls.fields.ptorfuelGroup.placeholder = filteredPtorGroups;
      }
      else {
        this.frmControls.fields.ptorfuelGroup.placeholder = 'בחר דלק בפטור  ';
      }
    }
    this.base = selectedValue
    // עדכון הדיאגרמה
    this.checkFilter()
  }



  ptorfuelGroupChanged(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    console.log('Selected PtorFuelGroupName:', selectedValue);
    const filteredBaseGroups = this.allData
      .filter((item: any) => item.PtorFuelGroupName === selectedValue)
      .map((item: any) => item.BaseFuelGroupName);
    // עדכון האפשרויות בטופס
    if (this.frmControls.fields.basefuelGroup) {
      this.frmControls.fields.basefuelGroup.placeholder = filteredBaseGroups;
    }
    this.ptor = selectedValue
    this.checkFilter()
  }
  // פונקציה שמבצעת פעולה כאשר נבחר ערך בטווח
  rangeChanged(event: any) {
    console.log('Selected value:', event);
    this.selectedRange = event
    const a = event.map((dateStr: any, index: number) => {
      console.log("lll", index);
      const parts = index == 0 ? new Date(dateStr, 0) : new Date(dateStr, 11);
      return parts
    }) // מחזיר את השנה
    // עדכון האפשרויות בטופס
    if (this.frmControls.fields.calander) {
      this.frmControls.fields.calander.min = a[0];
      this.frmControls.fields.calander.max = a[1];
    }
    this.checkFilter();
  }




  // משתנה לאחסון סינון האחוזים
  percentFilter: [number, number] | null = null;
  // פונקציה שמבצעת פעולה כאשר נבחר ערך בטווח האחוזים
  precentChanged(event: any) {
    console.log('Selected value p:', event);
    this.percentFilter = event; // שמירת הערכים של סינון האחוזים
    this.checkFilter() // קריאה לפונקציה לעדכון הגרף
  }

  // פונקציה שמחזירה את כל האפשרויות של enumType
  getEnumOptions(): IOption[] {
    return Object.keys(enumType).map((key) => ({
      key: key,
      txt: enumType[key as keyof typeof enumType],
    }));
  }

  clear() {
    console.log('Clearing all filters and resetting controls...');
    if (this.dynForm$) {
      this.dynForm$.reset();
      this.dynForm$.patchValue({
      radio: '2', // ברירת מחדל היא עמודות
      ptorfuelGroup: '',
      basefuelGroup: '',
      calander: '', 
      precent: '', 
    })
    }
    // עדכון האפשרויות בטופס
    if (this.frmControls.fields.basefuelGroup) {
      this.frmControls.fields.basefuelGroup.placeholder = "this.frmControls.fields.basefuelGroup.placeholder";
    }

    this.filteredData = [...this.allData];
    const fromDate = new Date(Math.min(...this.allData.map((item: any) => new Date(item.FromDate).getTime())));
    const toDate = new Date(Math.max(...this.allData.map((item: any) => new Date(item.ToDate).getTime())));
    const labels: string[] = [];
    let currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // מוסיף אפס מוביל לחודשים 1-9
      labels.push(`${month}-${year}`); // פורמט "שנה-חודש"
      currentDate.setMonth(currentDate.getMonth() + 1); // מעבר לחודש הבא
    }
    // קריאה ל-setFormControls כדי להחזיר את המצב לערכי ברירת המחדל
    this.setFormControls();
    this.chartData(); 
    console.log('All filters have been cleared.');
  }
  // פונקציה ליצירת תוויות בין שני תאריכים
  generateLabels(fromDate: Date, toDate: Date): string[] {
    const labels: string[] = [];
    let currentDate = new Date(fromDate);
    while (currentDate <= toDate) {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      labels.push(`${month}-${year}`);
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    return labels;
  }
  colors: any

  chartData() {
    // מיפוי צבעים קבוע לכל label
    if (!this.labelColorMap) this.labelColorMap = {};
    let colorIndex = 0;
    const documentStyle = getComputedStyle(document.documentElement);
    const colorPalette = [
      documentStyle.getPropertyValue('--blue-500'),
      documentStyle.getPropertyValue('--red-500'),
      documentStyle.getPropertyValue('--green-500'),
      documentStyle.getPropertyValue('--yellow-500'),
      documentStyle.getPropertyValue('--purple-500'),
      '#FF9800', '#009688', '#9C27B0', '#607D8B', '#795548'
    ];
    // התחלה עם כל הנתונים אם אין סינון קודם
    if (!this.filteredData) {
      this.filteredData = [...this.allData];
    }
    // יצירת datasets דינמי עם צבע ייחודי לכל label
    const datasets = this.filteredData.map((item: any) => {
      const label = `${item.BaseFuelGroupName} פטור: ${item.PtorFuelGroupName}`;
      if (!this.labelColorMap[label]) {
        this.labelColorMap[label] = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
      }
      const color = this.labelColorMap[label];
      return {
        label: label,
        backgroundColor: color,
        borderColor: color,
        data: this.lable.map((labelStr: string) => {
          const fromDate = new Date(item.FromDate);
          const toDate = new Date(item.ToDate);

          if (labelStr.includes('-')) {
            const [labelMonth, labelYear] = labelStr.split('-').map(Number);
            const labelDate = new Date(labelYear, labelMonth - 1);
            return (labelDate >= fromDate && labelDate <= toDate) ? item.PercentPartialPtor : null;
          } else {
            const labelYear = Number(labelStr);
            const fromYear = fromDate.getFullYear();
            const toYear = toDate.getFullYear();
            return (labelYear >= fromYear && labelYear <= toYear) ? item.PercentPartialPtor : null;
          }
        })
      };
    });

    this.data = {
      labels: this.lable,
      datasets: datasets
    };

    const isMobile = window.innerWidth < 600;
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: isMobile ? 0.5 : 0.8,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            generateLabels: (chart: any) => {
              return chart.data.datasets.map((dataset: any, index: number) => {
                const [baseFuelGroup, ptorFuelGroup] = dataset.label.split(' פטור: ');
                return {
                  text: [`בסיס: ${baseFuelGroup}`, `פטור: ${ptorFuelGroup}`],
                  fillStyle: dataset.backgroundColor,
                  strokeStyle: dataset.borderColor,
                  hidden: !chart.isDatasetVisible(index),
                  datasetIndex: index,
                  usePointStyle: true,
                };
              });
            },
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color'),
            usePointStyle: true,
            padding: 10,
          }
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              const dataset = tooltipItem.dataset;
              const baseFuelGroup = dataset.label.split(' פטור: ')[0];
              const ptorFuelGroup = dataset.label.split(' פטור: ')[1];
              const percent = tooltipItem.raw;
              return [`בסיס: ${baseFuelGroup}`, `פטור: ${ptorFuelGroup}`, `אחוזים: ${percent}%`];
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'משך הפטור',
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary'),
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary'),
            font: {
              weight: 500
            }
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border'),
            drawBorder: false
          }
        },
        y: {
          title: {
            display: true,
            text: 'אחוזים',
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary'),
            font: {
              size: 14,
              weight: 'bold'
            }
          },
          ticks: {
            stepSize: 1,
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-secondary'),
            callback: function (value: number) {
              return `${value}%`;
            }
          },
          grid: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--surface-border'),
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
}

  checkFilter() {
    console.log("Initial base:", this.base);
    console.log("Initial ptor:", this.ptor);
    this.filteredData = this.allData
    // סינון לפי טווח שנים
    if (this.selectedRangecalander.length === 2) {
      console.log("filterdatabeforecalander", this.filteredData);
      const fromDate = new Date(`${this.selectedRangecalander[0].split('/')[1]}-${this.selectedRangecalander[0].split('/')[0]}-01`);
      const toDate = new Date(`${this.selectedRangecalander[1].split('/')[1]}-${this.selectedRangecalander[1].split('/')[0]}-01`);
      this.lable = this.generateLabels(fromDate, toDate); // פונקציה ליצירת תוויות ע
      this.filteredData = this.filteredData.filter((item: any) => {
        const itemFromDate = new Date(item.FromDate);
        const itemToDate = new Date(item.ToDate);
        return !(itemToDate < fromDate || itemFromDate > toDate);
      });
      console.log("filterdataaftercalander", this.filteredData);

    }

    // סינון לפי ערך שנבחר ב-select
    if (this.base !== undefined && this.base !== "") {
      console.log("Initial base:", this.base);
      // מצא את כל הפריטים שמכילים את הערך הנבחר ב-PtorFuelGroupName
      this.filteredData = this.filteredData.filter((item: any) => item.BaseFuelGroupName === this.base);

      const dateSet = new Set();

      if (this.filteredData.length > 0) {
        const fromDates = this.filteredData.map((item: any) => new Date(item.FromDate));
        const toDates = this.filteredData.map((item: any) => new Date(item.ToDate));

        const minDate = new Date(Math.min(...fromDates));
        const maxDate = new Date(Math.max(...toDates));

        for (let d = minDate; d <= maxDate; d.setDate(d.getDate() + 1)) {
          const year = d.getFullYear();
          const month = (d.getMonth() + 1).toString().padStart(2, '0');
          dateSet.add(`${month}-${year}`);
        }
      }

      this.lable = Array.from(dateSet);
    }
    console.log("filterdataafterfb", this.filteredData);


    if (this.ptor !== undefined && this.ptor !== "") {
      console.log("Initial ptor:", this.ptor);
      this.filteredData = this.filteredData.filter((item: any) => item.PtorFuelGroupName === this.ptor);
      const dateSet = new Set();

      if (this.filteredData.length > 0) {
        const fromDates = this.filteredData.map((item: any) => new Date(item.FromDate));
        const toDates = this.filteredData.map((item: any) => new Date(item.ToDate));

        const minDate = new Date(Math.min(...fromDates));
        const maxDate = new Date(Math.max(...toDates));

        for (let d = minDate; d <= maxDate; d.setDate(d.getDate() + 1)) {
          const year = d.getFullYear();
          const month = (d.getMonth() + 1).toString().padStart(2, '0');
          dateSet.add(`${month}-${year}`);
        }
      }

      this.lable = Array.from(dateSet);
    }
    console.log("filterdataafterfp", this.filteredData);


    // סינון נוסף לפי אחוזים אם קיים
    if (this.percentFilter?.length === 2) {
      this.filteredData = this.filteredData.filter((item: any) =>
        item.PercentPartialPtor >= (this.percentFilter![0] ?? 0) &&
        item.PercentPartialPtor <= (this.percentFilter![1] ?? 100)
      );
    }
    console.log("filteredData", this.filteredData);

    this.chartData()
  }
mapHeaders(data: any[]): any[] {
  console.log("mapHeaders", data);
  
  if (data && data.length > 0) {
      return data.map((item: any) => ({
          'מספר צו': item.DecisionNo,
          'תאריך התחלה': item.FromDate,
          'תאריך סיום': item.ToDate,
          'אחוז הפטור': item.PercentPartialPtor,
          'קבוצת דלק בפטור': item.PtorFuelGroupName,
          'קבוצת דלק בסיס': item.BaseFuelGroupName
      }));
  }
  return []; 
}

}



