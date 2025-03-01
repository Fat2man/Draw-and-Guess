<template>
  <div class="bg-white rounded-lg shadow-md flex flex-col h-[400px]">
    <div class="p-2 bg-blue-600 text-white font-bold rounded-t-lg">
      Chat
    </div>
    
    <div class="flex-1 p-2 overflow-y-auto" ref="messagesContainer">
      <div
        v-for="message in messages"
        :key="message.id"
        class="mb-2 p-2 rounded"
        :class="{
          'bg-gray-100': message.type === 'user',
          'bg-green-100': message.isCorrect,
          'bg-blue-100': message.type === 'system',
          'font-semibold': message.type === 'system'
        }"
      >
        <div v-if="message.type === 'user'" class="flex items-start">
          <span class="font-bold mr-2">
            {{ getPlayerName(message.userId) }}:
          </span>
          <span>{{ message.text }}</span>
        </div>
        <div v-else class="text-center">
          {{ message.text }}
        </div>
      </div>
    </div>
    
    <div class="p-2 border-t">
      <form @submit.prevent="sendMessage" class="flex">
        <input
          type="text"
          v-model="newMessage"
          placeholder="Type your guess..."
          class="flex-1 border rounded-l px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          :disabled="disabled"
        />
        <button
          type="submit"
          class="bg-blue-600 text-white px-3 py-1 rounded-r hover:bg-blue-700 transition"
          :disabled="disabled || !newMessage.trim()"
          :class="{ 'opacity-50 cursor-not-allowed': disabled || !newMessage.trim() }"
        >
          Send
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUpdated, nextTick } from 'vue';
import { useGameStore } from '../store';
import type { Message } from '../types';

const props = defineProps<{
  messages: Message[];
  disabled: boolean;
}>();

const emit = defineEmits<{
  (e: 'send-message', text: string): void;
}>();

const gameStore = useGameStore();
const newMessage = ref('');
const messagesContainer = ref<HTMLDivElement | null>(null);

// Auto-scroll to bottom when new messages arrive
watch(() => props.messages.length, async () => {
  await nextTick();
  scrollToBottom();
});

onUpdated(() => {
  scrollToBottom();
});

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}

function sendMessage() {
  if (!newMessage.value.trim() || props.disabled) {
    return;
  }
  
  // Emit the message to parent component
  const text = newMessage.value.trim();
  newMessage.value = '';
  
  emit('send-message', text);
}

function getPlayerName(userId: string): string {
  if (userId === 'system') return 'System';
  
  const player = gameStore.players.find(p => p.id === userId);
  return player?.name || 'Unknown Player';
}
</script>