
import React from 'react';
import { GameState } from '../types';
import { DEALER_MUST_HIT_THRESHOLD, DEALER_MUST_STAND_THRESHOLD } from '../constants';

interface ControlsAreaProps {
  gameState: GameState;
  // playerScore: number; // No longer directly used for PC player buttons
  dealerScore: number;
  isHoleCardHidden: boolean;
  onStartGame: () => void;
  // onPlayerHit: () => void; // Removed
  // onPlayerStand: () => void; // Removed
  onDealerReveal: () => void;
  onDealerHit: () => void;
  onDealerStand: () => void;
  onNextHand: () => void;
}

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button
    className={`px-6 py-3 text-lg font-semibold rounded-lg shadow-md hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-700 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const ControlsArea: React.FC<ControlsAreaProps> = ({
  gameState,
  // playerScore,
  dealerScore,
  isHoleCardHidden,
  onStartGame,
  // onPlayerHit, // Removed
  // onPlayerStand, // Removed
  onDealerReveal,
  onDealerHit,
  onDealerStand,
  onNextHand,
}) => {
  const renderControls = () => {
    switch (gameState) {
      case GameState.IDLE:
        // Check if onNextHand should be available if not game over
        return <Button onClick={onNextHand} className="bg-blue-500 text-white focus:ring-blue-400">Next Hand / Start Game</Button>;
      case GameState.PLAYER_BETTING: 
        return <p className="text-white text-center text-lg animate-pulse">PC Player is betting...</p>;
      case GameState.DEALING: 
        return <p className="text-white text-center text-lg animate-pulse">Dealing cards...</p>;
      case GameState.PLAYER_TURN:
        return <p className="text-white text-center text-lg animate-pulse">PC Player's turn...</p>;
      case GameState.DEALER_REVEAL:
        return <Button onClick={onDealerReveal} className="bg-yellow-500 text-black focus:ring-yellow-400">Reveal Dealer's Hole Card</Button>;
      case GameState.DEALER_TURN:
        const dealerMustHit = dealerScore <= DEALER_MUST_HIT_THRESHOLD && dealerScore > 0 && !isHoleCardHidden;
        const dealerMustStand = dealerScore >= DEALER_MUST_STAND_THRESHOLD && dealerScore > 0 && !isHoleCardHidden;
        return (
          <div className="space-x-4">
            <Button 
              onClick={onDealerHit} 
              disabled={dealerMustStand || isHoleCardHidden || dealerScore === 0} 
              className="bg-green-500 text-white focus:ring-green-400"
              aria-label={`Hit Dealer's Hand. Current score: ${dealerScore}`}
            >
              Hit My Hand {dealerMustHit ? "(Dealer Rule)" : ""}
            </Button>
            <Button 
              onClick={onDealerStand} 
              disabled={dealerMustHit || isHoleCardHidden || dealerScore === 0} 
              className="bg-red-500 text-white focus:ring-red-400"
              aria-label={`Stand Dealer's Hand. Current score: ${dealerScore}`}
            >
              Stand My Hand {dealerMustStand ? "(Dealer Rule)" : ""}
            </Button>
          </div>
        );
      case GameState.RESOLVING: 
        return <p className="text-white text-center text-lg animate-pulse">Resolving hand...</p>;
      case GameState.GAME_OVER:
        return (
          <div className="text-center">
            <p className="text-red-400 text-2xl font-bold mb-4">House Bankrupt! Game Over.</p>
            <Button onClick={onStartGame} className="bg-blue-500 text-white focus:ring-blue-400">Start New Game</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div className="my-6 flex justify-center items-center min-h-[80px]">{renderControls()}</div>;
};

export default ControlsArea;
