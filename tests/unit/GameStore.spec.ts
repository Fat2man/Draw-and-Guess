import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useGameStore } from '@/store';

describe('Game Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    setActivePinia(createPinia());

    // Mock timer functions
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with the correct state', () => {
    const store = useGameStore();

    expect(store.players).toEqual([]);
    expect(store.messages).toEqual([]);
    expect(store.currentPlayerId).toBe('');
    expect(store.userId).toBe('');
    expect(store.gameState).toBe('waiting');
    expect(store.currentWord).toBe('');
  });

  it('initializes game data on initialize()', () => {
    const store = useGameStore();
    store.initialize();

    expect(store.userId).toBe('1');
    expect(store.players.length).toBe(4);
    expect(store.messages.length).toBe(1);
    expect(store.messages[0].type).toBe('system');
  });

  it('starts the game correctly', () => {
    const store = useGameStore();
    store.initialize();
    store.startGame();

    expect(store.gameState).toBe('playing');
    expect(store.round).toBe(1);
    expect(store.currentPlayerId).not.toBe('');
    expect(store.currentWord).not.toBe('');
    expect(store.messages.length).toBe(3); // Initial + game started + round message
  });

  it('correctly identifies correct guesses', () => {
    const store = useGameStore();
    store.initialize();
    store.startGame();

    // Mock current state
    store.userId = '2'; // Not the current drawer
    const originalWord = store.currentWord;

    expect(store.isCorrectGuess(originalWord)).toBe(true);
    expect(store.isCorrectGuess(originalWord.toUpperCase())).toBe(true);
    expect(store.isCorrectGuess(`  ${originalWord}  `)).toBe(true);
    expect(store.isCorrectGuess('wrong guess')).toBe(false);

    // Drawer cannot guess
    store.userId = store.currentPlayerId;
    expect(store.isCorrectGuess(originalWord)).toBe(false);
  });

  it('awards points for correct guesses', () => {
    const store = useGameStore();
    store.initialize();
    store.startGame();

    // Setup
    store.userId = '2';
    const guessingPlayer = store.players.find(p => p.id === '2')!;
    const drawingPlayer = store.players.find(p => p.id === store.currentPlayerId)!;
    const originalDrawerScore = drawingPlayer.score;
    const originalGuesserScore = guessingPlayer.score;

    // Submit a correct guess
    store.sendMessage({
      id: '1000',
      userId: '2',
      text: store.currentWord,
      type: 'user',
      timestamp: new Date().toISOString(),
      isCorrect: true
    });

    // Check scores were updated
    expect(guessingPlayer.score).toBe(originalGuesserScore + 10);
    expect(drawingPlayer.score).toBe(originalDrawerScore + 5);

    // Check that a system message was added
    const lastMessage = store.messages[store.messages.length - 1];
    expect(lastMessage.type).toBe('system');
    expect(lastMessage.text).toContain('guessed the word correctly');
  });

  it('ends the game after the maximum number of rounds', () => {
    const store = useGameStore();
    store.initialize();
    store.startGame();

    // Fast forward through rounds
    store.round = store.maxRounds;
    store.endRound();

    expect(store.gameState).toBe('finished');

    // Check for game over message
    const lastMessage = store.messages[store.messages.length - 1];
    expect(lastMessage.type).toBe('system');
    expect(lastMessage.text).toContain('Game over');
    expect(lastMessage.text).toContain('wins with');
  });
});