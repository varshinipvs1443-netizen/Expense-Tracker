import { api } from './client';
import type { DashboardSummary, NewTransaction, Transaction } from '../types';
export const transactionApi = {
  async getAll() {
     const response = await api.get<Transaction[]>('/api/transactions'); 
     return response.data;
    },
  async getDashboard() {
     const response = await api.get<DashboardSummary>('/api/dashboard');
      return response.data;
    },
  async create(payload: NewTransaction) {
     const response = await api.post<Transaction>('/api/transactions', payload);
      return response.data;
    },
  async remove(id: number) { 
    await api.delete(`/api/transactions/${id}`);
  },
};
