
import React from 'react';

interface InfoDisplayProps {
  houseBankroll: number;
  playerBankroll: number; // PC Player's bankroll
  playerBet: number;
  message: string;
}

const InfoDisplay: React.FC<InfoDisplayProps> = ({ houseBankroll, playerBankroll, playerBet, message }) => {
  return (
    <div className="p-4 bg-black bg-opacity-30 rounded-lg shadow-lg text-white mb-6">
      <div className="flex justify-around items-center mb-4 text-lg">
        <div>
          <span className="font-semibold text-yellow-300">House Bankroll: </span>
          <span className="text-xl font-bold">${houseBankroll}</span>
        </div>
        <div>
          <span className="font-semibold text-blue-300">PC Player Bet: </span>
          <span className="text-xl font-bold">${playerBet > 0 ? playerBet : '--'}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-400">PC Player Bankroll: </span>
          <span className="text-xl font-bold">${playerBankroll}</span>
        </div>
      </div>
      {message && (
        <div className="mt-2 text-center text-xl font-semibold p-3 rounded-md bg-yellow-500 text-black shadow">
          {message}
        </div>
      )}
    </div>
  );
};

export default InfoDisplay;
