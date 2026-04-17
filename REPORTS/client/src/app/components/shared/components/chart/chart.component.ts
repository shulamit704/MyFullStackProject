import { Component, Input, input, OnInit } from '@angular/core';
import { Chart } from '../../models/chart';


@Component({
  selector: 'chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent {

    @Input() chart: Chart = {};

    constructor(){
    }

  ngOnInit() {
     
  }

}
