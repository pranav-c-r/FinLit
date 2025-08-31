import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const PiggyBank = () => {
  const { state, dispatch } = useApp();
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showBreakForm, setShowBreakForm] = useState(false);

  const handleDeposit = (e) => {
    e.preventDefault();
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;

    const amount = parseFloat(depositAmount);
    
    dispatch({
      type: 'DEPOSIT_TO_PIGGY_BANK',
      payload: {
        amount,
        date: new Date().toISOString()
      }
    });

    // Reset form
    setDepositAmount('');
    setShowDepositForm(false);
  };

  const handleBreakPiggyBank = (e) => {
    e.preventDefault();
    
    dispatch({
      type: 'BREAK_PIGGY_BANK',
      payload: {
        date: new Date().toISOString()
      }
    });

    setShowBreakForm(false);
  };

  const getTotalDeposits = () => {
    return state.piggyBank?.history?.filter(h => h.type === 'deposit')
      .reduce((total, h) => total + h.amount, 0) || 0;
  };

  const getTotalWithdrawals = () => {
    return state.piggyBank?.history?.filter(h => h.type === 'withdraw')
      .reduce((total, h) => total + h.amount, 0) || 0;
  };

  const getSavingsStreak = () => {
    const deposits = state.piggyBank?.history?.filter(h => h.type === 'deposit') || [];
    if (deposits.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (deposits.some(d => d.date.startsWith(dateStr))) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getSavingsGoal = () => {
    // Calculate a savings goal based on user's level and progress
    const baseGoal = state.user.level * 1000; // 1000 per level
    const progress = Math.min(getTotalDeposits() / baseGoal, 1);
    return { goal: baseGoal, progress, current: getTotalDeposits() };
  };

  const getRecentHistory = () => {
    return state.piggyBank?.history?.slice(0, 5) || [];
  };

  const renderDepositForm = () => {
    if (!showDepositForm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-background-dark rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Add Money to Piggy Bank</h3>
            <button
              onClick={() => setShowDepositForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleDeposit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="w-full bg-background-light border border-accent/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Deposit
              </button>
              <button
                type="button"
                onClick={() => setShowDepositForm(false)}
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

  const renderBreakForm = () => {
    if (!showBreakForm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-background-dark rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Break Piggy Bank</h3>
            <button
              onClick={() => setShowBreakForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-300 mb-2">Are you sure you want to break your piggy bank?</p>
            <p className="text-white font-medium">You'll receive ₹{state.piggyBank?.balance || 0} in coins!</p>
          </div>

          <form onSubmit={handleBreakPiggyBank} className="space-y-4">
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
              >
                Break Piggy Bank
              </button>
              <button
                type="button"
                onClick={() => setShowBreakForm(false)}
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
        <h2 className="text-3xl font-bold gradient-text mb-2">Piggy Bank</h2>
        <p className="text-gray-300">Save money and earn rewards for your financial discipline</p>
      </div>

      {/* Main Piggy Bank Display */}
      <div className="bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-2xl border border-yellow-400/30 p-8 text-center">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-6xl shadow-2xl shadow-yellow-400/25">
          🏦
        </div>
        
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">Current Balance</h3>
          <div className="text-4xl font-bold text-yellow-400">₹{state.piggyBank?.balance || 0}</div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowDepositForm(true)}
            className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Money</span>
          </button>
          
          {state.piggyBank?.balance > 0 && (
            <button
              onClick={() => setShowBreakForm(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Break Bank</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
          <div className="text-2xl text-green-400 mb-2">💰</div>
          <div className="text-xl font-bold text-white">₹{getTotalDeposits().toFixed(2)}</div>
          <div className="text-sm text-gray-300">Total Saved</div>
        </div>
        
        <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
          <div className="text-2xl text-blue-400 mb-2">📊</div>
          <div className="text-xl font-bold text-white">{state.piggyBank?.history?.length || 0}</div>
          <div className="text-sm text-gray-300">Transactions</div>
        </div>
        
        <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
          <div className="text-2xl text-yellow-400 mb-2">🔥</div>
          <div className="text-xl font-bold text-white">{getSavingsStreak()}</div>
          <div className="text-sm text-gray-300">Day Streak</div>
        </div>
        
        <div className="bg-background-dark/50 p-4 rounded-lg border border-accent/30 text-center">
          <div className="text-2xl text-purple-400 mb-2">🎯</div>
          <div className="text-xl font-bold text-white">{Math.round(getSavingsGoal().progress * 100)}%</div>
          <div className="text-sm text-gray-300">Goal Progress</div>
        </div>
      </div>

      {/* Savings Goal */}
      <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
        <h3 className="text-lg font-semibold text-white mb-4">Savings Goal</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Progress</span>
            <span>₹{getSavingsGoal().current.toFixed(2)} / ₹{getSavingsGoal().goal.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(getSavingsGoal().progress * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        {getSavingsGoal().progress >= 1 && (
          <div className="text-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-green-400 font-medium">Congratulations! You've reached your savings goal!</p>
          </div>
        )}
      </div>

      {/* Recent History */}
      <div className="bg-background-dark/50 p-6 rounded-lg border border-accent/30">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {getRecentHistory().length > 0 ? (
            getRecentHistory().map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background-light/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl ${
                    entry.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {entry.type === 'deposit' ? '💰' : '💸'}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {entry.type === 'deposit' ? 'Deposited' : 'Withdrew'} ₹{entry.amount.toFixed(2)}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  entry.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {entry.type === 'deposit' ? '+' : '-'}₹{entry.amount.toFixed(2)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-4">📝</div>
              <p>No activity yet. Start saving to see your history!</p>
            </div>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-yellow-400/10 to-amber-500/10 rounded-xl border border-yellow-400/20 p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">Why Use Piggy Bank?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎯</div>
            <div>
              <h4 className="font-semibold text-white">Build Savings Habit</h4>
              <p className="text-sm text-gray-300">Develop consistent saving behavior</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🏆</div>
            <div>
              <h4 className="font-semibold text-white">Earn Rewards</h4>
              <p className="text-sm text-gray-300">Get XP and coins for saving</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">📈</div>
            <div>
              <h4 className="font-semibold text-white">Track Progress</h4>
              <p className="text-sm text-gray-300">Monitor your savings journey</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💡</div>
            <div>
              <h4 className="font-semibold text-white">Financial Discipline</h4>
              <p className="text-sm text-gray-300">Learn to control spending</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      {renderDepositForm()}
      {renderBreakForm()}
    </div>
  );
};

export default PiggyBank;