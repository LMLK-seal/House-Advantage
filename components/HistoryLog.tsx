
import React, { useState } from 'react';
import { GameHistoryEntry, Card } from '../types';
import CardComponent from './CardComponent';

interface HistoryLogProps {
  history: GameHistoryEntry[];
}

const MiniCardDisplay: React.FC<{card: Card}> = ({ card }) => {
  const color = (card.suit === '♥' || card.suit === '♦') ? 'text-red-600' : 'text-black';
  return (
    <span className={`inline-block px-1 py-0.5 mx-0.5 text-xs bg-white ${color} border border-gray-400 rounded`}>
      {card.rank}{card.suit}
    </span>
  );
};


const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (history.length === 0) {
    return null; 
  }

  return (
    <div className="mt-8 p-4 bg-gray-800 bg-opacity-70 rounded-lg shadow-lg max-w-3xl mx-auto">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left text-xl font-semibold text-yellow-300 mb-2 hover:text-yellow-100"
      >
        Game History {isOpen ? '▼' : '►'}
      </button>
      {isOpen && (
        <div className="max-h-60 overflow-y-auto pr-2">
          {history.slice().reverse().map((entry) => (
            <div key={entry.id} className="mb-3 p-3 bg-gray-700 rounded shadow text-sm">
              <p className="font-semibold text-gray-200">{entry.resultMessage}</p>
              <div className="text-gray-300">
                <span>PC Player: </span>
                {entry.playerCards.map(c => <MiniCardDisplay key={`${entry.id}-p-${c.id}`} card={c} />)}
                <span> ({entry.playerScore}{entry.playerBust ? ' BUST' : ''})</span>
              </div>
              <div className="text-gray-300">
                <span>Dealer: </span>
                {entry.dealerCards.map(c => <MiniCardDisplay key={`${entry.id}-d-${c.id}`} card={c} />)}
                <span> ({entry.dealerScore}{entry.dealerBust ? ' BUST' : ''})</span>
              </div>
              <p className={`font-medium ${entry.houseBankrollChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                House Bankroll Change: ${entry.houseBankrollChange >= 0 ? '+' : ''}{entry.houseBankrollChange}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryLog;
