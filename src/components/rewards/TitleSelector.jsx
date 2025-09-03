import React from 'react';

const TitleSelector = ({ titles, activeTitle, onSelectTitle }) => {
  // Define all possible titles with their descriptions
  const allTitles = [
    { id: 'Beginner', description: 'Starting your financial journey' },
    { id: 'Saver', description: 'Demonstrated saving skills' },
    { id: 'Investor', description: 'Learned investment basics' },
    { id: 'Budget Master', description: 'Excellent at budgeting' },
    { id: 'Financial Wizard', description: 'Expert in multiple financial areas' },
    { id: 'Money Guru', description: 'Highest level of financial wisdom' },
    { id: 'Debt Destroyer', description: 'Successfully managed debt concepts' },
    { id: 'Credit Conqueror', description: 'Mastered credit management' },
    { id: 'Tax Tactician', description: 'Skilled in tax optimization' },
    { id: 'Retirement Planner', description: 'Focused on long-term planning' },
    { id: 'Risk Manager', description: 'Understands financial risk management' },
    { id: 'Wealth Builder', description: 'On the path to building wealth' },
  ];

  // Filter to only show titles the user has unlocked
  const unlockedTitles = allTitles.filter(title => titles.includes(title.id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold gradient-text">Your Titles</h3>
        <div className="text-sm text-gray-300">
          <span className="text-primary-light font-medium">{titles.length}</span> of {allTitles.length} unlocked
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {unlockedTitles.map((title) => {
          const isActive = activeTitle === title.id;
          
          return (
            <div 
              key={title.id}
              className={`p-4 rounded-lg border ${isActive 
                ? 'border-primary bg-primary/20' 
                : 'border-accent/30 hover:border-accent/60 bg-background-dark/50'}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{title.id}</h4>
                  <p className="text-sm text-gray-300 mt-1">{title.description}</p>
                </div>
                
                <button
                  onClick={() => onSelectTitle(title.id)}
                  className={`py-1 px-3 rounded text-sm font-medium ${isActive 
                    ? 'bg-primary text-white' 
                    : 'bg-accent/30 hover:bg-accent/50 text-white'}`}
                >
                  {isActive ? 'Active' : 'Select'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Locked Titles Preview */}
      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-300 mb-4">Locked Titles</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allTitles
            .filter(title => !titles.includes(title.id))
            .map((title) => (
              <div 
                key={title.id}
                className="p-4 rounded-lg border border-gray-700 bg-background-dark/30 opacity-60"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium flex items-center">
                      <span className="mr-2">🔒</span> {title.id}
                    </h4>
                    <p className="text-sm text-gray-400 mt-1">{title.description}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default TitleSelector;