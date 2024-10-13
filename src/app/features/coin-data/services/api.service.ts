import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  IDataPoint,
  IGetChartDataResponse,
} from 'src/app/features/coin-data/models/chart-data';
import { AuthService } from 'src/app/core/services/auth.service';
import { environment } from 'src/environments/environment';
import { ENDPOINTS } from '../../../core/constants/endpoints';
import { IInstrument, IInstrumentsResponse } from '../models/instruments-data';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private socket$: WebSocketSubject<any> | null = null;

  constructor(private http: HttpClient, private authService: AuthService) {}

  public createWebSocket(instrumentId: string): Observable<any> {
    const url = `${environment.ws}${
      ENDPOINTS.STREAMING
    }/?token=${this.authService.getTokenFromLoacalStorage()}`;
    
    const message = {
      type: 'l1-subscription',
      id: '1',
      instrumentId: instrumentId,
      provider: 'simulation',
      subscribe: true,
      kinds: ['last'],
    };

    this.socket$ = webSocket(url);

    this.socket$.next(message);

    return this.socket$.asObservable();
  }

  public closeWebSocket(): void {
    this.socket$?.complete();
  }

  public getInstrumentsList(
    provider: string = 'simulation',
    kind: string = 'forex'
  ): Observable<IInstrument[]> {
    return this.http
      .get<IInstrumentsResponse>(
        `${environment.url}${ENDPOINTS.INSTRUMENTS_LIST}?provider=${provider}&kind=${kind}`
      )
      .pipe(map((response) => response.data));
  }

  public getChartData(
    instrumentId: string,
    provider: string,
    interval: string,
    periodicity: string,
    barsCount: number
  ): Observable<IDataPoint[]> {
    return this.http
      .get<IGetChartDataResponse>(
        `${environment.url}${ENDPOINTS.BARS_COUNT_BACK}?instrumentId=${instrumentId}&provider=${provider}&interval=${interval}&periodicity=${periodicity}&barsCount=${barsCount}`
      )
      .pipe(map((response) => response.data));
  }
}
