import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environments';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {
 
  constructor() { }
  http: HttpClient = inject(HttpClient)
  a:any;
  getfualRates():Observable<any>{
     this.a = this.http.post<any>(environment.apiUrl+'fualRates', [])
    //  console.log(this.a+"from prog");
     return this.a;
  }
  get2():Observable<any>{
    this.a = this.http.post<any>(environment.apiUrl+'DecisionSummary', [])
   //  console.log(this.a+"from prog");
    return this.a;
 }
getMetrix():Observable<any>{
  this.a = this.http.post<any>(environment.apiUrl+'GetMadadimList', [])
  return this.a;
}
getPtorDecision():Observable<any>{
  this.a = this.http.post<any>(environment.apiUrl+'ptor', [])
  return this.a;
}

}