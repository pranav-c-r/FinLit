import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'framer-motion';

const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: '🍔', color: 'text-green-500' },
  { id: 'transport', label: 'Transportation', icon: '🚗', color: 'text-blue-500' },
  { id: 'housing', label: 'Housing & Utilities', icon: '🏠', color: 'text-purple-500' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: 'text-pink-500' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: 'text-yellow-500' },
  { id: 'health', label: 'Health & Medical', icon: '⚕️', color: 'text-red-500' },
  { id: 'education', label: 'Education', icon: '📚', color: 'text-indigo-500' },
  { id: 'personal', label: 'Personal Care', icon: '💇', color: 'text-orange-500' },
  { id: 'other', label: 'Other', icon: '📝', color: 'text-gray-500' },
];

const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', icon: '💼', color: 'text-green-500' },
  { id: 'freelance', label: 'Freelance', icon: '💻', color: 'text-blue-500' },
  { id: 'investment', label: 'Investments', icon: '📈', color: 'text-purple-500' },
  { id: 'gift', label: 'Gifts', icon: '🎁', color: 'text-pink-500' },
  { id: 'other_income', label: 'Other Income', icon: '💰', color: 'text-yellow-500' },
];

const ExpenseTracker = () => {
  const { state, dispatch } = useApp();
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize expenses safely
  useEffect(() => {
    if (!state?.expenses) {
      dispatch({
        type: 'INIT_EXPENSES',
        payload: {
          transactions: [],
          categories: {
            expense: EXPENSE_CATEGORIES,
            income: INCOME_CATEGORIES
          }
        }
      });
    }
  }, [state?.expenses, dispatch]);

  // If expenses aren't ready, show loading
  if (!state?.expenses) {
    return <div className="text-center py-8">Loading expense tracker...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0 || !category) return;

    const transaction = {
      id: editingId || `txn-${Date.now()}`,
      type: transactionType,
      amount: parseFloat(amount),
      category,
      description,
      date,
      createdAt: editingId
        ? state.expenses.transactions.find(t => t.id === editingId)?.createdAt
        : new Date().toISOString()
    };

    dispatch({
      type: editingId ? 'UPDATE_EXPENSE' : 'ADD_EXPENSE',
      payload: transaction
    });

    resetForm();
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setTransactionType(transaction.type);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setDescription(transaction.description);
    setDate(transaction.date);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    dispatch({ type: 'DELETE_EXPENSE', payload: { id: deleteId } });
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setTransactionType('expense');
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const categories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const filteredTransactions = (state.expenses.transactions || [])
    .filter(transaction => {
      if (filter !== 'all' && transaction.type !== filter) return false;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          transaction.description?.toLowerCase().includes(searchLower) ||
          transaction.category?.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const getCategoryDetails = (type, categoryId) => {
    const categoryList = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    return categoryList.find(cat => cat.id === categoryId) || { label: 'Unknown', icon: '❓', color: 'text-gray-500' };
  };

  // Calculate totals
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;

  return (
    <div className="game-panel p-6">
      <h2 className="text-2xl font-bold gradient-text-secondary mb-6">
        {editingId ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Transaction Type</label>
            <div className="flex rounded-lg bg-gray-800 p-1">
              <button
                type="button"
                onClick={() => setTransactionType('expense')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  transactionType === 'expense'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('income')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  transactionType === 'income'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                Income
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
              Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">$</span>
              </div>
              <input
                type="number"
                id="amount"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-light"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-light"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-light"
            placeholder="Enter a description"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="gradient-button-primary flex-1 py-2 px-4 rounded-lg font-medium"
          >
            {editingId ? 'Update Transaction' : 'Add Transaction'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg font-medium text-white transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="game-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Income</h3>
            <span className="text-green-500">💰</span>
          </div>
          <p className="text-2xl font-bold text-green-500">${totalIncome.toFixed(2)}</p>
        </div>
        
        <div className="game-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Expenses</h3>
            <span className="text-red-500">💸</span>
          </div>
          <p className="text-2xl font-bold text-red-500">${totalExpenses.toFixed(2)}</p>
        </div>
        
        <div className="game-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">Balance</h3>
            <span className={balance >= 0 ? 'text-green-500' : 'text-red-500'}>
              {balance >= 0 ? '📈' : '📉'}
            </span>
          </div>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${Math.abs(balance).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              filter === 'all'
                ? 'bg-primary-light text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              filter === 'income'
                ? 'bg-green-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              filter === 'expense'
                ? 'bg-red-700 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Expenses
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-64 bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-light"
            placeholder="Search transactions..."
          />
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Transactions</h3>
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {searchTerm ? 'No transactions match your search.' : 'No transactions yet.'}
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const categoryDetails = getCategoryDetails(transaction.type, transaction.category);
            return (
              <motion.div
                key={transaction.id}
                className="game-card p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`text-xl ${categoryDetails.color}`}>
                      {categoryDetails.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{transaction.description || 'No description'}</h4>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <span>{categoryDetails.label}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="p-1 text-blue-400 hover:text-blue-300 transition"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="p-1 text-red-400 hover:text-red-300 transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="game-panel p-6 max-w-md w-full rounded-xl">
            <h3 className="text-xl font-bold gradient-text-tertiary mb-4">Delete Transaction?</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button onClick={cancelDelete} className="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium text-white transition">
                Cancel
              </button>
              <button onClick={confirmDelete} className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium text-white transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;