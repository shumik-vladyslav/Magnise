import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  inject,
} from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { IDataPoint } from 'src/app/features/coin-data/models/chart-data';
import { ApiService } from '../../services/api.service';
import { IWsResponse } from '../../models/ws-response';

@Component({
  selector: 'app-smart-chart',
  template: `<app-chart
    *ngIf="chartData$ | async as chartData"
    [data]="chartData"
    [realTimeData]="wsSubject$ | async"
    (getLastData)="getLastData.emit($event)"
  ></app-chart>`,
  styles: [
    `
      :host {
        flex: 1 0 0;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartChartComponent implements OnDestroy {
  @Input() provider: string = 'simulation';
  @Input() interval: string = '1';
  @Input() periodicity: string = 'minute';
  @Input() barsCount: number = 360;
  @Input() set instrumentId(value: string) {
    this.initData(value);
  }

  @Output() getLastData = new EventEmitter<number>();

  private apiService = inject(ApiService);
  public chartData$: Observable<IDataPoint[]> | null = null;
  public xAxisData$: Observable<string[]> | null = null;
  public wsSubject$: Observable<IWsResponse> | null = null;
  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.apiService.closeWebSocket();
  }

  private initData(instrumentId: string): void {
    this.wsSubject$ = this.apiService
      .createWebSocket(instrumentId)
      .pipe(takeUntil(this.destroy$));

    this.chartData$ = this.apiService.getChartData(
      instrumentId,
      this.provider,
      this.interval,
      this.periodicity,
      this.barsCount
    );
  }
}
