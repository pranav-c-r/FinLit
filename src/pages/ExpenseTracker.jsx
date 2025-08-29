import React, { useState } from 'react';
import ExpenseTrackerComponent from '../components/expenses/ExpenseTracker';
import ExpenseAnalytics from '../components/expenses/ExpenseAnalytics';
import { motion } from 'framer-motion';

const ExpenseTrackerPage = () => {
  const [showTips, setShowTips] = useState(false);

  // Financial tips for expense management
  const financialTips = [
    { id: 1, tip: "Use the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.", icon: "💰" },
    { id: 2, tip: "Track every expense, no matter how small. Small purchases add up quickly!", icon: "📝" },
    { id: 3, tip: "Set up automatic transfers to your savings account on payday.", icon: "🏦" },
    { id: 4, tip: "Review your subscriptions monthly and cancel unused services.", icon: "🔄" },
    { id: 5, tip: "Use cash for discretionary spending to make your spending more tangible.", icon: "💵" },
  ];

  return (
    <div className="px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Expense Tracker</h1>
          <p className="text-gray-300">
            Track your expenses, analyze your spending habits, and gain insights to improve your financial health.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="gradient-button-primary flex items-center gap-2"
          onClick={() => setShowTips(!showTips)}
        >
          <span>💡</span>
          <span>{showTips ? 'Hide Tips' : 'Show Tips'}</span>
        </motion.button>
      </div>

      {showTips && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20"
        >
          <h2 className="text-xl font-bold gradient-text-secondary mb-4">Financial Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {financialTips.map((tip) => (
              <motion.div
                key={tip.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 bg-background-dark/50 rounded-lg border border-accent/20 flex items-start gap-3"
              >
                <div className="text-2xl">{tip.icon}</div>
                <p className="text-gray-300 text-sm">{tip.tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Pass an empty array so .filter won't crash */}
          <ExpenseTrackerComponent expenses={[]} />
        </div>

        <div>
          <ExpenseAnalytics />
        </div>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-tertiary/10 to-primary/10 rounded-xl border border-tertiary/20">
        <h2 className="text-xl font-bold gradient-text mb-4">Expense Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-background-dark/50 rounded-lg border border-accent/20">
            <h3 className="text-lg font-semibold text-primary-light mb-2">No-Spend Challenge</h3>
            <p className="text-gray-300 mb-3">Go for 7 days without spending on non-essentials. Track your progress here!</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Reward: 500 XP</span>
              <button className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary-light rounded-lg text-sm transition-colors">
                Start Challenge
              </button>
            </div>
          </div>

          <div className="p-4 bg-background-dark/50 rounded-lg border border-accent/20">
            <h3 className="text-lg font-semibold text-primary-light mb-2">Budget Master</h3>
            <p className="text-gray-300 mb-3">Stay under your set budget for 30 days straight. Track all expenses!</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Reward: 1000 XP</span>
              <button className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary-light rounded-lg text-sm transition-colors">
                Start Challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTrackerPage;
