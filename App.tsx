
import React from 'react';
import { useBlackjackGame } from './hooks/useBlackjackGame';
import HandDisplay from './components/HandDisplay';
import InfoDisplay from './components/InfoDisplay';
import ControlsArea from './components/ControlsArea';
import HistoryLog from './components/HistoryLog';
import RulesGuide from './components/RulesGuide';
import { GameState } from './types';

const App: React.FC = () => {
  const {
    playerHand,
    dealerHand,
    gameState,
    houseBankroll,
    playerBankroll,
    currentPlayerBet,
    message,
    isHoleCardHidden,
    history,
    startGame,
    // playerHit, // Removed
    // playerStand, // Removed
    dealerRevealCard,
    dealerHit,
    dealerStand,
    // playerScore, // Kept for potential future use or if ControlsArea needs it indirectly
    dealerScore,
  } = useBlackjackGame();

  return (
    <div className="min-h-screen bg-green-700 text-white p-4 flex flex-col items-center selection:bg-yellow-400 selection:text-green-800">
      <header className="w-full max-w-4xl mb-6">
        <h1 className="text-4xl font-bold text-center text-yellow-300 tracking-wider mb-2" style={{ textShadow: '2px 2px #000000aa' }}>
          House Advantage Blackjack
        </h1>
        <p className="text-center text-green-200 text-sm">You are the Dealer. Make the House win!</p>
      </header>

      <main className="w-full max-w-4xl">
        <InfoDisplay
          houseBankroll={houseBankroll}
          playerBankroll={playerBankroll}
          playerBet={currentPlayerBet}
          message={message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <HandDisplay
            title="PC Player's Hand"
            cards={playerHand.cards}
            score={playerHand.score}
            isBust={playerHand.isBust}
            hasBlackjack={playerHand.hasBlackjack}
            isPlayerTurn={gameState === GameState.PLAYER_TURN} // Highlights during PC's automated turn
          />
          <HandDisplay
            title="Dealer's Hand (Your Hand)"
            cards={dealerHand.cards}
            score={dealerHand.score}
            isBust={dealerHand.isBust}
            hasBlackjack={dealerHand.hasBlackjack}
            isDealerHand={true}
            isHoleCardHidden={isHoleCardHidden}
            isPlayerTurn={gameState === GameState.DEALER_REVEAL || gameState === GameState.DEALER_TURN}
          />
        </div>

        <ControlsArea
          gameState={gameState}
          // playerScore={playerScore} // Removed as ControlsArea no longer uses it for PC buttons
          dealerScore={dealerScore}
          isHoleCardHidden={isHoleCardHidden}
          onStartGame={startGame}
          // onPlayerHit and onPlayerStand removed
          onDealerReveal={dealerRevealCard}
          onDealerHit={dealerHit}
          onDealerStand={dealerStand}
          onNextHand={startGame} 
        />
        
        <RulesGuide />
        <HistoryLog history={history} />

      </main>
      <footer className="mt-auto pt-4 text-center text-green-300 text-xs">
        <p>&copy; {new Date().getFullYear()} House Advantage Blackjack Simulator. Play responsibly (as the house!).</p>
      </footer>
    </div>
  );
};

export default App;
