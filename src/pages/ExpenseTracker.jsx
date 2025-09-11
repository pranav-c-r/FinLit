import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { expenseCategories, getCategoryById } from '../data/expenseCategories';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ExpenseTracker = () => {
  const { state, dispatch } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [transactionType, setTransactionType] = useState('expense');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterMonth, setFilterMonth] = useState(new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0'));

  useEffect(() => {
    // Any side effects related to filterMonth can go here if needed
    // For now, just re-render by state update
  }, [filterMonth]);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || !description || !selectedCategory) return;

    const newTransaction = {
      id: Date.now().toString(),
      category: selectedCategory,
      amount: parseFloat(amount),
      description,
      date,
      subcategory: 'Other',
      type: transactionType
    };

    dispatch({
      type: 'ADD_EXPENSE',
      payload: newTransaction
    });

    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setTransactionType('expense');
    setShowAddForm(false);
  };

  const handleDeleteExpense = (id) => {
    dispatch({
      type: 'DELETE_EXPENSE',
      payload: id
    });
  };

  const getFilteredTransactions = () => {
    const [year, month] = filterMonth.split('-');
    return state.expenses.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getFullYear() === parseInt(year) && 
             transactionDate.getMonth() === parseInt(month) - 1;
    });
  };

  const getFilteredExpenses = () => {
    return getFilteredTransactions().filter(transaction => 
      transaction.type === 'expense' || !transaction.type
    );
  };

  const getFilteredIncome = () => {
    return getFilteredTransactions().filter(transaction => 
      transaction.type === 'income'
    );
  };

  const getTotalExpenses = () => {
    return getFilteredExpenses().reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalIncome = () => {
    return getFilteredIncome().reduce((total, income) => total + income.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getExpensesByCategory = () => {
    const expenses = getFilteredExpenses();
    const categoryTotals = {};
    
    expenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });

    return categoryTotals;
  };

  const getChartData = () => {
    const categoryTotals = getExpensesByCategory();
    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    const colors = categories.map(cat => getCategoryById(cat)?.color || '#6B7280');

    return {
      labels: categories.map(cat => getCategoryById(cat)?.name || cat),
      datasets: [
        {
          data: amounts,
          backgroundColor: colors,
          borderColor: colors.map(color => color + '80'),
          borderWidth: 2,
        },
      ],
    };
  };

  const getBarChartData = () => {
    const expenses = getFilteredExpenses();
    const dailyTotals = {};
    
    expenses.forEach(expense => {
      const day = expense.date;
      if (dailyTotals[day]) {
        dailyTotals[day] += expense.amount;
      } else {
        dailyTotals[day] = expense.amount;
      }
    });

    const sortedDays = Object.keys(dailyTotals).sort();
    
    return {
      labels: sortedDays.map(day => new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [
        {
          label: 'Daily Expenses',
          data: sortedDays.map(day => dailyTotals[day]),
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const getInsights = () => {
    const expenses = getFilteredExpenses();
    const total = getTotalExpenses();
    const categoryTotals = getExpensesByCategory();
    
    if (expenses.length === 0) return [];

    const insights = [];
    
    // Highest spending category
    const highestCategory = Object.entries(categoryTotals).reduce((a, b) => a[1] > b[1] ? a : b);
    insights.push({
      type: 'warning',
      message: `${getCategoryById(highestCategory[0])?.name} is your highest spending category at ₹${highestCategory[1].toFixed(2)}`,
      icon: '⚠️'
    });

    // Budget recommendations
    const essentialCategories = expenseCategories.filter(cat => cat.isEssential);
    const essentialTotal = essentialCategories.reduce((total, cat) => {
      return total + (categoryTotals[cat.id] || 0);
    }, 0);
    
    if (essentialTotal > total * 0.7) {
      insights.push({
        type: 'info',
        message: 'Essential expenses are taking up a large portion of your budget. Consider reviewing non-essential spending.',
        icon: '💡'
      });
    }

    // Spending patterns
    if (expenses.length > 7) {
      const recentExpenses = expenses.slice(-7);
      const avgDaily = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0) / 7;
      
      if (avgDaily > total / 30) {
        insights.push({
          type: 'warning',
          message: 'Your recent daily spending is higher than your monthly average. Consider cutting back.',
          icon: '📈'
        });
      }
    }

    return insights;
  };

  const renderExpenseForm = () => {
    if (!showAddForm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-background-dark rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Add New Expense</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Transaction Type</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setTransactionType('expense')}
                  className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${transactionType === 'expense' ? 'bg-red-500 text-white' : 'bg-background-light text-gray-300 border border-accent/30'}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setTransactionType('income')}
                  className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${transactionType === 'income' ? 'bg-green-500 text-white' : 'bg-background-light text-gray-300 border border-accent/30'}`}
                >
                  Income
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-background-light border border-accent/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a category</option>
                {expenseCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-background-light border border-accent/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-background-light border border-accent/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="What did you spend on?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background-light border border-accent/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Add Expense
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text mb-2">Expense Tracker</h1>
        <p className="text-gray-300">Monitor your spending and gain financial insights</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-300">Filter Month:</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-background-dark border border-accent/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Expense</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
          <div className="text-2xl text-red-400 mb-2">💰</div>
          <div className="text-2xl font-bold text-white">₹{getTotalExpenses().toFixed(2)}</div>
          <div className="text-sm text-gray-300">Total Expenses</div>
        </div>
        <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
          <div className="text-2xl text-blue-400 mb-2">📊</div>
          <div className="text-2xl font-bold text-white">{getFilteredExpenses().length}</div>
          <div className="text-sm text-gray-300">Transactions</div>
        </div>
        <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
          <div className="text-2xl text-green-400 mb-2">📅</div>
          <div className="text-2xl font-bold text-white">₹{(getTotalExpenses() / 30).toFixed(2)}</div>
          <div className="text-sm text-gray-300">Daily Average</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
          <h3 className="text-lg font-semibold text-white mb-4">Spending by Category</h3>
          <div className="h-64">
            <Pie data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
          <h3 className="text-lg font-semibold text-white mb-4">Daily Spending Trend</h3>
          <div className="h-64">
            <Bar 
              data={getBarChartData()} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(156, 163, 175, 0.1)'
                    },
                    ticks: {
                      color: '#9CA3AF'
                    }
                  },
                  x: {
                    grid: {
                      color: 'rgba(156, 163, 175, 0.1)'
                    },
                    ticks: {
                      color: '#9CA3AF'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
        <h3 className="text-lg font-semibold text-white mb-4">AI Insights</h3>
        <div className="space-y-3">
          {getInsights().length > 0 ? (
            getInsights().map((insight, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                insight.type === 'warning' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                insight.type === 'info' ? 'bg-blue-500/20 border border-blue-500/30' :
                'bg-green-500/20 border border-green-500/30'
              }`}>
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{insight.icon}</span>
                  <p className="text-white">{insight.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-400">
              <div className="text-4xl mb-2">📊</div>
              <p>Add more expenses to get personalized insights</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Expenses</h3>
        <div className="space-y-3">
          {getFilteredTransactions().length > 0 ? (
            getFilteredTransactions()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 10)
              .map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background-light/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCategoryById(transaction.category)?.icon || (transaction.type === 'income' ? '💸' : '💰')}</div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-gray-400 text-sm">
                        {getCategoryById(transaction.category)?.name || transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <p className="text-white font-semibold mr-4">₹{transaction.amount.toFixed(2)}</p>
                    <button
                      onClick={() => handleDeleteExpense(transaction.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-4">📝</div>
              <p>No expenses recorded for this month</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-4 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Add Your First Expense
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expense Form Modal */}
      {renderExpenseForm()}
    </div>
  );
};

export default ExpenseTracker;
