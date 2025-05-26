
import { Suit, Rank } from './types';

export const SUITS: Suit[] = ['♥', '♦', '♣', '♠'];
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

export const RANK_VALUES: { [key in Rank]: number } = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'T': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11,
};

export const INITIAL_HOUSE_BANKROLL = 1000;
export const INITIAL_PLAYER_BANKROLL = 500; // For display purposes
export const DEFAULT_PLAYER_BET = 10;

export const DEALER_MUST_HIT_THRESHOLD = 16;
export const DEALER_MUST_STAND_THRESHOLD = 17;
export const PLAYER_AUTO_HIT_THRESHOLD = 11;
