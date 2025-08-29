import React, { useState, useEffect } from 'react';

const ExpenseAllocation = ({ jobType, salary, onComplete }) => {
  // Define expense categories based on job type
  const getExpenseCategories = () => {
    switch (jobType) {
      case 'mnc':
        return [
          { id: 'rent', name: 'Rent/Household', min: 10000, max: 30000, emoji: '🏠' },
          { id: 'savings', name: 'Savings/Investments', min: 5000, max: 30000, emoji: '💰' },
          { id: 'lifestyle', name: 'Lifestyle/Entertainment', min: 5000, max: 20000, emoji: '🎉' },
          { id: 'family', name: 'Family Support', min: 0, max: 20000, emoji: '👨‍👩‍👦' },
        ];
      case 'startup':
        return [
          { id: 'rent', name: 'Rent/PG', min: 5000, max: 10000, emoji: '🏠' },
          { id: 'food', name: 'Food & Daily Needs', min: 5000, max: 10000, emoji: '🍽️' },
          { id: 'savings', name: 'Savings (if possible)', min: 0, max: 5000, emoji: '💰' },
          { id: 'travel', name: 'Travel/Extra Costs', min: 2000, max: 5000, emoji: '🚗' },
        ];
      case 'government':
        return [
          { id: 'allowance', name: 'Monthly Allowance from Parents', selected: false, emoji: '👨‍👩‍👦' },
          { id: 'parttime', name: 'Part-time Tuition/Freelancing', selected: false, emoji: '💻' },
          { id: 'hostel', name: 'Live in Hostel with Minimum Expenses', selected: false, emoji: '🏫' },
        ];
      default:
        return [];
    }
  };

  const [categories, setCategories] = useState(getExpenseCategories());
  const [allocations, setAllocations] = useState({});
  const [remaining, setRemaining] = useState(salary || 0);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize allocations
  useEffect(() => {
    if (jobType === 'government') {
      // For government, we just need to track selection, not amounts
      const initialAllocations = {};
      categories.forEach(cat => {
        initialAllocations[cat.id] = false;
      });
      setAllocations(initialAllocations);
    } else {
      // For other jobs, initialize with minimum values
      const initialAllocations = {};
      let initialTotal = 0;
      categories.forEach(cat => {
        initialAllocations[cat.id] = cat.min;
        initialTotal += cat.min;
      });
      setAllocations(initialAllocations);
      setRemaining(salary - initialTotal);
    }
  }, [jobType, salary, categories]);

  const handleAllocationChange = (id, value) => {
    if (jobType === 'government') {
      // For government, toggle selection
      setAllocations(prev => {
        const newAllocations = { ...prev };
        // Deselect all other options
        Object.keys(newAllocations).forEach(key => {
          newAllocations[key] = false;
        });
        // Select the chosen option
        newAllocations[id] = true;
        return newAllocations;
      });
    } else {
      // For other jobs, update allocation amount
      const numValue = parseInt(value) || 0;
      
      // Calculate what the new remaining would be
      let newTotal = 0;
      const newAllocations = { ...allocations, [id]: numValue };
      Object.values(newAllocations).forEach(val => {
        newTotal += val;
      });
      
      const newRemaining = salary - newTotal;
      
      // Only update if we have enough funds or if we're decreasing an allocation
      if (newRemaining >= 0 || numValue < allocations[id]) {
        setAllocations(newAllocations);
        setRemaining(newRemaining);
        setError('');
      } else {
        setError('Not enough funds remaining!');
      }
    }
  };

  const handleSubmit = () => {
    // Validate the allocations
    if (jobType === 'government') {
      // For government, ensure one option is selected
      const hasSelection = Object.values(allocations).some(val => val === true);
      if (!hasSelection) {
        setError('Please select one option');
        return;
      }
      
      // Generate feedback based on selection
      const selectedOption = Object.keys(allocations).find(key => allocations[key]);
      let feedbackText = '';
      let result = {};
      
      switch (selectedOption) {
        case 'allowance':
          feedbackText = 'Taking allowance from parents shows you value family support. Remember to use this opportunity to study hard and succeed in your exams.';
          result = { risk: 'low', independence: 'low', stress: 'low' };
          break;
        case 'parttime':
          feedbackText = 'Choosing to work part-time shows great independence and work ethic. Balance your time carefully between work and studies.';
          result = { risk: 'medium', independence: 'high', stress: 'high' };
          break;
        case 'hostel':
          feedbackText = 'Living in a hostel with minimum expenses is a practical choice. This will teach you valuable budgeting skills.';
          result = { risk: 'low', independence: 'medium', stress: 'medium' };
          break;
        default:
          feedbackText = 'Please make a selection';
      }
      
      setFeedback({ text: feedbackText, result });
    } else {
      // For other jobs, ensure all funds are allocated
      if (remaining !== 0) {
        setError(`Please allocate all funds. You still have ₹${remaining} remaining.`);
        return;
      }
      
      // Generate feedback based on allocations
      let feedbackText = '';
      let result = {};
      
      if (jobType === 'mnc') {
        const savingsPercent = (allocations.savings / salary) * 100;
        const lifestylePercent = (allocations.lifestyle / salary) * 100;
        
        if (savingsPercent >= 30) {
          feedbackText = 'Excellent job saving! Your future self will thank you for prioritizing savings and investments.';
          result = { financial_health: 'excellent', future_security: 'high' };
        } else if (savingsPercent >= 20) {
          feedbackText = 'Good balance of saving and spending. You are on the right track to financial stability.';
          result = { financial_health: 'good', future_security: 'medium' };
        } else if (lifestylePercent > 25) {
          feedbackText = 'Be careful with lifestyle expenses. While enjoying life is important, saving for the future is crucial too.';
          result = { financial_health: 'concerning', future_security: 'low' };
        } else {
          feedbackText = 'Consider reviewing your budget to increase your savings rate if possible.';
          result = { financial_health: 'fair', future_security: 'medium' };
        }
      } else if (jobType === 'startup') {
        const savingsAmount = allocations.savings || 0;
        
        if (savingsAmount > 0) {
          feedbackText = 'Impressive that you are saving despite a tight budget! This discipline will serve you well as your income grows.';
          result = { financial_discipline: 'high', adaptability: 'excellent' };
        } else if (allocations.rent < 7000) {
          feedbackText = 'You are being frugal with housing costs, which is smart when income is limited. This gives you more flexibility in other areas.';
          result = { financial_discipline: 'good', adaptability: 'good' };
        } else if (allocations.travel > 4000) {
          feedbackText = 'Consider reducing travel/extra costs to free up money for savings or emergencies.';
          result = { financial_discipline: 'needs work', adaptability: 'fair' };
        } else {
          feedbackText = 'Living on a startup salary requires careful planning. Keep looking for ways to increase your income while managing expenses.';
          result = { financial_discipline: 'fair', adaptability: 'good' };
        }
      }
      
      setFeedback({ text: feedbackText, result });
    }
    
    setIsSubmitted(true);
  };

  const handleComplete = () => {
    // Pass the results back to the parent component
    onComplete({
      allocations,
      feedback: feedback?.result || {},
      selectedOption: jobType === 'government' ? 
        Object.keys(allocations).find(key => allocations[key]) : null
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] to-[#111827] text-white p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-white">
            {jobType === 'government' ? 'Choose Your Financial Support Plan' : 'Allocate Your Monthly Salary'}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#58cc02] to-[#2fa946] rounded-full mx-auto"></div>
        </div>
        
        {/* Salary Overview for non-government jobs */}
        {jobType !== 'government' && (
          <div className="bg-gradient-to-r from-[#252547] to-[#2d3748] p-6 rounded-2xl border border-[#374151] mb-6 shadow-lg">
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <p className="text-xl font-bold text-white mb-2">Monthly Salary</p>
              <p className="text-3xl font-bold text-[#58cc02] mb-4">₹{salary.toLocaleString()}</p>
              
              {/* Remaining Balance */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <p className="text-sm text-gray-300 mb-2">Remaining to Allocate</p>
                <p className={`text-2xl font-bold ${remaining < 0 ? 'text-red-400' : remaining === 0 ? 'text-[#58cc02]' : 'text-yellow-400'}`}>
                  ₹{remaining.toLocaleString()}
                </p>
                
                {/* Progress Bar */}
                <div className="mt-4 h-2 bg-[#374151] rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${remaining === 0 ? 'bg-[#58cc02]' : 'bg-gradient-to-r from-[#58cc02] to-[#2fa946]'}`}
                    style={{ width: `${Math.min(100, Math.max(0, 100 - (remaining / salary * 100)))}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {remaining === 0 ? '100% Allocated' : `${Math.min(100, Math.max(0, 100 - (remaining / salary * 100))).toFixed(0)}% Allocated`}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
        
        {/* Categories Section */}
        <div className="space-y-4 mb-8">
          {jobType === 'government' ? (
            // Government options (radio buttons with Duolingo style)
            <div className="space-y-4">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className={`relative p-6 rounded-2xl cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95 ${
                    allocations[category.id] 
                      ? 'bg-gradient-to-r from-[#58cc02]/20 to-[#2fa946]/20 border-2 border-[#58cc02] shadow-lg shadow-[#58cc02]/20' 
                      : 'bg-gradient-to-r from-[#1e293b] to-[#2d3748] border-2 border-[#374151] hover:border-[#58cc02]/50'
                  }`}
                  onClick={() => handleAllocationChange(category.id, true)}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{category.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={category.id}
                          name="governmentOption"
                          checked={allocations[category.id]}
                          onChange={() => handleAllocationChange(category.id, true)}
                          className="w-5 h-5 text-[#58cc02] focus:ring-[#58cc02] focus:ring-2"
                        />
                        <span className="text-gray-300 text-sm">Select this option</span>
                      </div>
                    </div>
                    {allocations[category.id] && (
                      <div className="text-2xl text-[#58cc02]">✅</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // MNC and Startup options (sliders with Duolingo style)
            <div className="space-y-6">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="bg-gradient-to-r from-[#1e293b] to-[#2d3748] p-6 rounded-2xl border border-[#374151] shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl">{category.emoji}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">{category.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[#58cc02]">
                          ₹{allocations[category.id]?.toLocaleString() || 0}
                        </span>
                        <span className="text-gray-400 text-sm">
                          / ₹{category.max.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Custom Slider */}
                  <div className="relative">
                    <input
                      type="range"
                      id={category.id}
                      min={category.min}
                      max={category.max}
                      step="500"
                      value={allocations[category.id] || 0}
                      onChange={(e) => handleAllocationChange(category.id, parseInt(e.target.value))}
                      className="w-full h-3 bg-[#374151] rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #58cc02 0%, #58cc02 ${((allocations[category.id] || 0) - category.min) / (category.max - category.min) * 100}%, #374151 ${((allocations[category.id] || 0) - category.min) / (category.max - category.min) * 100}%, #374151 100%)`
                      }}
                    />
                    
                    {/* Range Labels */}
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>₹{category.min.toLocaleString()}</span>
                      <span>₹{category.max.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit/Complete Section */}
        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Submit My Plan</span>
            <span className="text-xl">📊</span>
          </button>
        ) : (
          <div className="space-y-6">
            {/* Feedback Card */}
            <div className="bg-gradient-to-r from-[#58cc02]/10 to-[#2fa946]/10 border border-[#58cc02]/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">💡</div>
                <h3 className="text-xl font-bold text-[#58cc02] mb-3">Financial Feedback</h3>
              </div>
              <p className="text-gray-300 text-center leading-relaxed">{feedback?.text}</p>
            </div>
            
            {/* Continue Button */}
            <button
              onClick={handleComplete}
              className="w-full py-4 bg-gradient-to-r from-[#58cc02] to-[#2fa946] text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <span className="text-xl">🚀</span>
            </button>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #58cc02;
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(88, 204, 2, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(88, 204, 2, 0.4);
        }
        
        .slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #58cc02;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(88, 204, 2, 0.3);
          transition: all 0.2s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 12px rgba(88, 204, 2, 0.4);
        }
      `}</style>
    </div>
  );
};

export default ExpenseAllocation;