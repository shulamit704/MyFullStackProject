import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecisionsAmountComponent } from './components/site/reports/decisions-amount/decisions-amount.component';
import { ConvertXmlToJsonComponent } from './components/site/reports/decisions-amount/convert-xml-to-json/convert-xml-to-json.component';
import { PostsCarouselComponent } from './components/site/reports/decisions-amount/posts-carousel/posts-carousel.component';
import { FuelRatesComponent } from './components/site/reports/fuel-rates/fuel-rates.component';
import { PtorDecisionComponent } from './components/site/reports/ptor-decision/ptor-decision.component';
import { MetrixComponent } from './components/site/reports/metrix/metrix.component';
import { ArticlComponent } from './components/shared/components/articl/articl.component';

const routes: Routes = [
  { path: '',   redirectTo: 'firstreport', pathMatch: 'full' },
  { path: 'firstreport', component: PtorDecisionComponent },
  { path: 'secondreport', component: FuelRatesComponent },
  { path: 'threereport', component: DecisionsAmountComponent },
  { path: 'metrixreport', component: MetrixComponent },
  { path: 'article', component: ArticlComponent },
  { path: 'convert', component: ConvertXmlToJsonComponent },
  { path: '**', redirectTo: 'firstreport' } // נתיב ברירת מחדל
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



