
import React from 'react';
import { Card } from '../types';

interface CardComponentProps {
  card?: Card; // Card can be undefined if slot is empty
  isHidden?: boolean; // For dealer's hole card
}

const CardComponent: React.FC<CardComponentProps> = ({ card, isHidden }) => {
  if (isHidden || !card) {
    return (
      <div className="w-24 h-36 bg-blue-600 border-2 border-blue-800 rounded-lg flex justify-center items-center text-white font-bold shadow-lg transform hover:scale-105 transition-transform">
        <span className="transform rotate-12 text-lg">HOUSE</span>
      </div>
    );
  }

  const { rank, suit, faceUp } = card;

  if (!faceUp) { // Should not happen if isHidden is false and card is provided, but as a fallback
     return (
      <div className="w-24 h-36 bg-blue-600 border-2 border-blue-800 rounded-lg flex justify-center items-center text-white font-bold shadow-lg transform hover:scale-105 transition-transform">
        <span className="transform rotate-12 text-lg">HOUSE</span>
      </div>
    );
  }

  const color = (suit === '♥' || suit === '♦') ? 'text-red-600' : 'text-black';

  return (
    <div className="w-24 h-36 bg-white border-2 border-gray-300 rounded-lg flex flex-col justify-between items-center p-2 shadow-xl transform hover:scale-105 transition-transform">
      <div className={`text-3xl font-bold ${color} self-start`}>{rank}</div>
      <div className={`text-4xl ${color}`}>{suit}</div>
      <div className={`text-3xl font-bold ${color} self-end transform rotate-180`}>{rank}</div>
    </div>
  );
};

export default CardComponent;
