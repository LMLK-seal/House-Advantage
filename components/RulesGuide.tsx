
import React, { useState } from 'react';

const RulesGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-6 text-center">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
        aria-label="Show Rules and Game Guide"
        aria-expanded={isOpen}
      >
        Show Rules & Guide
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="rules-guide-heading">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto text-left">
            <h2 id="rules-guide-heading" className="text-2xl font-bold mb-4 text-gray-800">House Advantage Blackjack - Rules & Guide</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2 text-green-700">Core Concept</h3>
            <p className="text-gray-700 mb-2">You are the Casino Dealer. Your goal is to make the House win against the PC-controlled Player.</p>

            <h3 className="text-xl font-semibold mt-4 mb-2 text-green-700">Card Values</h3>
            <ul className="list-disc list-inside text-gray-700 mb-2">
              <li>Cards 2-9: Face value.</li>
              <li>10, Jack, Queen, King (T, J, Q, K): 10 points.</li>
              <li>Ace (A): 1 or 11 points (whichever is more advantageous without busting).</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2 text-green-700">Gameplay Loop</h3>
            <ol className="list-decimal list-inside text-gray-700 mb-2 space-y-1">
              <li><strong>Player's Bet (PC):</strong> The PC Player automatically bets (default: 10 credits).</li>
              <li><strong>Initial Deal:</strong> Click "Start New Game" or "Next Hand". PC Player gets two cards face up. Dealer gets one card face up, one face down (hole card).</li>
              <li>
                <strong>PC Player's Turn (Automated):</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>The PC Player automatically decides to Hit or Stand based on its current hand and the dealer's up-card.</li>
                  <li>General PC Strategy: Hits on 11 or less. Stands on 17 or more. For 12-16, it hits if dealer shows 7+ (or Ace), otherwise stands.</li>
                  <li>This continues until the PC Player Stands or Busts (goes over 21).</li>
                </ul>
              </li>
              <li>
                <strong>Dealer's Turn (Your Hand):</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>If PC Player hasn't busted, click "Reveal Hole Card".</li>
                  <li>You must play your hand according to standard dealer rules:
                    <ul className="list-disc list-inside ml-4">
                      <li>Hit on 16 or less.</li>
                      <li>Stand on 17 or more (this game uses: Stand on Soft 17 and Hard 17).</li>
                    </ul>
                  </li>
                  <li>Click "Hit My Hand" or "Stand My Hand" following these rules. The game will guide you.</li>
                </ul>
              </li>
              <li><strong>Resolution & Payout:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li><strong>PC Player Busts:</strong> House (you) wins the bet.</li>
                  <li><strong>Dealer Busts:</strong> PC Player wins 1:1.</li>
                  <li><strong>Neither Busts:</strong>
                    <ul>
                      <li>Dealer hand {'>'} PC Player hand: House wins.</li>
                      <li>PC Player hand {'>'} Dealer hand: PC Player wins 1:1.</li>
                      <li>Push (Tie): PC Player gets their bet back.</li>
                    </ul>
                  </li>
                  <li><strong>Blackjack:</strong>
                    <ul>
                      <li>PC Player Blackjack (and Dealer doesn't): PC Player wins 3:2.</li>
                      <li>Dealer Blackjack (and PC Player doesn't): House wins immediately.</li>
                      <li>Both Blackjack: Push.</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ol>
            
            <h3 className="text-xl font-semibold mt-4 mb-2 text-green-700">Your Goal as Dealer</h3>
            <p className="text-gray-700 mb-2">Increase the House Bankroll by playing your hand flawlessly by the dealer rules, while the PC plays its own strategy.</p>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition w-full"
              aria-label="Close Rules and Game Guide"
            >
              Close Rules
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RulesGuide;
