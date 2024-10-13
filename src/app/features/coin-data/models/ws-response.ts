export interface IWsResponse {
  type: 'l1-snapshot' | 'l1-update';
  instrumentId: string;
  provider: string;
  last: ILastData;
}

export interface ILastData {
  timestamp: string;
  price: number;
  volume: number;
  change: number;
  changePct: number;
}

