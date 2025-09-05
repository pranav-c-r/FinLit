import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { expenseCategories, getCategoryById } from '../data/expenseCategories';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ExpenseTracker = () => {
  const { state, dispatch } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterMonth, setFilterMonth] = useState(new Date().getFullYear() + '-' + String(new Date().getMonth() + 1).padStart(2, '0'));
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, analytics, insights

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || !description || !selectedCategory) return;

    const newExpense = {
      id: Date.now().toString(),
      category: selectedCategory,
      amount: parseFloat(amount),
      description,
      date,
      subcategory: 'Other'
    };

    dispatch({
      type: 'ADD_EXPENSE',
      payload: newExpense
    });

    // Reset form
    setAmount('');
    setDescription('');
    setSelectedCategory('');
    setShowAddForm(false);
  };

  const getFilteredExpenses = () => {
    const [year, month] = filterMonth.split('-');
    return state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === parseInt(year) && 
             expenseDate.getMonth() === parseInt(month) - 1;
    });
  };

  const getTotalExpenses = () => {
    return getFilteredExpenses().reduce((total, expense) => total + expense.amount, 0);
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

  const getYearlyExpenses = () => {
    const currentYear = new Date().getFullYear();
    const yearlyExpenses = {};
    
    for (let i = 0; i < 12; i++) {
      const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
      const [year, month] = monthKey.split('-');
      
      const monthlyExpenses = state.expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === parseInt(year) && 
               expenseDate.getMonth() === parseInt(month) - 1;
      });
      
      yearlyExpenses[monthKey] = monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
    }
    
    return yearlyExpenses;
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

    // AI-generated savings tips
    const nonEssentialCategories = expenseCategories.filter(cat => !cat.isEssential);
    const nonEssentialSpending = nonEssentialCategories.reduce((total, cat) => {
      return total + (categoryTotals[cat.id] || 0);
    }, 0);
    
    if (nonEssentialSpending > total * 0.3) {
      insights.push({
        type: 'tip',
        message: `You're spending ₹${nonEssentialSpending.toFixed(2)} on non-essentials. Try reducing this by 20% to save ₹${(nonEssentialSpending * 0.2).toFixed(2)} this month.`,
        icon: '💰'
      });
    }

    // Compare to previous month
    const prevMonth = new Date(filterMonth + '-01');
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;
    
    const prevMonthExpenses = state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === prevMonth.getFullYear() && 
             expenseDate.getMonth() === prevMonth.getMonth();
    });
    
    const prevMonthTotal = prevMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    if (prevMonthTotal > 0) {
      const changePercent = ((total - prevMonthTotal) / prevMonthTotal) * 100;
      
      if (changePercent > 15) {
        insights.push({
          type: 'warning',
          message: `Your spending increased by ${changePercent.toFixed(1)}% compared to last month.`,
          icon: '📉'
        });
      } else if (changePercent < -15) {
        insights.push({
          type: 'success',
          message: `Great job! Your spending decreased by ${Math.abs(changePercent).toFixed(1)}% compared to last month.`,
          icon: '📊'
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

  const renderDashboard = () => {
    return (
      <>
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

        {/* Recent Expenses */}
        <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {getFilteredExpenses().length > 0 ? (
              getFilteredExpenses()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 10)
                .map((expense, index) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-background-light/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{getCategoryById(expense.category)?.icon || '💰'}</div>
                      <div>
                        <p className="text-white font-medium">{expense.description}</p>
                        <p className="text-gray-400 text-sm">
                          {getCategoryById(expense.category)?.name || expense.category} • {new Date(expense.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">₹{expense.amount.toFixed(2)}</p>
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
      </>
    );
  };

  const renderAnalytics = () => {
    const yearlyExpenses = getYearlyExpenses();
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Expense Analytics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
            <h3 className="text-lg font-semibold text-white mb-4">Monthly Spending Overview</h3>
            <div className="h-96">
              <Bar 
                data={{
                  labels: Object.keys(yearlyExpenses).map(month => {
                    const date = new Date(month + '-01');
                    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  }),
                  datasets: [
                    {
                      label: 'Monthly Expenses',
                      data: Object.values(yearlyExpenses),
                      backgroundColor: 'rgba(139, 92, 246, 0.8)',
                      borderColor: 'rgba(139, 92, 246, 1)',
                      borderWidth: 1,
                    },
                  ],
                }} 
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
          
          <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
            <h3 className="text-lg font-semibold text-white mb-4">Category Breakdown</h3>
            <div className="h-96">
              <Pie 
                data={getChartData()} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        color: '#9CA3AF'
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
          <h3 className="text-lg font-semibold text-white mb-4">Expense Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs uppercase bg-background-light/20 text-gray-300">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredExpenses()
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((expense) => (
                    <tr key={expense.id} className="border-b border-accent/30">
                      <td className="px-4 py-3">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className="mr-2">{getCategoryById(expense.category)?.icon}</span>
                          {getCategoryById(expense.category)?.name || expense.category}
                        </div>
                      </td>
                      <td className="px-4 py-3">{expense.description}</td>
                      <td className="px-4 py-3 text-right">₹{expense.amount.toFixed(2)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderInsights = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">AI-Powered Financial Insights</h2>
        
        <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
          <h3 className="text-lg font-semibold text-white mb-4">Smart Recommendations</h3>
          <div className="space-y-3">
            {getInsights().length > 0 ? (
              getInsights().map((insight, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  insight.type === 'warning' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                  insight.type === 'info' ? 'bg-blue-500/20 border border-blue-500/30' :
                  insight.type === 'success' ? 'bg-green-500/20 border border-green-500/30' :
                  'bg-purple-500/20 border border-purple-500/30'
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
            <h3 className="text-lg font-semibold text-white mb-4">Savings Tips</h3>
            <div className="space-y-4">
              <div className="p-3 bg-background-light/20 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">🍔</span>
                  <h4 className="text-white font-medium">Reduce Dining Out</h4>
                </div>
                <p className="text-gray-300 text-sm">Try cooking at home more often. Meal prepping can save you up to 50% on food expenses.</p>
              </div>
              
              <div className="p-3 bg-background-light/20 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">📱</span>
                  <h4 className="text-white font-medium">Review Subscriptions</h4>
                </div>
                <p className="text-gray-300 text-sm">Cancel unused subscriptions. The average person spends ₹1500/month on unused services.</p>
              </div>
              
              <div className="p-3 bg-background-light/20 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">🛒</span>
                  <h4 className="text-white font-medium">Smart Shopping</h4>
                </div>
                <p className="text-gray-300 text-sm">Plan your shopping with a list and avoid impulse purchases. This can reduce spending by 20-30%.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
            <h3 className="text-lg font-semibold text-white mb-4">Budget Planning</h3>
            <div className="space-y-4">
              <div className="p-3 bg-background-light/20 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">📅</span>
                  <h4 className="text-white font-medium">30-Day Rule</h4>
                </div>
                <p className="text-gray-300 text-sm">Wait 30 days before making non-essential purchases. This reduces impulse buying by 75%.</p>
              </div>
              
              <div className="p-3 bg-background-light/20 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">💰</span>
                  <h4 className="text-white font-medium">50/30/20 Rule</h4>
                </div>
                <p className="text-gray-300 text-sm">Allocate 50% to needs, 30% to wants, and 20% to savings. Adjust based on your financial goals.</p>
              </div>
              
              <div className="p-3 bg-background-light/20 rounded-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-xl">🎯</span>
                  <h4 className="text-white font-medium">Set Goals</h4>
                </div>
                <p className="text-gray-300 text-sm">Define specific financial targets. People with clear goals save 3x more than those without.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-background-dark/80 border-r border-accent/30 p-4 hidden md:block">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold gradient-text">Expense Tracker</h1>
          <p className="text-gray-400 text-sm">Manage your finances</p>
        </div>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === 'dashboard' 
                ? 'bg-primary text-white' 
                : 'text-gray-300 hover:bg-background-light/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveView('analytics')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === 'analytics' 
                ? 'bg-primary text-white' 
                : 'text-gray-300 hover:bg-background-light/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Analytics</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveView('insights')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === 'insights' 
                ? 'bg-primary text-white' 
                : 'text-gray-300 hover:bg-background-light/20'
            }`}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>AI Insights</span>
            </div>
          </button>
        </nav>
        
        <div className="mt-8 p-4 bg-background-light/20 rounded-lg">
          <p className="text-gray-300 text-sm">Track your expenses to achieve financial freedom.</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-background-dark/50 p-3 rounded-lg">
          <h1 className="text-xl font-bold gradient-text">Expense Tracker</h1>
          <select
            value={activeView}
            onChange={(e) => setActiveView(e.target.value)}
            className="bg-background-light border border-accent/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="dashboard">Dashboard</option>
            <option value="analytics">Analytics</option>
            <option value="insights">AI Insights</option>
          </select>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
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
        
        {/* Content based on active view */}
        {activeView === 'dashboard' && renderDashboard()}
        {activeView === 'analytics' && renderAnalytics()}
        {activeView === 'insights' && renderInsights()}
        
        {/* Expense Form Modal */}
        {renderExpenseForm()}
      </div>
    </div>
  );
};

export default ExpenseTracker;