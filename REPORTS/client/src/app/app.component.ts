
import { ToggleButtonModule } from 'primeng/togglebutton';
import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {  OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputSwitchModule } from 'primeng/inputswitch';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ratesDashbord';

  counter = 0;
  onClick() {
    this.counter++;
  }


  menuItems: MenuItem[] = [
      {
        label: 'דוחות',
        icon: 'pi pi-angle-down', // חץ ליד "דוחות"
        items: [
          {
            label: 'צווי הפטור',
            icon: 'pi pi-file',
            routerLink: '/firstreport'
          },
          {
            label: 'תעריפי דלק',
            icon: 'pi pi-file',
            routerLink: '/secondreport'
          }, 
          {
            label: 'כמות צווים',
            icon: 'pi pi-file',
            routerLink: '/threereport'
          }, 
          {
            label: 'מדדים ',
            icon: 'pi pi-file',
            routerLink: '/metrixreport'
          }, 
        ]
      },
      {
        label: 'המרת XML ל JSON',
        icon: 'pi pi-file',
       routerLink: '/convert'
      },
      {
        label: 'פרסומות',
        icon: 'pi pi-file',
       routerLink: '/article'
      },

    ];
}
