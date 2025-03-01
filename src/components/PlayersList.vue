<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <h2 class="text-lg font-bold mb-4">Players</h2>
    
    <div class="space-y-2">
      <div 
        v-for="player in players" 
        :key="player.id"
        class="flex items-center justify-between p-2 rounded"
        :class="{
          'bg-yellow-100': player.id === currentPlayerId,
          'bg-blue-100': player.id === userId && player.id !== currentPlayerId
        }"
      >
        <div class="flex items-center gap-2">
          <span class="text-2xl">{{ player.avatar }}</span>
          <span class="font-medium">{{ player.name }}</span>
          <span v-if="player.id === currentPlayerId" class="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded">
            Drawing
          </span>
          <span v-else-if="player.id === userId" class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
            You
          </span>
        </div>
        
        <div class="font-bold">{{ player.score }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { Player } from '@/types';

defineProps<{
  players: Player[];
  currentPlayerId: string;
  userId: string;
}>();
</script>