<template>
  <div 
    class="bg-white p-4 rounded-lg shadow-md mb-4 text-center"
    :class="{ 
      'bg-yellow-50': isDrawing,
      'bg-blue-50': !isDrawing && word
    }"
  >
    <h2 class="text-lg font-bold mb-2">
      {{ isDrawing ? 'Your Word:' : 'Guess the word:' }}
    </h2>
    
    <div v-if="isDrawing" class="text-2xl font-bold text-yellow-800">
      {{ word }}
    </div>
    
    <div v-else-if="word" class="text-2xl font-bold">
      {{ displayWord }}
    </div>
    
    <p v-if="isDrawing" class="mt-2 text-sm text-gray-600">
      Draw this word! Others will try to guess it.
    </p>
    
    <p v-else class="mt-2 text-sm text-gray-600">
      Type your guess in the chat box!
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{
  isDrawing: boolean;
  word: string;
}>();

// For non-drawers, display the word as underscores
const displayWord = computed(() => {
  if (!props.word) return '';
  
  return props.word
    .split('')
    .map(char => (char === ' ' ? ' ' : '_'))
    .join(' ');
});
</script>