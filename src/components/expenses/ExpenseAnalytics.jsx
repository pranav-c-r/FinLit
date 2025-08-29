import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

// Mock chart components - in a real app, you would use a charting library like Chart.js or Recharts
const PieChart = ({ data }) => (
  <div className="relative w-full h-48 flex items-center justify-center">
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {data.map((item, index) => {
          const startAngle = index > 0 
            ? data.slice(0, index).reduce((sum, d) => sum + d.value, 0) / data.reduce((sum, d) => sum + d.value, 0) * 360 
            : 0;
          const endAngle = data.slice(0, index + 1).reduce((sum, d) => sum + d.value, 0) / data.reduce((sum, d) => sum + d.value, 0) * 360;
          
          const x1 = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
          const y1 = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
          const x2 = 50 + 40 * Math.cos(Math.PI * endAngle / 180);
          const y2 = 50 + 40 * Math.sin(Math.PI * endAngle / 180);
          
          const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
          
          return (
            <path 
              key={index}
              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
              fill={item.color}
              stroke="#1f2937"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
    </div>
    <div className="absolute inset-0 flex items-center justify-center text-center">
      <div className="text-lg font-bold text-white">
        ${data.reduce((sum, item) => sum + item.value, 0).toFixed(2)}
      </div>
    </div>
  </div>
);

const BarChart = ({ data, maxValue }) => (
  <div className="w-full h-48 flex items-end justify-between space-x-2">
    {data.map((item, index) => {
      const height = (item.value / maxValue) * 100;
      
      return (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="w-8 rounded-t-lg" 
            style={{ 
              height: `${height}%`, 
              backgroundColor: item.color,
              minHeight: '4px'
            }}
          />
          <div className="text-xs text-gray-400 mt-1 truncate w-12 text-center">{item.label}</div>
        </div>
      );
    })}
  </div>
);

const ExpenseAnalytics = () => {
  const { state } = useApp();
  const [timeRange, setTimeRange] = useState('month');
  const [chartType, setChartType] = useState('category');
  
  // Generate analytics data based on transactions
  const getAnalyticsData = () => {
    if (!state.expenses?.transactions || state.expenses.transactions.length === 0) {
      return {
        categoryData: [],
        timeData: [],
        totalExpense: 0,
        totalIncome: 0,
        balance: 0,
        topExpenseCategories: [],
        insights: []
      };
    }
    
    // Filter transactions based on time range
    const now = new Date();
    const transactions = state.expenses.transactions.filter(transaction => {
      const txDate = new Date(transaction.date);
      
      if (timeRange === 'week') {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return txDate >= weekAgo;
      }
      
      if (timeRange === 'month') {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return txDate >= monthAgo;
      }
      
      if (timeRange === 'year') {
        const yearAgo = new Date(now);
        yearAgo.setFullYear(now.getFullYear() - 1);
        return txDate >= yearAgo;
      }
      
      return true; // 'all' time range
    });
    
    // Calculate totals
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const balance = totalIncome - totalExpense;
    
    // Group expenses by category
    const expensesByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        const category = t.category;
        if (!acc[category]) acc[category] = 0;
        acc[category] += t.amount;
        return acc;
      }, {});
    
    // Create category data for pie chart
    const categoryData = Object.entries(expensesByCategory).map(([category, amount]) => {
      const categoryInfo = state.expenses.categories.expense.find(c => c.id === category) || 
                          { label: 'Unknown', color: '#6b7280' };
      
      return {
        label: categoryInfo.label,
        value: amount,
        color: categoryInfo.color.includes('text-') 
          ? categoryInfo.color.replace('text-', 'bg-').split('-')[1] 
          : categoryInfo.color
      };
    });
    
    // Group expenses by time period
    const expensesByTime = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        let timePeriod;
        const date = new Date(t.date);
        
        if (timeRange === 'week') {
          // Group by day of week
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          timePeriod = days[date.getDay()];
        } else if (timeRange === 'month') {
          // Group by week of month
          const weekNum = Math.ceil(date.getDate() / 7);
          timePeriod = `Week ${weekNum}`;
        } else if (timeRange === 'year') {
          // Group by month
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          timePeriod = months[date.getMonth()];
        } else {
          // Group by month-year for all time
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          timePeriod = `${months[date.getMonth()]} ${date.getFullYear()}`;
        }
        
        if (!acc[timePeriod]) acc[timePeriod] = 0;
        acc[timePeriod] += t.amount;
        return acc;
      }, {});
    
    // Create time data for bar chart
    const timeData = Object.entries(expensesByTime).map(([period, amount]) => ({
      label: period,
      value: amount,
      color: '#ec4899' // Use primary color for all bars
    }));
    
    // Sort time data chronologically
    if (timeRange === 'week') {
      const dayOrder = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
      timeData.sort((a, b) => dayOrder[a.label] - dayOrder[b.label]);
    } else if (timeRange === 'month') {
      timeData.sort((a, b) => parseInt(a.label.split(' ')[1]) - parseInt(b.label.split(' ')[1]));
    } else if (timeRange === 'year') {
      const monthOrder = { 'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11 };
      timeData.sort((a, b) => monthOrder[a.label] - monthOrder[b.label]);
    }
    
    // Get top expense categories
    const topExpenseCategories = Object.entries(expensesByCategory)
      .map(([category, amount]) => {
        const categoryInfo = state.expenses.categories.expense.find(c => c.id === category) || 
                            { label: 'Unknown', icon: '❓' };
        
        return {
          category: categoryInfo.label,
          icon: categoryInfo.icon,
          amount
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);
    
    // Generate insights
    const insights = [];
    
    // Insight 1: Highest spending category
    if (topExpenseCategories.length > 0) {
      insights.push(`Your highest spending is on ${topExpenseCategories[0].category} (${topExpenseCategories[0].icon} $${topExpenseCategories[0].amount.toFixed(2)}).`);
    }
    
    // Insight 2: Income vs Expense
    if (totalIncome > 0 && totalExpense > 0) {
      const savingsRate = ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1);
      if (savingsRate > 20) {
        insights.push(`Great job! You're saving ${savingsRate}% of your income.`);
      } else if (savingsRate > 0) {
        insights.push(`You're saving ${savingsRate}% of your income. Try to aim for 20%.`);
      } else {
        insights.push(`You're spending more than you earn. Try to reduce expenses.`);
      }
    }
    
    // Insight 3: Spending trend
    if (timeData.length > 1) {
      const firstPeriodSpending = timeData[0].value;
      const lastPeriodSpending = timeData[timeData.length - 1].value;
      
      if (lastPeriodSpending < firstPeriodSpending) {
        insights.push(`Your spending is decreasing - keep up the good work!`);
      } else if (lastPeriodSpending > firstPeriodSpending * 1.2) {
        insights.push(`Your spending has increased by ${((lastPeriodSpending / firstPeriodSpending - 1) * 100).toFixed(1)}% since ${timeData[0].label}.`);
      }
    }
    
    return {
      categoryData,
      timeData,
      totalExpense,
      totalIncome,
      balance,
      topExpenseCategories,
      insights
    };
  };
  
  const analytics = getAnalyticsData();
  
  // If no transactions, show empty state
  if (analytics.categoryData.length === 0) {
    return (
      <div className="game-panel p-6">
        <h2 className="text-2xl font-bold gradient-text-secondary mb-6">Analytics</h2>
        
        <div className="text-center py-8 text-gray-400">
          <p className="mb-4">No transaction data available yet.</p>
          <p>Add some transactions to see your spending analytics!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-panel p-6">
      <h2 className="text-2xl font-bold gradient-text-secondary mb-6">Analytics</h2>
      
      {/* Time Range Selector */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          {['week', 'month', 'year', 'all'].map((range) => (
            <button
              key={range}
              className={`px-3 py-1 text-sm font-medium ${timeRange === range ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'} ${range === 'week' ? 'rounded-l-md' : ''} ${range === 'all' ? 'rounded-r-md' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="game-card p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Income</p>
          <p className="text-lg font-bold text-primary-light">${analytics.totalIncome.toFixed(2)}</p>
        </div>
        
        <div className="game-card p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Expenses</p>
          <p className="text-lg font-bold text-tertiary-light">${analytics.totalExpense.toFixed(2)}</p>
        </div>
        
        <div className="game-card p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Balance</p>
          <p className={`text-lg font-bold ${analytics.balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${analytics.balance.toFixed(2)}
          </p>
        </div>
      </div>
      
      {/* Chart Type Selector */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            className={`px-3 py-1 text-sm font-medium rounded-l-md ${chartType === 'category' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setChartType('category')}
          >
            By Category
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium rounded-r-md ${chartType === 'time' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setChartType('time')}
          >
            Over Time
          </button>
        </div>
      </div>
      
      {/* Chart */}
      <div className="mb-6">
        {chartType === 'category' ? (
          <>
            <PieChart data={analytics.categoryData} />
            
            <div className="mt-4 space-y-2">
              {analytics.categoryData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium text-white">${item.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <BarChart 
            data={analytics.timeData} 
            maxValue={Math.max(...analytics.timeData.map(item => item.value))} 
          />
        )}
      </div>
      
      {/* Top Expenses */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Top Expenses</h3>
        
        <div className="space-y-2">
          {analytics.topExpenseCategories.map((item, index) => (
            <div key={index} className="game-card p-2 flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-xl mr-2">{item.icon}</span>
                <span className="text-sm text-gray-300">{item.category}</span>
              </div>
              <span className="text-sm font-medium text-white">${item.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* AI Insights */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-3">AI Insights</h3>
        
        <div className="game-card p-4 bg-gradient-to-br from-primary/20 to-tertiary/20">
          {analytics.insights.length > 0 ? (
            <ul className="space-y-2">
              {analytics.insights.map((insight, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-light mr-2">💡</span>
                  <span className="text-gray-300 text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-center">Add more transactions to get personalized insights!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalytics;