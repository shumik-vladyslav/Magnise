import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SmartCoinInfoComponent } from './components/smart-coin-info/smart-coin-info.component';

const routes: Routes = [
  {
    path: "",
    component: SmartCoinInfoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoinDataRoutingModule { }
