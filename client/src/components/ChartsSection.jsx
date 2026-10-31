import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { PieChart as PieIcon, BarChart3, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const CATEGORY_COLORS = [
  '#f43f5e', // rose-500
  '#6366f1', // indigo-500
  '#f59e0b', // amber-500
  '#06b6d4', // cyan-500
  '#8b5cf6', // violet-500
  '#10b981', // emerald-500
  '#ec4899', // pink-500
  '#64748b', // slate-500
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-md text-xs">
        <p className="font-semibold text-slate-800">{label || data.name}</p>
        <p className="text-slate-600 font-medium mt-0.5">
          {formatCurrency(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

export default function ChartsSection({ summary, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm animate-pulse h-80 flex flex-col justify-between"
          >
            <div className="h-5 w-40 bg-slate-200 rounded"></div>
            <div className="h-52 bg-slate-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  // Expense by category data
  const categoryTotals = summary?.categoryTotals || {};
  const categoryData = Object.entries(categoryTotals)
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const totalExpense = summary?.totalExpense || 0;
  const totalIncome = summary?.totalIncome || 0;

  // Cash flow bar chart data
  const cashFlowData = [
    {
      name: 'Total Income',
      amount: totalIncome,
      color: '#10b981',
    },
    {
      name: 'Total Expense',
      amount: totalExpense,
      color: '#f43f5e',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Card 1: Expense by Category Donut Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2">
            <PieIcon className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-800">
              Expenses by Category
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {categoryData.length} {categoryData.length === 1 ? 'Category' : 'Categories'}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-[260px]">
          {categoryData.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8 text-slate-400">
              <AlertCircle className="w-8 h-8 mb-2 stroke-1 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No expense data yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Log your expenses to see an interactive visual distribution by category.
              </p>
            </div>
          ) : (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Card 2: Cash Flow Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-800">
              Cash Flow Comparison
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Income vs Outflow
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center min-h-[260px]">
          {totalIncome === 0 && totalExpense === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-8 text-slate-400">
              <AlertCircle className="w-8 h-8 mb-2 stroke-1 text-slate-300" />
              <p className="text-sm font-medium text-slate-600">No cash flow recorded</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Add income and expense entries to monitor your inflow vs outflow ratio.
              </p>
            </div>
          ) : (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cashFlowData}
                  margin={{ top: 15, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={(val) => {
                      if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
                      if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
                      return `₹${val}`;
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={48}>
                    {cashFlowData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

