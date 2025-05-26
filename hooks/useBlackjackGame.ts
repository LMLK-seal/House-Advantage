
import { useState, useEffect, useCallback } from 'react';
import { Card, GameState, Hand, GameHistoryEntry } from '../types';
import { createDeck, shuffleDeck, calculateHandValue } from '../utils/deckUtils';
import {
  INITIAL_HOUSE_BANKROLL,
  INITIAL_PLAYER_BANKROLL,
  DEFAULT_PLAYER_BET,
  DEALER_MUST_HIT_THRESHOLD,
  DEALER_MUST_STAND_THRESHOLD,
  PLAYER_AUTO_HIT_THRESHOLD
} from '../constants';

const createInitialHand = (): Hand => ({
  cards: [],
  score: 0,
  isBust: false,
  hasBlackjack: false,
});

export const useBlackjackGame = () => {
  const [deck, setDeck] = useState<Card[]>(shuffleDeck(createDeck()));
  const [playerHand, setPlayerHand] = useState<Hand>(createInitialHand());
  const [dealerHand, setDealerHand] = useState<Hand>(createInitialHand());
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [houseBankroll, setHouseBankroll] = useState<number>(INITIAL_HOUSE_BANKROLL);
  const [playerBankroll, setPlayerBankroll] = useState<number>(INITIAL_PLAYER_BANKROLL);
  const [currentPlayerBet, setCurrentPlayerBet] = useState<number>(0);
  const [message, setMessage] = useState<string>('Welcome to House Advantage Blackjack!');
  const [isHoleCardHidden, setIsHoleCardHidden] = useState<boolean>(true);
  const [history, setHistory] = useState<GameHistoryEntry[]>([]);
  const [isPcThinking, setIsPcThinking] = useState<boolean>(false);


  const dealCard = useCallback((currentDeck: Card[], toHand: Hand, faceUp: boolean = true): {card?: Card, newDeck: Card[]} => {
    let deckToUse = [...currentDeck];
    if (deckToUse.length === 0) {
      setMessage("Reshuffling deck...");
      deckToUse = shuffleDeck(createDeck());
    }
    const card = deckToUse.pop();
    if (card) {
      card.faceUp = faceUp;
      const newCards = [...toHand.cards, card];
      const handValue = calculateHandValue(newCards);
      
      toHand.cards = newCards;
      toHand.score = handValue.score;
      toHand.isBust = handValue.isBust;
      toHand.hasBlackjack = handValue.hasBlackjack;
    }
    return {card, newDeck: deckToUse};
  }, [setMessage]); 

  const resetHandState = useCallback(() => {
    setPlayerHand(createInitialHand());
    setDealerHand(createInitialHand());
    setIsHoleCardHidden(true);
    setCurrentPlayerBet(0);
    if (deck.length < 15) { 
        const newDeck = shuffleDeck(createDeck());
        setDeck(newDeck);
        setMessage("Shuffling a new deck.");
    }
  }, [deck, setMessage]); 

  const addHistoryEntry = useCallback((entry: Omit<GameHistoryEntry, 'id'>) => {
    setHistory(prev => [...prev, { ...entry, id: `hist-${Date.now()}-${prev.length}` }]);
  }, []);
  
  const resolveBet = useCallback((winner: 'player' | 'dealer' | 'push', reason: string) => {
    let houseChange = 0;
    let resultMessage = reason;

    const finalPlayerHand = playerHand; 
    const finalDealerHand = dealerHand;


    if (winner === 'player') {
      if (finalPlayerHand.hasBlackjack && finalPlayerHand.cards.length === 2 && !finalDealerHand.hasBlackjack) { 
        houseChange = -Math.floor(currentPlayerBet * 1.5);
        resultMessage = `PC Player Blackjack! Player wins $${-houseChange}.`;
        setPlayerBankroll(prev => prev - houseChange);
      } else {
        houseChange = -currentPlayerBet;
        resultMessage = `PC Player wins! Player wins $${-houseChange}. (${reason})`;
        setPlayerBankroll(prev => prev - houseChange);
      }
    } else if (winner === 'dealer') {
      houseChange = currentPlayerBet;
       if (finalDealerHand.hasBlackjack && finalDealerHand.cards.length === 2 && finalPlayerHand.hasBlackjack && finalPlayerHand.cards.length === 2) {
         resultMessage = `Push! Both have Blackjack. Bet returned.`;
         houseChange = 0;
       } else if (finalDealerHand.hasBlackjack && finalDealerHand.cards.length === 2) {
        resultMessage = `Dealer Blackjack! House wins $${houseChange}.`;
      } else {
        resultMessage = `House wins! House wins $${houseChange}. (${reason})`;
      }
      if (houseChange > 0) { 
          setPlayerBankroll(prev => prev - houseChange);
      }
    } else { 
      houseChange = 0;
      resultMessage = `Push! Bet returned. (${reason})`;
    }

    setHouseBankroll(prev => prev + houseChange);
    setMessage(resultMessage);
    
    addHistoryEntry({
        playerCards: [...finalPlayerHand.cards],
        dealerCards: [...finalDealerHand.cards],
        playerScore: finalPlayerHand.score,
        dealerScore: finalDealerHand.score,
        playerBust: finalPlayerHand.isBust,
        dealerBust: finalDealerHand.isBust,
        resultMessage: resultMessage,
        houseBankrollChange: houseChange,
    });
    
    setHouseBankroll(currentHouseBankroll => {
        if (currentHouseBankroll <= 0) {
            setGameState(GameState.GAME_OVER);
            setMessage(`House Bankrupt! Game Over. Final bankroll: $${currentHouseBankroll}`);
        } else {
            setGameState(GameState.IDLE);
        }
        return currentHouseBankroll;
    });

  }, [currentPlayerBet, playerHand, dealerHand, addHistoryEntry, setMessage]);


  const startGame = useCallback(() => {
    setHouseBankroll(prevBankroll => {
        if (prevBankroll <= 0) {
            setMessage("New game started after bankruptcy. PC Player is betting.");
            return INITIAL_HOUSE_BANKROLL;
        }
        setMessage("New game started. PC Player is betting.");
        return prevBankroll;
    });
    setPlayerBankroll(INITIAL_PLAYER_BANKROLL); // Reset player bankroll on new game too
    resetHandState();
    setGameState(GameState.PLAYER_BETTING);
  }, [resetHandState, setMessage]);

  useEffect(() => {
    if (gameState === GameState.PLAYER_BETTING) {
      setCurrentPlayerBet(DEFAULT_PLAYER_BET);
      setMessage(`PC Player bets $${DEFAULT_PLAYER_BET}. Dealing cards...`);
      const timeoutId = setTimeout(() => setGameState(GameState.DEALING), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [gameState, setMessage]);


  useEffect(() => {
    if (gameState === GameState.DEALING) {
      let currentDeck = [...deck];
      const pHand = createInitialHand();
      const dHand = createInitialHand();

      let dealtCardsCount = 0;
      let cardResult;

      cardResult = dealCard(currentDeck, pHand, true); 
      if(cardResult.card) dealtCardsCount++;
      currentDeck = cardResult.newDeck;

      cardResult = dealCard(currentDeck, dHand, true); 
      if(cardResult.card) dealtCardsCount++;
      currentDeck = cardResult.newDeck;
      
      cardResult = dealCard(currentDeck, pHand, true); 
      if(cardResult.card) dealtCardsCount++;
      currentDeck = cardResult.newDeck;

      cardResult = dealCard(currentDeck, dHand, false); // Dealer's hole card
      if(cardResult.card) dealtCardsCount++;
      currentDeck = cardResult.newDeck;
      
      const finalPHand = {...pHand, ...calculateHandValue(pHand.cards)};
      const finalDHand = {...dHand, ...calculateHandValue(dHand.cards)}; 

      setPlayerHand(finalPHand);
      setDealerHand(finalDHand);
      setDeck(currentDeck); // Use the deck returned by the last dealCard
      setIsHoleCardHidden(true);

      const dealerTrueValueIfRevealed = calculateHandValue(finalDHand.cards.map((c,i) => (dHand.cards.length > 1 && i === 1) ? {...c, faceUp: true} : c));

      if (finalPHand.hasBlackjack && dealerTrueValueIfRevealed.hasBlackjack) {
        setIsHoleCardHidden(false);
        setDealerHand(prev => ({...prev, cards: prev.cards.map((c,i) => (prev.cards.length > 1 && i===1) ? {...c, faceUp:true} : c), ...dealerTrueValueIfRevealed }));
        resolveBet('push', "Both have Blackjack");
      } else if (finalPHand.hasBlackjack) {
        setIsHoleCardHidden(false); 
         setDealerHand(prev => ({...prev, cards: prev.cards.map((c,i) => (prev.cards.length > 1 && i===1) ? {...c, faceUp:true} : c), ...dealerTrueValueIfRevealed }));
        resolveBet('player', "Player Blackjack");
      } else if (dealerTrueValueIfRevealed.hasBlackjack) { 
        setIsHoleCardHidden(false);
        setDealerHand(prev => ({...prev, cards: prev.cards.map((c,i) => (prev.cards.length > 1 && i===1) ? {...c, faceUp:true} : c), ...dealerTrueValueIfRevealed }));
        resolveBet('dealer', "Dealer Blackjack");
      } else {
        setGameState(GameState.PLAYER_TURN);
        setMessage("PC Player's turn. Evaluating options...");
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, dealCard, deck, resolveBet, setMessage]); // Keep existing deps, `deck` is read and updated.


  // PC Player's Turn Logic
  useEffect(() => {
    if (gameState !== GameState.PLAYER_TURN) {
        if (isPcThinking) setIsPcThinking(false); // Reset if moving away from player turn
        return;
    }

    // Conditions for PC to act: not bust, has cards, dealer has cards, and PC not already thinking.
    if (playerHand.isBust || playerHand.cards.length < 2 || dealerHand.cards.length === 0 || isPcThinking) {
      return; 
    }
    
    // If we reach here, all pre-conditions are met. PC will start its turn.
    setIsPcThinking(true);

    // dealerHand.cards.length > 0 is guaranteed by the check above.
    const dealerUpCard = dealerHand.cards.find(card => card.faceUp);
    
    if (!dealerUpCard) {
        // This implies dealerHand.cards is populated, but no card has .faceUp === true.
        // This would be a contradiction with the dealing logic.
        console.error("CRITICAL: Dealer upcard not found, but dealer hand was not empty. Problem in faceUp status or dealing. Dealer cards:", JSON.stringify(dealerHand.cards.map(c => ({ r: c.rank, s: c.suit, fU: c.faceUp }))));
        setIsPcThinking(false); // Allow potential recovery or next attempt if state changes
        return; 
    }

    let decision: 'hit' | 'stand';
    let actionMessage = "";

    if (playerHand.score <= PLAYER_AUTO_HIT_THRESHOLD) { 
        decision = 'hit';
        actionMessage = `PC Player has ${playerHand.score}, PC Hits (Rule: score <= ${PLAYER_AUTO_HIT_THRESHOLD}).`;
    } else if (playerHand.score >= DEALER_MUST_STAND_THRESHOLD) { 
        decision = 'stand';
        actionMessage = `PC Player has ${playerHand.score}, PC Stands (Rule: score >= ${DEALER_MUST_STAND_THRESHOLD}).`;
    } else { 
        if (dealerUpCard.value >= 7 || dealerUpCard.isAce) { 
            decision = 'hit';
            actionMessage = `PC Player has ${playerHand.score}, Dealer shows ${dealerUpCard.rank}. PC Hits.`;
        } else {
            decision = 'stand';
            actionMessage = `PC Player has ${playerHand.score}, Dealer shows ${dealerUpCard.rank}. PC Stands.`;
        }
    }
    
    setMessage(actionMessage);

    setTimeout(() => {
        if (decision === 'hit') {
            const tempPHand = createInitialHand(); 
            tempPHand.cards = [...playerHand.cards]; 
            
            const { card: dealtCard, newDeck: updatedDeckAfterPCHit } = dealCard(deck, tempPHand, true);
            
            const newPHandState = {...tempPHand, ...calculateHandValue(tempPHand.cards)};
            setPlayerHand(newPHandState);
            setDeck(updatedDeckAfterPCHit);

            if (newPHandState.isBust) {
                setMessage(`PC Player busts with ${newPHandState.score}!`);
                resolveBet('dealer', "Player Bust");
                // isPcThinking will be reset when gameState changes (handled by the top check of this effect)
            } else if (newPHandState.score === 21) {
                setMessage(`PC Player hits to 21. Standing for PC Player.`);
                setGameState(GameState.DEALER_REVEAL);
                 // isPcThinking will be reset
            } else {
                setMessage(`PC Player hits. New score: ${newPHandState.score}. PC evaluating...`);
                setIsPcThinking(false); // Allow next decision cycle for PC
            }
        } else { // Stand
            setGameState(GameState.DEALER_REVEAL);
            // isPcThinking will be reset
        }
    }, 1500); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, playerHand.score, playerHand.isBust, playerHand.cards.length, dealerHand.cards, deck, dealCard, resolveBet, isPcThinking, setMessage]);


  const dealerRevealCard = useCallback(() => {
    if (gameState !== GameState.DEALER_REVEAL || dealerHand.cards.length < 2) return; // Ensure there is a hole card
    
    const newDHandCards = dealerHand.cards.map((card, index) => (index === 1 ? { ...card, faceUp: true } : card));
    const newDHandValue = calculateHandValue(newDHandCards);
    const newDHand = { ...dealerHand, cards: newDHandCards, ...newDHandValue };

    setDealerHand(newDHand);
    setIsHoleCardHidden(false);
    
    if (newDHand.hasBlackjack && !playerHand.hasBlackjack) { 
        resolveBet('dealer', "Dealer Blackjack on reveal");
        return;
    }
     // If player already busted, dealer wins regardless of their hand after reveal (unless dealer also busts, which is less common here)
    if (playerHand.isBust) {
        // resolveBet('dealer', "Player Bust"); // This should have been handled when PC busted.
        // If PC busted, the game should have already resolved. This is a safeguard.
        // Let's assume resolveBet was called. Dealer turn might not even start.
        // For safety, if we reach here and player is bust, it's still dealer win.
        // But ideally, gameState wouldn't be DEALER_REVEAL if player busted.
        // This logic path might need review if player bust doesn't immediately end PC turn.
        // For now, proceed to dealer's turn rules.
    }
    
    setMessage(`Dealer's hole card revealed. Score: ${newDHand.score}. Your turn to play Dealer's hand.`);
    setGameState(GameState.DEALER_TURN);

    // Auto-logic after reveal for dealer's turn continuation or immediate resolution
    // This logic is now primarily handled by dealerHit/dealerStand and dealer turn conditions.
    // However, if dealer stands immediately (e.g. 17+), resolve.
    if (!playerHand.isBust && newDHand.score >= DEALER_MUST_STAND_THRESHOLD) {
        setTimeout(() => {
             // Check dealer bust again, though less likely with 17+ stand.
            if (newDHand.isBust) { // Should not happen if standing on 17-21
                resolveBet('player', "Dealer Bust");
            } else {
                setMessage(`Dealer has ${newDHand.score}. Dealer stands.`);
                resolveBet(newDHand.score > playerHand.score ? 'dealer' : (newDHand.score < playerHand.score ? 'player' : 'push'), "Dealer stands, comparing hands");
            }
        }, 1000); // Short delay for UX
    }

  }, [gameState, dealerHand, playerHand, resolveBet, setMessage]);

  const dealerStand = useCallback(() => {
    if (gameState !== GameState.DEALER_TURN || isHoleCardHidden || dealerHand.isBust) return;
    if (dealerHand.score <= DEALER_MUST_HIT_THRESHOLD && dealerHand.cards.length > 0) { // Ensure not standing on empty hand
        setMessage("Dealer rule: Must hit on 16 or less.");
        // Optionally auto-hit: dealerHit(); // This would create a circular dependency if dealerHit also calls dealerStand. Consider direct state update or separate logic.
        return;
    }
    setMessage(`Dealer stands with ${dealerHand.score}.`);
    if (playerHand.isBust) { // Player already busted
        resolveBet('dealer', "Player Bust"); 
    } else { // Compare hands
        resolveBet(dealerHand.score > playerHand.score ? 'dealer' : (dealerHand.score < playerHand.score ? 'player' : 'push'), "Dealer stands, comparing hands");
    }
  }, [gameState, dealerHand, playerHand, resolveBet, isHoleCardHidden, setMessage]);

  const dealerHit = useCallback(() => {
    if (gameState !== GameState.DEALER_TURN || isHoleCardHidden || dealerHand.isBust) return;
    if (dealerHand.score >= DEALER_MUST_STAND_THRESHOLD) {
        setMessage("Dealer rule: Must stand on 17 or more.");
        // Call dealerStand to resolve if this was somehow missed. 
        // Ensure this doesn't create infinite loops if stand conditions are complex.
        dealerStand(); 
        return;
    }

    const tempDHand = createInitialHand();
    tempDHand.cards = [...dealerHand.cards];
    const { card: dealtCard, newDeck: updatedDeckAfterDealerHit } = dealCard(deck, tempDHand, true);
    
    const newDHandState = {...tempDHand, ...calculateHandValue(tempDHand.cards)};
    setDealerHand(newDHandState);
    setDeck(updatedDeckAfterDealerHit);

    if (newDHandState.isBust) {
      setMessage(`Dealer busts with ${newDHandState.score}!`);
      resolveBet('player', "Dealer Bust");
    } else if (newDHandState.score >= DEALER_MUST_STAND_THRESHOLD) {
      setMessage(`Dealer hits to ${newDHandState.score}. Dealer automatically stands.`);
       if (playerHand.isBust) { // Player already busted
            resolveBet('dealer', "Player Bust"); 
       } else {
           resolveBet(newDHandState.score > playerHand.score ? 'dealer' : (newDHandState.score < playerHand.score ? 'player' : 'push'), "Dealer stands after hit, comparing hands");
       }
    } else {
      setMessage(`Dealer hits. New score: ${newDHandState.score}.`);
    }
  }, [gameState, dealerHand, deck, dealCard, playerHand, resolveBet, isHoleCardHidden, setMessage, dealerStand]);
  
  return {
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
    dealerRevealCard,
    dealerHit,
    dealerStand,
    playerScore: playerHand.score, 
    dealerScore: dealerHand.score,
  };
};
