import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinDataRoutingModule } from './coin-data-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { SmartChartComponent } from './components/smart-chart/smart-chart.component';
import { ChartComponent } from './components/smart-chart/chart/chart.component';
import { SmartCoinInfoComponent } from './components/smart-coin-info/smart-coin-info.component';
import { CoinInfoComponent } from './components/smart-coin-info/coin-info/coin-info.component';

@NgModule({
  declarations: [
    SmartCoinInfoComponent,
    CoinInfoComponent,
    SmartChartComponent,
    ChartComponent,
  ],
  imports: [
    CommonModule,
    CoinDataRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
})
export class CoinDataModule { }
