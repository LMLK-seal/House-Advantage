
export type Suit = '♥' | '♦' | '♣' | '♠';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  id: string; // Unique ID for React key
  suit: Suit;
  rank: Rank;
  value: number;
  isAce: boolean;
  faceUp: boolean;
}

export interface Hand {
  cards: Card[];
  score: number;
  isBust: boolean;
  hasBlackjack: boolean;
}

export enum GameState {
  IDLE = 'IDLE', // Before game starts or between rounds
  PLAYER_BETTING = 'PLAYER_BETTING', // PC places bet (automatic)
  DEALING = 'DEALING', // Cards are dealt
  PLAYER_TURN = 'PLAYER_TURN', // User decides for PC Player
  DEALER_REVEAL = 'DEALER_REVEAL', // Dealer reveals hole card
  DEALER_TURN = 'DEALER_TURN', // User plays Dealer's hand
  RESOLVING = 'RESOLVING', // Determine winner, update bankrolls
  GAME_OVER = 'GAME_OVER', // House bankroll depleted
}

export interface GameHistoryEntry {
  id: string;
  playerCards: Card[];
  dealerCards: Card[];
  playerScore: number;
  dealerScore: number;
  playerBust: boolean;
  dealerBust: boolean;
  resultMessage: string;
  houseBankrollChange: number;
}
