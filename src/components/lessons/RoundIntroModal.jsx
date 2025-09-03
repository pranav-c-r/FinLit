import React from 'react';

const RoundIntroModal = ({ title, description, buttonText, onButtonClick, challenges, roundNumber = 1 }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#01110A] bg-opacity-40">
    <div className="bg-[#0A1F14] rounded-2xl shadow-lg max-w-md w-full px-6 py-8 relative flex flex-col gap-6 animate-fadeInUp border border-[#1C3B2A]">
      {/* Header: Age & Round */}
      <div className="text-[#80A1C1] font-bold text-lg tracking-wide">
        🎮 {title || `Round ${roundNumber}: Age ${23 + (roundNumber - 1)}–${24 + (roundNumber - 1)}`}
      </div>
      {/* Section: What You'll Learn */}
      <div>
        <div className="text-base font-medium text-white mb-2">
          📚 What You'll Learn This Round:
        </div>
        <p className="text-[#80A1C1] leading-snug">
          {description || "In this round, you'll discover how your first job choice shapes your entire financial future. Every decision has trade-offs — stability vs. growth, immediate money vs. long-term potential."}
        </p>
      </div>
      {/* Section: Challenge */}
      <div>
        <div className="text-base font-medium text-white mb-2">
          🌟 Your Challenge:
        </div>
        <ul className="list-disc ml-6 text-[#80A1C1]">
          {challenges ? (
            challenges.map((challenge, index) => (
              <li key={index}>{challenge}</li>
            ))
          ) : (
            <>
              <li>Choose your first job (risk/reward trade-offs)</li>
              <li>Decide what to do with your first salary</li>
              <li>Handle an unexpected financial situation</li>
            </>
          )}
        </ul>
      </div>
      {/* Section: Reminder */}
      <div>
        <div className="text-base font-medium text-white mb-1">
          💡 Remember:
        </div>
        <p className="text-[#80A1C1]">There's no perfect choice — each path teaches different money lessons!</p>
      </div>
      {/* Action Button */}
      <button
        onClick={onButtonClick || onClose}
        className="mt-2 px-5 py-2 rounded-full bg-[#80A1C1] text-white font-semibold text-base transition hover:bg-[#5C7A9E]"
      >
        {buttonText || "Start Journey"}
      </button>
    </div>
  </div>
);

export default RoundIntroModal;
