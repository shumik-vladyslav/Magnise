import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IInstrument } from '../../models/instruments-data';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-smart-coin-info',
  template: `<app-coin-info [instrumentsList]="(instrumentsList$ | async)!"></app-coin-info>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartCoinInfoComponent {
  public instrumentsList$: Observable<IInstrument[]> = this.apiService.getInstrumentsList();
  
  constructor(private apiService: ApiService) {}

}
