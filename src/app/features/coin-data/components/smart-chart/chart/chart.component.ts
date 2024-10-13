import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { EChartsOption, SeriesOption, TooltipComponentFormatterCallbackParams, XAXisComponentOption } from 'echarts';
import {
  IDataPoint,
  IEChartDataCandeStick,
} from 'src/app/features/coin-data/models/chart-data';
import { ILastData, IWsResponse } from 'src/app/features/coin-data/models/ws-response';
import { formatDate } from 'src/app/core/common/format-date';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnInit {
  @Input() set data(data: IDataPoint[]) {
    this.generateDataForChart(data);

    const lastPrice = data[data.length - 1].c;
    this.getLastData.emit(lastPrice);
  }
  @Input() set realTimeData(value: IWsResponse | null) {
    if (!value || value?.type !== 'l1-update') return;
    
    this.updateChartWithRealTimeData(value.last);
    this.getLastData.emit(value.last.price);
  }

  @Output() getLastData = new EventEmitter<number>();

  private chartData: IEChartDataCandeStick[] = [];
  private xAxisData: string[] = [];
  public option: EChartsOption | null = null;
  public updateOptions: EChartsOption | null = null;

  ngOnInit(): void {
    this.initChartOptions();
  }

  private generateDataForChart(data: IDataPoint[]): void {
    data.forEach((item: IDataPoint) => {
      this.chartData.push([item.o, item.c, item.l, item.h, item.v]);
      this.xAxisData.push(formatDate(item.t));
    });
  }

  private initChartOptions(): void {
    this.option = {
      grid: [
        {
          left: '5%',
          right: '5%',
          height: '50%',
          top: '5%',
        },
        {
          left: '5%',
          right: '5%',
          top: '70%',
          height: '16%',
        },
      ],
      xAxis: [
        {
          type: 'category',
          data: this.xAxisData!,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
        },
        {
          type: 'category',
          gridIndex: 1,
          data: this.xAxisData!,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          min: 'dataMin',
          max: 'dataMax',
        },
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true,
          },
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'Candlestick',
          type: 'candlestick',
          data: this.chartData!,
          itemStyle: {
            color: '#00da3c',
            color0: '#ec0000',
            borderColor: '#00da3c',
            borderColor0: '#ec0000',
          },
        },
        {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: this.chartData!.map((item) => item[4]),
          itemStyle: {
            color: 'rgba(0, 0, 255, 0.3)',
          },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 90,
          end: 100,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          top: '85%',
          start: 90,
          end: 100,
        },
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        formatter: (params: TooltipComponentFormatterCallbackParams) => {
          if (!params || !Array.isArray(params)) {
            return '';
          }

          const dataIndex = params[0].dataIndex;

          return `
            Date: ${this.xAxisData[dataIndex]}<br>
            Open: ${this.chartData![dataIndex][0]}<br>
            Close: ${this.chartData![dataIndex][1]}<br>
            Low: ${this.chartData![dataIndex][2]}<br>
            High: ${this.chartData![dataIndex][3]}<br>
            Volume: ${this.chartData![dataIndex][4]}
          `;
        },
      },
    };
  }

  private updateChartWithRealTimeData(realTimeData: ILastData): void {
    if (this.option && this.chartData && this.xAxisData) {
      const lastDateOnChart = this.xAxisData[this.xAxisData.length - 1];

      if (
        this.isDateLessThanPeriod(
          lastDateOnChart,
          realTimeData.timestamp,
          1 * 60 * 1000
        )
      ) {
        this.chartData[this.chartData.length - 1] = this.addDataToCandle(
          this.chartData[this.chartData.length - 1],
          realTimeData
        );
      } else {
        this.addNewCandle(realTimeData);
      }

      const series = this.option.series as SeriesOption[];

      if (series && series.length > 1) {
        series[0].data = this.chartData;
        series[1].data = this.chartData.map((item) => item[4]);
      }

      const xAxis = this.option.xAxis as XAXisComponentOption[];

      if (xAxis && xAxis.length > 1) {
        (xAxis[0] as XAXisComponentOption & { data?: string[] }).data =
          this.xAxisData;
        (xAxis[1] as XAXisComponentOption & { data?: string[] }).data =
          this.xAxisData;
      }

      this.updateOptions = {
        series: [
          {
            data: this.chartData,
          },
          {
            data: this.chartData!.map((item) => item[4]),
          },
        ],
        xAxis: [
          {
            data: this.xAxisData,
          },
          {
            data: this.xAxisData,
          },
        ],
      };
    }
  }

  private addDataToCandle(
    lastCandle: IEChartDataCandeStick,
    newData: ILastData
  ): IEChartDataCandeStick {
    const updatedCandle = [...lastCandle];
    updatedCandle[1] = newData.price; //candle close
    updatedCandle[2] = Math.min(updatedCandle[2], newData.price); //candle low
    updatedCandle[3] = Math.max(updatedCandle[3], newData.price); //candle high
    updatedCandle[4] += newData.volume; //candle volume

    return updatedCandle;
  }

  private addNewCandle(newData: ILastData): void {
    this.chartData!.push([
      newData.price,
      newData.price,
      newData.price,
      newData.price,
      newData.volume,
    ]);
    this.xAxisData!.push(formatDate(newData.timestamp));
  }

  private isDateLessThanPeriod(
    oldDate: string,
    newDate: string,
    periodInMilliseconds: number
  ): boolean {
    const oldDateTime = new Date(oldDate);
    const newDateTime = new Date(formatDate(newDate));
    const timeDifference = newDateTime.getTime() - oldDateTime.getTime();

    return timeDifference < periodInMilliseconds;
  }
}
