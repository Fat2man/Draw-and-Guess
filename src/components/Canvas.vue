<template>
  <div class="relative w-full">
    <canvas
      ref="canvasRef"
      @mousedown="startDrawing"
      @mousemove="draw"
      @mouseup="stopDrawing"
      @mouseleave="stopDrawing"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="stopDrawing"
      class="border-2 border-gray-300 bg-white w-full h-[400px] cursor-crosshair"
      :class="{ 'cursor-not-allowed': disabled }"
      :style="{ pointerEvents: disabled ? 'none' : 'auto' }"
    ></canvas>
    
    <div v-if="isDrawing" class="absolute top-2 right-2 flex gap-2 p-2 bg-white bg-opacity-70 rounded-lg">
      <div class="flex flex-col items-center">
        <label class="text-xs text-gray-600">Color</label>
        <input
          type="color"
          v-model="strokeColor"
          class="w-8 h-8 border-none cursor-pointer"
        />
      </div>
      <div class="flex flex-col items-center">
        <label class="text-xs text-gray-600">Size</label>
        <input
          type="range"
          v-model="strokeWidth"
          min="1"
          max="20"
          class="w-24"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineExpose } from 'vue';

const props = defineProps<{
  isDrawing: boolean;
  disabled: boolean;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const isDrawingActive = ref(false);
const strokeColor = ref('#000000');
const strokeWidth = ref(5);

// Initialize canvas
onMounted(() => {
  if (!canvasRef.value) return;
  
  const canvas = canvasRef.value;
  context.value = canvas.getContext('2d');
  
  // Set canvas size to match display size
  resizeCanvas();
  
  // Listen for window resize
  window.addEventListener('resize', resizeCanvas);
  
  // Clean up event listener
  return () => {
    window.removeEventListener('resize', resizeCanvas);
  };
});

// Resize canvas to fit container
function resizeCanvas() {
  if (!canvasRef.value || !context.value) return;
  
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  
  // Set canvas dimensions to match displayed size
  canvas.width = rect.width;
  canvas.height = rect.height;
  
  // Restore drawing settings after resize
  if (context.value) {
    context.value.lineCap = 'round';
    context.value.lineJoin = 'round';
  }
}

// Drawing methods
function startDrawing(event: MouseEvent) {
  if (props.disabled || !props.isDrawing || !context.value) return;
  
  isDrawingActive.value = true;
  
  const { offsetX, offsetY } = getCoordinates(event);
  
  context.value.beginPath();
  context.value.moveTo(offsetX, offsetY);
  
  event.preventDefault();
}

function draw(event: MouseEvent) {
  if (!isDrawingActive.value || !context.value) return;
  
  const { offsetX, offsetY } = getCoordinates(event);
  
  context.value.strokeStyle = strokeColor.value;
  context.value.lineWidth = strokeWidth.value;
  context.value.lineTo(offsetX, offsetY);
  context.value.stroke();
  
  event.preventDefault();
}

function stopDrawing() {
  isDrawingActive.value = false;
}

// Touch support
function handleTouchStart(event: TouchEvent) {
  if (props.disabled || !props.isDrawing || !context.value || event.touches.length !== 1) return;
  
  const touch = event.touches[0];
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  
  startDrawing(mouseEvent);
  event.preventDefault();
}

function handleTouchMove(event: TouchEvent) {
  if (!isDrawingActive.value || !context.value || event.touches.length !== 1) return;
  
  const touch = event.touches[0];
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  
  draw(mouseEvent);
  event.preventDefault();
}

// Helper function to get coordinates relative to canvas
function getCoordinates(event: MouseEvent): { offsetX: number; offsetY: number } {
  if (!canvasRef.value) return { offsetX: 0, offsetY: 0 };
  
  const canvas = canvasRef.value;
  const rect = canvas.getBoundingClientRect();
  
  return {
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top
  };
}

// Clear canvas
function clearCanvas() {
  if (!canvasRef.value || !context.value) return;
  
  context.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
}

// Expose functions to parent component
defineExpose({
  clearCanvas
});
</script>