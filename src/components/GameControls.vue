<template>
  <div class="p-4 bg-white rounded-lg shadow-md">
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-2">
        <button 
          v-if="isDrawing && gameState === 'playing'"
          @click="$emit('clear-canvas')" 
          class="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
        >
          Clear Canvas
        </button>
      </div>
      
      <div>
        <button 
          v-if="gameState === 'waiting' || gameState === 'finished'"
          @click="$emit('start-game')" 
          class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded transition"
        >
          {{ gameState === 'finished' ? 'Play Again' : 'Start Game' }}
        </button>
        
        <div v-else-if="gameState === 'playing'" class="flex items-center gap-2">
          <span class="text-gray-700 font-medium">Drawing Tools:</span>
          <div class="flex gap-2">
            <button 
              v-for="tool in drawingTools"
              :key="tool.name"
              class="w-10 h-10 rounded-full flex items-center justify-center border border-gray-300"
              :class="{ 'bg-blue-100': selectedTool === tool.name }"
              :title="tool.name"
              @click="selectTool(tool.name)"
            >
              {{ tool.icon }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import type { GameState } from '../types';

const props = defineProps<{
  isDrawing: boolean;
  gameState: GameState;
}>();

defineEmits<{
  (e: 'clear-canvas'): void;
  (e: 'start-game'): void;
}>();

const selectedTool = ref('brush');

const drawingTools = [
  { name: 'brush', icon: '✏️' },
  { name: 'eraser', icon: '🧽' },
  { name: 'fill', icon: '🪣' },
];

function selectTool(tool: string) {
  selectedTool.value = tool;
}
</script>