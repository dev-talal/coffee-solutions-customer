export interface Transaction {
  id: number;
  type: string;
  method: string;
  amount: number;
  status: string;
  created_at: string;
}
