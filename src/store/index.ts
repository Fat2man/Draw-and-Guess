import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Player, Message, GameState } from '@/types';

export const useGameStore = defineStore('game', () => {
  const players = ref<Player[]>([]);
  const messages = ref<Message[]>([]);
  const currentPlayerId = ref<string>('');
  const userId = ref<string>('');
  const gameState = ref<GameState>('waiting');
  const currentWord = ref<string>('');
  const wordOptions = ref<string[]>([]);
  const roundTime = ref<number>(60);
  const timeLeft = ref<number>(60);
  const round = ref<number>(0);
  const maxRounds = ref<number>(3);

  // Mock player data
  const mockPlayers: Player[] = [
    { id: '1', name: 'Player 1', score: 0, avatar: '👨‍🎨' },
    { id: '2', name: 'Player 2', score: 0, avatar: '👩‍🎨' },
    { id: '3', name: 'Player 3', score: 0, avatar: '👨‍🚀' },
    { id: '4', name: 'Player 4', score: 0, avatar: '👩‍🚀' },
  ];

  // Mock words for drawing
  const allWords = [
    'apple', 'banana', 'car', 'dog', 'elephant',
    'fish', 'guitar', 'house', 'ice cream', 'jet',
    'kangaroo', 'lamp', 'mountain', 'notebook', 'ocean',
    'pizza', 'queen', 'rainbow', 'sun', 'train'
  ];

  // Timer interval reference
  let timerInterval: number | null = null;

  // Initialize game state
  function initialize() {
    // Set mock data for development
    userId.value = '1'; // Assume current user is player 1
    players.value = mockPlayers;
    messages.value = [
      {
        id: '1',
        userId: 'system',
        text: 'Welcome to Draw and Guess! Click "Start Game" to begin.',
        type: 'system',
        timestamp: new Date().toISOString(),
        isCorrect: false
      }
    ];
  }

  function startGame() {
    if (gameState.value !== 'waiting' && gameState.value !== 'finished') {
      return;
    }

    round.value = 1;
    resetPlayerScores();
    startNewRound();

    messages.value.push({
      id: Date.now().toString(),
      userId: 'system',
      text: 'Game started! Get ready to draw or guess.',
      type: 'system',
      timestamp: new Date().toISOString(),
      isCorrect: false
    });
  }

  function startNewRound() {
    // Determine next player
    const currentPlayerIndex = players.value.findIndex(p => p.id === currentPlayerId.value);
    const nextPlayerIndex = currentPlayerIndex >= 0 && currentPlayerIndex < players.value.length - 1
      ? currentPlayerIndex + 1
      : 0;

    currentPlayerId.value = players.value[nextPlayerIndex].id;

    // Select random words for options
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    wordOptions.value = shuffled.slice(0, 3);

    // Auto-select a word for now (in a real app, the drawer would choose)
    currentWord.value = wordOptions.value[0];

    gameState.value = 'playing';
    timeLeft.value = roundTime.value;

    // Start timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    timerInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        endRound();
      }
    }, 1000);

    messages.value.push({
      id: Date.now().toString(),
      userId: 'system',
      text: `Round ${round.value}: ${getPlayerById(currentPlayerId.value)?.name} is drawing now!`,
      type: 'system',
      timestamp: new Date().toISOString(),
      isCorrect: false
    });
  }

  function endRound() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    gameState.value = 'roundEnd';

    messages.value.push({
      id: Date.now().toString(),
      userId: 'system',
      text: `Round ended! The word was "${currentWord.value}"`,
      type: 'system',
      timestamp: new Date().toISOString(),
      isCorrect: false
    });

    round.value++;

    // Check if the game is over
    if (round.value > maxRounds.value) {
      endGame();
      return;
    }

    // Start new round after delay
    setTimeout(() => {
      startNewRound();
    }, 3000);
  }

  function endGame() {
    gameState.value = 'finished';

    // Find winner
    const winner = [...players.value].sort((a, b) => b.score - a.score)[0];

    messages.value.push({
      id: Date.now().toString(),
      userId: 'system',
      text: `Game over! ${winner.name} wins with ${winner.score} points!`,
      type: 'system',
      timestamp: new Date().toISOString(),
      isCorrect: false
    });
  }

  function resetPlayerScores() {
    players.value.forEach(player => {
      player.score = 0;
    });
  }

  function getPlayerById(id: string): Player | undefined {
    return players.value.find(p => p.id === id);
  }

  function sendMessage(message: Message) {
    messages.value.push(message);

    // Check if the guess is correct
    if (message.isCorrect && gameState.value === 'playing' && message.userId !== currentPlayerId.value) {
      // Award points
      const player = getPlayerById(message.userId);
      if (player) {
        player.score += 10;

        // Also give points to the drawer
        const drawer = getPlayerById(currentPlayerId.value);
        if (drawer) {
          drawer.score += 5;
        }

        // End round early but without the default system message
        endRoundWithCorrectGuess(player.name);
      }
    }
  }

  function endRoundWithCorrectGuess(playerName: string) {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    gameState.value = 'roundEnd';

    messages.value.push({
      id: Date.now().toString(),
      userId: 'system',
      text: `${playerName} guessed the word correctly! +10 points. The word was "${currentWord.value}"`,
      type: 'system',
      timestamp: new Date().toISOString(),
      isCorrect: false
    });

    round.value++;

    // Check if the game is over
    if (round.value > maxRounds.value) {
      endGame();
      return;
    }

    // Start new round after delay
    setTimeout(() => {
      startNewRound();
    }, 3000);
  }

  function isCorrectGuess(text: string): boolean {
    if (gameState.value !== 'playing' || currentPlayerId.value === userId.value) {
      return false;
    }

    const normalizedGuess = text.trim().toLowerCase();
    const normalizedWord = currentWord.value.trim().toLowerCase();

    return normalizedGuess === normalizedWord;
  }

  return {
    players,
    messages,
    currentPlayerId,
    userId,
    gameState,
    currentWord,
    wordOptions,
    round,
    maxRounds,
    timeLeft,

    initialize,
    startGame,
    sendMessage,
    isCorrectGuess,
    endRound
  };
});