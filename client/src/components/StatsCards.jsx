import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function StatsCards({ summary, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200 rounded"></div>
              <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
            </div>
            <div className="h-8 w-36 bg-slate-200 rounded"></div>
            <div className="h-3 w-40 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const balance = summary?.balance ?? 0;
  const totalIncome = summary?.totalIncome ?? 0;
  const totalExpense = summary?.totalExpense ?? 0;

  const cards = [
    {
      title: 'Net Balance',
      amount: balance,
      subtitle: balance >= 0 ? 'Surplus / Available Funds' : 'Deficit in Period',
      icon: Wallet,
      iconBg: 'bg-indigo-50 text-indigo-600',
      amountColor: balance >= 0 ? 'text-slate-900' : 'text-rose-600',
    },
    {
      title: 'Total Income',
      amount: totalIncome,
      subtitle: 'Inflow from all income sources',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-600',
      amountColor: 'text-emerald-600',
    },
    {
      title: 'Total Expenses',
      amount: totalExpense,
      subtitle: 'Outflow across all categories',
      icon: TrendingDown,
      iconBg: 'bg-rose-50 text-rose-600',
      amountColor: 'text-rose-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
                {card.title}
              </span>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.iconBg}`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${card.amountColor}`}>
                {formatCurrency(card.amount)}
              </div>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

