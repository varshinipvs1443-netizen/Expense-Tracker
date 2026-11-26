import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import AddExpense from './pages/AddExpense';
import AddIncome from './pages/AddIncome';
export default function App() { return <Routes><Route element={<AppLayout />}><Route index element={<Dashboard />} /><Route path="transactions" element={<Transactions />} /><Route path="add-expense" element={<AddExpense />} /><Route path="add-income" element={<AddIncome />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes>; }
