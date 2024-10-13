export interface IInstrument {
  id: string;
  symbol: string;
  kind: string;
  description: string;
  tickSize: number;
  currency: string;
  baseCurrency: string;
  mappings: {
    [key: string]: {
      symbol: string;
      exchange: string;
      defaultOrderSize: number;
    };
  };
  profile: {
    name: string;
    gics: Record<string, unknown>;
  };
}

export interface IInstrumentsResponse {
  data: IInstrument[];
}