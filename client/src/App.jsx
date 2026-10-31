import React, { useState, useEffect, useCallback } from 'react';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, RefreshCw } from 'lucide-react';

import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import StatsCards from './components/StatsCards';
import ChartsSection from './components/ChartsSection';
import TransactionList from './components/TransactionList';
import TransactionFormModal from './components/TransactionFormModal';
import { fetchTransactions, fetchSummary, setAuthTokenGetter } from './services/api';

function Dashboard() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    categoryTotals: {},
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Link Clerk's getToken with our API client interceptor immediately
  if (getToken) {
    setAuthTokenGetter(getToken);
  }

  useEffect(() => {
    if (getToken) {
      setAuthTokenGetter(getToken);
    }
  }, [getToken]);

  // Centralized dashboard data fetcher running parallel requests
  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const [txResult, summaryResult] = await Promise.all([
        fetchTransactions(),
        fetchSummary(),
      ]);

      setTransactions(txResult?.data || []);
      setSummary(
        summaryResult?.data || {
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          categoryTotals: {},
        }
      );
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error(error.message || 'Failed to fetch financial data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial data load when Clerk authentication is ready
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchDashboardData();
    }
  }, [isLoaded, isSignedIn, fetchDashboardData]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-slate-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Financial Overview
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Real-time cash flow, category distribution, and ledger history.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Refresh Button */}
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing || loading}
              title="Refresh data"
              className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl shadow-sm transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`}
              />
            </button>

            {/* Add Transaction Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-150"
            >
              <Plus className="w-4 h-4 text-slate-300" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>

        {/* 1. Metric Cards (Balance, Income, Expenses) */}
        <StatsCards summary={summary} loading={loading} />

        {/* 2. Visual Analytics (Pie & Bar charts) */}
        <ChartsSection summary={summary} loading={loading} />

        {/* 3. Transaction History Table */}
        <TransactionList
          transactions={transactions}
          loading={loading}
          onTransactionDeleted={() => fetchDashboardData(true)}
        />
      </main>

      {/* Add Transaction Modal */}
      <TransactionFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchDashboardData(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
            fontSize: '13px',
            fontWeight: 500,
          },
        }}
      />
      <SignedOut>
        <LandingPage />
      </SignedOut>
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}

