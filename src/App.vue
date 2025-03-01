<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <h1 class="text-2xl font-bold text-center">Draw and Guess Game</h1>
    </header>
    
    <main class="flex-1 p-4 container mx-auto flex flex-col lg:flex-row gap-4">
      <div class="lg:w-3/4 flex flex-col gap-4">
        <WordPanel v-if="currentPlayer" :isDrawing="isDrawing" :word="gameStore.currentWord" />
        
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <Canvas 
            :isDrawing="isDrawing" 
            :disabled="!isDrawing || gameStore.gameState !== 'playing'"
          />
        </div>
        
        <GameControls 
          :isDrawing="isDrawing" 
          @clear-canvas="clearCanvas" 
          @start-game="startGame"
          :gameState="gameStore.gameState"
        />
      </div>
      
      <div class="lg:w-1/4 flex flex-col gap-4">
        <PlayersList 
          :players="gameStore.players" 
          :currentPlayerId="gameStore.currentPlayerId" 
          :userId="gameStore.userId"
        />
        <ChatBox 
          :messages="gameStore.messages" 
          @send-message="sendMessage" 
          :disabled="isDrawing"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useGameStore } from './store';
import Canvas from './components/Canvas.vue';
import GameControls from './components/GameControls.vue';
import ChatBox from './components/ChatBox.vue';
import WordPanel from './components/WordPanel.vue';
import PlayersList from './components/PlayersList.vue';
import type { Message } from './types';

const gameStore = useGameStore();
const canvasRef = ref<InstanceType<typeof Canvas> | null>(null);

const isDrawing = computed(() => 
  gameStore.currentPlayerId === gameStore.userId && 
  gameStore.gameState === 'playing'
);

const currentPlayer = computed(() => 
  gameStore.players.find(p => p.id === gameStore.currentPlayerId)
);

// Methods
const clearCanvas = () => {
  canvasRef.value?.clearCanvas();
};

const startGame = () => {
  gameStore.startGame();
};

const sendMessage = (text: string) => {
  gameStore.sendMessage({
    id: Date.now().toString(),
    userId: gameStore.userId,
    text,
    type: 'user',
    timestamp: new Date().toISOString(),
    isCorrect: gameStore.isCorrectGuess(text)
  });
};

onMounted(() => {
  gameStore.initialize();
});
</script>