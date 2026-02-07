export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  REVENUE = 'REVENUE',
  MAINTENANCE = 'MAINTENANCE',
  SETTINGS = 'SETTINGS'
}

export interface TimeSeriesPoint {
  time: string;
  solarMW: number;
  bessChargeMW: number; // Positive = Charging, Negative = Discharging
  gridExportMW: number;
  h2ProductionKg: number;
  marketPriceINR: number;
}

export interface AssetStatus {
  id: string;
  name: string;
  type: 'SOLAR' | 'BESS' | 'H2' | 'GRID';
  status: 'ONLINE' | 'WARNING' | 'CRITICAL' | 'OFFLINE';
  efficiency: number;
  temperature: number;
  output: number; // MW or kg/hr
  capacity: number; // Max MW
}

export interface BESSCellData {
  id: string;
  voltage: number;
  temp: number;
  soc: number;
  soh: number;
  cluster: string;
}

export interface MarketBid {
  timeBlock: string;
  quantityMW: number;
  priceINR: number;
  type: 'DAM' | 'RTM' | 'ANCILLARY';
  status: 'ACCEPTED' | 'PENDING' | 'REJECTED';
}

export interface AIAnalysisResult {
  text: string;
  timestamp: number;
  confidence: number;
  recommendedAction?: string;
}
