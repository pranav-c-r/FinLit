import React from 'react';
import PiggyBankComponent from '../components/piggybank/PiggyBank';

const PiggyBankPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold gradient-text mb-8">Piggy Bank</h1>
      <p className="text-gray-300 mb-8">
        Save money for your future goals! Add money to your piggy bank and watch your savings grow.
        Remember, you can only withdraw by breaking your piggy bank - so save wisely!
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PiggyBankComponent />
        
        <div className="game-panel p-6">
          <h2 className="text-2xl font-bold gradient-text-tertiary mb-6">Saving Tips</h2>
          
          <div className="space-y-4">
            <div className="game-card p-4">
              <h3 className="text-lg font-semibold text-tertiary-light mb-2">Set Clear Goals</h3>
              <p className="text-gray-300">Define what you're saving for. Having a specific goal makes saving more meaningful.</p>
            </div>
            
            <div className="game-card p-4">
              <h3 className="text-lg font-semibold text-tertiary-light mb-2">Save Regularly</h3>
              <p className="text-gray-300">Make saving a habit by setting aside a fixed amount on a regular schedule.</p>
            </div>
            
            <div className="game-card p-4">
              <h3 className="text-lg font-semibold text-tertiary-light mb-2">Start Small</h3>
              <p className="text-gray-300">Even small amounts add up over time. Don't wait until you can save a large amount.</p>
            </div>
            
            <div className="game-card p-4">
              <h3 className="text-lg font-semibold text-tertiary-light mb-2">Track Your Progress</h3>
              <p className="text-gray-300">Seeing your savings grow can be motivating and help you stay committed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiggyBankPage;