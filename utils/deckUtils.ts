
import { Card, Suit, Rank } from '../types';
import { SUITS, RANKS, RANK_VALUES } from '../constants';

let cardIdCounter = 0;

export const createDeck = (): Card[] => {
  const newDeck: Card[] = [];
  cardIdCounter = 0; // Reset ID counter for new deck
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      newDeck.push({
        id: `card-${cardIdCounter++}`,
        suit,
        rank,
        value: RANK_VALUES[rank],
        isAce: rank === 'A',
        faceUp: true, // Default to face up, will be set explicitly
      });
    }
  }
  return newDeck;
};

export const shuffleDeck = <T,>(deck: T[]): T[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateHandValue = (handCards: Card[]): { score: number; isBust: boolean; hasBlackjack: boolean } => {
  let score = 0;
  let aceCount = 0;
  
  for (const card of handCards) {
    if (card.faceUp) {
      score += card.value;
      if (card.isAce) {
        aceCount++;
      }
    }
  }

  while (score > 21 && aceCount > 0) {
    score -= 10; // Convert Ace from 11 to 1
    aceCount--;
  }

  const isBust = score > 21;
  const hasBlackjack = handCards.length === 2 && score === 21 && handCards.every(c => c.faceUp);
  
  return { score, isBust, hasBlackjack };
};
