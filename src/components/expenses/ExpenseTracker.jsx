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
  
  // Initialize expenses if they don't exist
  useEffect(() => {
    if (!state.expenses) {
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
  }, [state.expenses, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0 || !category) {
      return;
    }
    
    const transaction = {
      id: editingId || `txn-${Date.now()}`,
      type: transactionType,
      amount: parseFloat(amount),
      category,
      description,
      date,
      createdAt: editingId ? state.expenses.transactions.find(t => t.id === editingId).createdAt : new Date().toISOString()
    };
    
    if (editingId) {
      dispatch({
        type: 'UPDATE_EXPENSE',
        payload: transaction
      });
      setEditingId(null);
    } else {
      dispatch({
        type: 'ADD_EXPENSE',
        payload: transaction
      });
    }
    
    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
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
    dispatch({
      type: 'DELETE_EXPENSE',
      payload: { id: deleteId }
    });
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

  // Get categories based on transaction type
  const categories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
  
  // Filter and sort transactions
  const filteredTransactions = state.expenses?.transactions
    .filter(transaction => {
      // Filter by type
      if (filter !== 'all' && transaction.type !== filter) return false;
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchLower) ||
          transaction.category.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)) || [];

  // Get category details by ID
  const getCategoryDetails = (type, categoryId) => {
    const categoryList = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    return categoryList.find(cat => cat.id === categoryId) || { label: 'Unknown', icon: '❓', color: 'text-gray-500' };
  };

  // If expenses are not initialized yet, show loading
  if (!state.expenses) {
    return <div className="text-center py-8">Loading expense tracker...</div>;
  }

  return (
    <div className="game-panel p-6">
      <h2 className="text-2xl font-bold gradient-text-secondary mb-6">
        {editingId ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>
      
      {/* Transaction Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Transaction Type */}
          <div>
            <label className="block text-gray-300 mb-2">Transaction Type</label>
            <div className="flex rounded-lg overflow-hidden">
              <button
                type="button"
                className={`flex-1 py-2 ${transactionType === 'expense' ? 'gradient-button-tertiary' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => setTransactionType('expense')}
              >
                Expense
              </button>
              <button
                type="button"
                className={`flex-1 py-2 ${transactionType === 'income' ? 'gradient-button-primary' : 'bg-gray-800 text-gray-300'}`}
                onClick={() => setTransactionType('income')}
              >
                Income
              </button>
            </div>
          </div>
          
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-gray-300 mb-2">Amount</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Category</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all ${category === cat.id ? 'game-card' : 'bg-gray-800 hover:bg-gray-700'}`}
                onClick={() => setCategory(cat.id)}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className={`text-xs ${cat.color}`}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-300 mb-2">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        {/* Date */}
        <div className="mb-6">
          <label htmlFor="date" className="block text-gray-300 mb-2">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        
        {/* Form Actions */}
        <div className="flex space-x-3">
          <button
            type="submit"
            className={`flex-1 py-2 rounded-lg font-medium ${transactionType === 'expense' ? 'gradient-button-tertiary' : 'gradient-button-primary'}`}
          >
            {editingId ? 'Update' : 'Add'} {transactionType === 'expense' ? 'Expense' : 'Income'}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-white transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      {/* Transaction List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
            </select>
            
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No transactions found. Add your first one!
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {filteredTransactions.map((transaction) => {
              const categoryDetails = getCategoryDetails(transaction.type, transaction.category);
              
              return (
                <motion.div 
                  key={transaction.id}
                  className="game-card p-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'expense' ? 'bg-tertiary bg-opacity-20' : 'bg-primary bg-opacity-20'} mr-3`}>
                        <span className="text-xl">{categoryDetails.icon}</span>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-white">{transaction.description || categoryDetails.label}</h4>
                        <div className="flex space-x-3 text-xs text-gray-400">
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                          <span className={categoryDetails.color}>{categoryDetails.label}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className={`font-bold ${transaction.type === 'expense' ? 'text-tertiary-light' : 'text-primary-light'}`}>
                        {transaction.type === 'expense' ? '-' : '+'} ${transaction.amount.toFixed(2)}
                      </span>
                      
                      <div className="flex space-x-1 mt-1">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-xs text-gray-400 hover:text-white transition"
                        >
                          Edit
                        </button>
                        <span className="text-gray-600">|</span>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-xs text-gray-400 hover:text-red-400 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
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
              <button 
                onClick={cancelDelete}
                className="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg font-medium text-white transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium text-white transition"
              >
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