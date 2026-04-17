import { Component, Input, input } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls:[ './menu.component.css']
})
export class MenuComponent {
@Input()
  items: MenuItem[] | undefined;

  // visibleSidebar: boolean = false;
  isSidebarClosed: boolean = false; // מצב התפריט (פתוח/סגור)

  // ngOnInit() {
  //   this.items = [
  //     {
  //       label: 'דוחות',
  //       icon: 'pi pi-palette',
  //       items: [
  //         {
  //           label: 'צווי הפטור',
  //           icon: 'pi pi-palette',
  //           route: '/firstreport'
  //         },
  //         {
  //           label: 'תעריפי דלק',
  //           icon: 'pi pi-palette',
  //           route: '/secondreport'
  //         }
  //       ]
  //     },
  //     {
  //       label: '2צווי הפטור',
  //       icon: 'pi pi-palette'
  //     }

  //   ]
  // }
  // toggleSidebar() {
  //   this.isSidebarClosed = !this.isSidebarClosed;
  //   console.log('Sidebar state:', this.isSidebarClosed);
  // }




}

