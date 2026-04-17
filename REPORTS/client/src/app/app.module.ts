import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TieredMenu } from 'primeng/tieredmenu';
 
import { DropdownModule } from 'primeng/dropdown';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartModule } from 'primeng/chart';
import { ReportsService } from './services/reports.service';
import { CalendarModule } from 'primeng/calendar';
import {InputNumberModule}from 'primeng/inputnumber'
import{MultiSelectModule} from 'primeng/multiselect'
import{InputSwitchModule} from 'primeng/inputswitch'
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartComponent } from './components/shared/components/chart/chart.component';
import { DynamicFormControlComponent } from './components/shared/components/filters/dynamic-form-control/dynamic-form-control.component';
import { DynamicFormComponent } from './components/shared/components/filters/dynamic-form/dynamic-form.component';
import { FormsModule } from '@angular/forms';
import { SliderModule } from 'primeng/slider';
import {  HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { DecisionsAmountComponent } from './components/site/reports/decisions-amount/decisions-amount.component';
import { ConvertXmlToJsonComponent } from './components/site/reports/decisions-amount/convert-xml-to-json/convert-xml-to-json.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PostsCarouselComponent } from './components/site/reports/decisions-amount/posts-carousel/posts-carousel.component'; 
import { MenuModule } from 'primeng/menu';
import { MenuComponent } from './components/shared/components/menu/menu.component';
import { RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SystemService } from './services/system.service';
import { DynamicFormService } from './services/dynamic-form.service';
import { RangeComponent } from './components/shared/components/filters/range/range.component';

import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FuelRatesComponent } from './components/site/reports/fuel-rates/fuel-rates.component';
import { FooterComponent } from './components/shared/components/footer/footer.component';
import { PtorDecisionComponent } from './components/site/reports/ptor-decision/ptor-decision.component';
import { MetrixComponent } from './components/site/reports/metrix/metrix.component';
import { DateUtilsService } from './services/date-utils.service';
import { ArticlComponent } from './components/shared/components/articl/articl.component';

import { ExcelExportComponent } from './components/shared/components/excel-export/excel-export.component';
@NgModule({
  // קומפוננטות נוספות
  
  declarations: [
    AppComponent,
    ChartComponent,
    DecisionsAmountComponent,
    DynamicFormControlComponent,
    DynamicFormComponent,
    ConvertXmlToJsonComponent,
    PostsCarouselComponent,
    MenuComponent,
    FuelRatesComponent,
    RangeComponent,
    FooterComponent,
    FooterComponent,
    PtorDecisionComponent,
    MetrixComponent,
    ArticlComponent,
    ExcelExportComponent
  ],
  imports: [
    DropdownModule,
    TieredMenuModule,
    TieredMenuModule,
    BrowserModule,
    AppRoutingModule,
    ChartModule,
    CalendarModule,
    InputNumberModule,
    MultiSelectModule,
    InputSwitchModule,
    ReactiveFormsModule, 
    BrowserAnimationsModule,
    FormsModule ,
    SliderModule,
    HttpClientModule ,
    CommonModule,
    SliderModule,
    FileUploadModule,
    ToastModule,
    MenuModule,
    RouterModule,
    MenubarModule,
    SidebarModule,
    PanelMenuModule,
    FormsModule,
    CalendarModule,
    FormsModule,
    InputNumberModule,
    ReactiveFormsModule,
    InputSwitchModule,
     
  ],
  providers: [ReportsService,DatePipe,MessageService,MenuComponent,ConfirmationService,SystemService,DynamicFormService,DateUtilsService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AppModule { }



