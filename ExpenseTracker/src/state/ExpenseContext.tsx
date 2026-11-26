import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { NewTransaction, Transaction } from '../types';
import { transactionApi } from '../api/transactions';

interface ExpenseContextValue {
  transactions: Transaction[]; loading: boolean; error: string;
  refresh: () => Promise<void>; addTransaction: (item: NewTransaction) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
}
const ExpenseContext = createContext<ExpenseContextValue | undefined>(undefined);
export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try { setTransactions(await transactionApi.getAll()); }
    catch { setError('Could not connect to the API. Start the .NET backend and check VITE_API_BASE_URL.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);
  const addTransaction = useCallback(async (item: NewTransaction) => {
    const created = await transactionApi.create(item);
    setTransactions(current => [created, ...current]);
  }, []);
  const deleteTransaction = useCallback(async (id: number) => {
    await transactionApi.remove(id); setTransactions(current => current.filter(t => t.id !== id));
  }, []);
  const value = useMemo(() => ({ transactions, loading, error, refresh, addTransaction, deleteTransaction }), [transactions, loading, error, refresh, addTransaction, deleteTransaction]);
  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}
export function useExpenses() {
  const value = useContext(ExpenseContext);
  if (!value) throw new Error('useExpenses must be used inside ExpenseProvider');
  return value;
}
