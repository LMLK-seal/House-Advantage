
import React from 'react';
import { Card as CardType } from '../types';
import CardComponent from './CardComponent';

interface HandDisplayProps {
  title: string;
  cards: CardType[];
  score: number;
  isBust: boolean;
  hasBlackjack: boolean;
  isDealerHand?: boolean;
  isHoleCardHidden?: boolean;
  isPlayerTurn?: boolean; // To highlight active player's hand
}

const HandDisplay: React.FC<HandDisplayProps> = ({
  title,
  cards,
  score,
  isBust,
  hasBlackjack,
  isDealerHand = false,
  isHoleCardHidden = false,
  isPlayerTurn = false,
}) => {
  const handStatus = () => {
    if (isBust) return <span className="text-red-400 font-bold">BUST! ({score})</span>;
    if (hasBlackjack) return <span className="text-yellow-400 font-bold">BLACKJACK! ({score})</span>;
    return score > 0 ? <span className="text-white">Score: {score}</span> : '';
  };

  return (
    <div className={`p-4 rounded-lg shadow-md min-h-[220px] ${isPlayerTurn ? 'ring-4 ring-yellow-400' : ''} bg-green-800 bg-opacity-50`}>
      <h3 className="text-xl font-semibold text-center text-yellow-200 mb-3">{title}</h3>
      <div className="flex justify-center items-center space-x-[-40px] min-h-[150px] mb-2">
        {cards.length === 0 && <div className="w-24 h-36 border-2 border-dashed border-green-500 rounded-lg flex items-center justify-center text-green-400">Empty</div>}
        {cards.map((card, index) => (
          <CardComponent 
            key={card.id} 
            card={card} 
            isHidden={isDealerHand && index === 1 && isHoleCardHidden} 
          />
        ))}
      </div>
      <div className="text-center text-lg mt-2 h-6">{handStatus()}</div>
    </div>
  );
};

export default HandDisplay;
