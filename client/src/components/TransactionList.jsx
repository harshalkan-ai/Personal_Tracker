import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Calendar,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2,
  Inbox,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { deleteTransaction } from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function TransactionList({
  transactions = [],
  loading,
  onTransactionDeleted,
}) {
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Extract all unique categories present in the current dataset
  const uniqueCategories = useMemo(() => {
    const set = new Set();
    transactions.forEach((tx) => {
      if (tx.category) set.add(tx.category);
    });
    return Array.from(set).sort();
  }, [transactions]);

  // Client-side filtering for immediate snappy UI response
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (typeFilter !== 'all' && tx.type !== typeFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) {
        return false;
      }

      // Search query filter (matches title or notes)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = tx.title?.toLowerCase().includes(query);
        const matchesNotes = tx.notes?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesNotes) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, typeFilter, categoryFilter, searchQuery]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted successfully');
      onTransactionDeleted?.();
    } catch (error) {
      toast.error(error.message || 'Failed to delete transaction');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Top Header & Search/Filter Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Transaction History
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredTransactions.length} of {transactions.length} recorded items
            </p>
          </div>

          {/* Type Filter Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-lg self-start sm:self-auto border border-slate-200/50">
            {['all', 'income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                  typeFilter === t
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Category Filter Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium cursor-pointer"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="p-8 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-4 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Inbox className="w-6 h-6 stroke-1 text-slate-400" />
          </div>
          <h4 className="text-sm font-semibold text-slate-800">
            No transactions found
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            {searchQuery || typeFilter !== 'all' || categoryFilter !== 'all'
              ? 'No records match your active search and filter criteria. Try resetting filters.'
              : 'Start tracking your financial journey by adding your first transaction above.'}
          </p>
          {(searchQuery || typeFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => {
                setTypeFilter('all');
                setCategoryFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        /* Table Layout */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-5 py-3.5">
                  Transaction Name
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Category
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Date
                </th>
                <th scope="col" className="px-5 py-3.5">
                  Notes
                </th>
                <th scope="col" className="px-5 py-3.5 text-right">
                  Amount
                </th>
                <th scope="col" className="px-4 py-3.5 text-center w-12">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const isDeleting = deletingId === tx._id;

                return (
                  <tr
                    key={tx._id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Title & Icon */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isIncome
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-rose-50 text-rose-600'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">
                          {tx.title}
                        </span>
                      </div>
                    </td>

                    {/* Category Pill */}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {tx.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-slate-500">
                      <div className="flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(tx.date)}</span>
                      </div>
                    </td>

                    {/* Notes */}
                    <td className="px-5 py-3.5 text-xs text-slate-500 max-w-xs truncate">
                      {tx.notes ? (
                        <span title={tx.notes} className="flex items-center space-x-1">
                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{tx.notes}</span>
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">&mdash;</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td
                      className={`px-5 py-3.5 whitespace-nowrap text-right font-semibold text-sm tabular-nums ${
                        isIncome ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                    </td>

                    {/* Delete Action */}
                    <td className="px-4 py-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleDelete(tx._id, tx.title)}
                        disabled={isDeleting}
                        title="Delete transaction"
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors disabled:opacity-40"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

