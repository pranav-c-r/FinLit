import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

const PiggyBank = () => {
  const { state, dispatch } = useApp();
  const [depositAmount, setDepositAmount] = useState('');
  const [showConfirmBreak, setShowConfirmBreak] = useState(false);
  const [piggyAnimation, setPiggyAnimation] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Get piggy bank data from context or initialize if not exists
  useEffect(() => {
    if (!state.piggyBank) {
      dispatch({
        type: 'INIT_PIGGY_BANK',
        payload: {
          balance: 0,
          lastDeposit: null,
          history: []
        }
      });
    }
  }, [state, dispatch]);

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      setMessage({ text: 'Please enter a valid amount', type: 'error' });
      return;
    }

    // Add to piggy bank
    dispatch({
      type: 'DEPOSIT_TO_PIGGY_BANK',
      payload: {
        amount,
        date: new Date().toISOString()
      }
    });

    // Show animation and success message
    setPiggyAnimation('shake');
    setMessage({ text: `$${amount.toFixed(2)} added to your piggy bank!`, type: 'success' });
    setDepositAmount('');

    // Reset animation after it completes
    setTimeout(() => setPiggyAnimation(''), 1000);
  };

  const handleBreakPiggy = () => {
    setShowConfirmBreak(true);
  };

  const confirmBreakPiggy = () => {
    // Break the piggy bank and withdraw all money
    const totalAmount = state.piggyBank?.balance || 0;
    
    dispatch({
      type: 'BREAK_PIGGY_BANK',
      payload: {
        date: new Date().toISOString()
      }
    });

    // Show animation and success message
    setPiggyAnimation('break');
    setMessage({ text: `Piggy bank broken! You've withdrawn $${totalAmount.toFixed(2)}`, type: 'success' });
    setShowConfirmBreak(false);

    // Reset animation after it completes
    setTimeout(() => setPiggyAnimation(''), 2000);
  };

  const cancelBreakPiggy = () => {
    setShowConfirmBreak(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="game-panel p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold gradient-text mb-6">Piggy Bank</h2>
      
      {/* Piggy Bank Display */}
      <div className="flex flex-col items-center mb-8">
        <div className={`relative ${piggyAnimation === 'shake' ? 'animate-bounce-slow' : ''} ${piggyAnimation === 'break' ? 'animate-ping' : ''}`}>
          <div className="text-6xl mb-2">🐷</div>
          {state.piggyBank?.balance > 0 && (
            <div className="absolute -top-2 -right-2 bg-primary-light text-xs text-white font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
              $
            </div>
          )}
        </div>
        
        <div className="text-center mt-2">
          <p className="text-xl font-bold gradient-text-secondary">
            ${state.piggyBank?.balance?.toFixed(2) || '0.00'}
          </p>
          <p className="text-sm text-gray-400">
            Last Deposit: {formatDate(state.piggyBank?.lastDeposit)}
          </p>
        </div>
      </div>

      {/* Deposit Form */}
      <div className="mb-6">
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount"
              className="w-full pl-8 pr-3 py-2 bg-background-light border border-accent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>
          <button
            onClick={handleDeposit}
            className="gradient-button-primary"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Add money to your piggy bank. You can only withdraw by breaking it!
        </p>
      </div>

      {/* Break Piggy Bank Button */}
      <div className="text-center">
        <button
          onClick={handleBreakPiggy}
          disabled={!state.piggyBank?.balance}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${state.piggyBank?.balance ? 'bg-secondary hover:bg-secondary-light text-white' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
        >
          Break Piggy Bank
        </button>
        <p className="text-xs text-gray-400 mt-1">
          Breaking your piggy bank will withdraw all your savings at once.
        </p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mt-4 p-3 rounded-lg ${message.type === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-primary/20 text-primary-light'}`}>
          {message.text}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmBreak && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="game-panel p-6 max-w-sm mx-auto">
            <h3 className="text-xl font-bold mb-4">Break Piggy Bank?</h3>
            <p className="mb-6">Are you sure you want to break your piggy bank and withdraw ${state.piggyBank?.balance?.toFixed(2)}? You can't undo this action!</p>
            <div className="flex space-x-4">
              <button
                onClick={cancelBreakPiggy}
                className="flex-1 px-4 py-2 bg-background-light border border-accent rounded-lg hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={confirmBreakPiggy}
                className="flex-1 gradient-button-secondary"
              >
                Break It!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {state.piggyBank?.history?.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
          <div className="max-h-40 overflow-y-auto">
            {state.piggyBank.history.map((transaction, index) => (
              <div key={index} className="flex justify-between py-2 border-b border-accent/30 text-sm">
                <div>
                  <span className={transaction.type === 'deposit' ? 'text-primary-light' : 'text-secondary-light'}>
                    {transaction.type === 'deposit' ? '+ $' : '- $'}{transaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="text-gray-400">{formatDate(transaction.date)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PiggyBank;