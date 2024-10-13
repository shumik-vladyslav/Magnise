import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Observable, Subject, interval, map } from 'rxjs';
import { IInstrument } from 'src/app/features/coin-data/models/instruments-data';

@Component({
  selector: 'app-coin-info',
  templateUrl: './coin-info.component.html',
  styleUrls: ['./coin-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoinInfoComponent {
  @Input() set instrumentsList(value: IInstrument[]) {
    this._instrumentsList = value;
    if (value?.length) {
      this.selectedInstrument.next(value[0]);
    }
  }

  public get instrumentsList(): IInstrument[] {
    return this._instrumentsList;
  }

  private _instrumentsList: IInstrument[] = [];
  private selectedInstrument: Subject<IInstrument> = new Subject<IInstrument>();
  public selectedInstrument$ = this.selectedInstrument.asObservable();
  public lastPrice: number = 0;
  public currentDate$: Observable<Date> = interval(1000).pipe(
    map(() => new Date())
  );

  public onChangePair(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const instrument = this.instrumentsList.find(
      (instrument) => instrument.id === selectedValue
    );

    if (!instrument) return;
    this.selectedInstrument.next(instrument);
  }

  public getLastData(price: number): void {
    this.lastPrice = price;
  }
}
