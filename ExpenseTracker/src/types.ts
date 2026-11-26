export type TransactionType = 'Expense' | 'Income';
export interface Transaction {
  id: number; title: string; category: string; amount: number; date: string;
  type: TransactionType; note?: string;
}
export interface DashboardSummary {
  balance: number; income: number; expenses: number; savingsRate: number;
  monthlySpending: { month: string; amount: number }[];
  categorySpending: { category: string; amount: number; color: string }[];
  recentTransactions: Transaction[];
}
export type NewTransaction = Omit<Transaction, 'id'>;
