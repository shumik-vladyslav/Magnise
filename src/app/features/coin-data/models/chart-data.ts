export interface IDataPoint {
  t: string; // Data time
  o: number; // Open price
  h: number; // High price
  l: number; // Low price
  c: number; // Close price
  v: number; // Volume
}

export type IEChartDataCandeStick = number[];

export interface IGetChartDataResponse {
  data: IDataPoint[];
}
