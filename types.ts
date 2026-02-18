
export enum TradeType {
  PROFIT = 'PROFIT',
  LOSS = 'LOSS'
}

export interface Trade {
  id: string;
  userId: string;
  date: string; // ISO format
  amount: number;
  currency: string;
  type: TradeType;
  emotions: string;
  description: string;
}

export interface DayStats {
  date: string;
  totalProfit: number;
  totalLoss: number;
  netResult: number;
  trades: Trade[];
}

export interface User {
  username: string;
  password: string;
  currency: string;
}

export interface UserProfile {
  name: string;
  joinedAt: string;
  currency: string;
}
