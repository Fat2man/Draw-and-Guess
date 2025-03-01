import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Canvas from '@/components/Canvas.vue';

describe('Canvas.vue', () => {
  let wrapper: ReturnType<typeof mount>;
  
  beforeEach(() => {
    wrapper = mount(Canvas, {
      props: {
        isDrawing: false,
        disabled: false
      }
    });
  });

  it('renders canvas element properly', () => {
    expect(wrapper.find('canvas').exists()).toBe(true);
  });

  it('shows color and size controls when in drawing mode', async () => {
    await wrapper.setProps({ isDrawing: true });
    expect(wrapper.find('input[type="color"]').exists()).toBe(true);
    expect(wrapper.find('input[type="range"]').exists()).toBe(true);
  });

  it('does not show color and size controls when not in drawing mode', () => {
    expect(wrapper.find('input[type="color"]').exists()).toBe(false);
    expect(wrapper.find('input[type="range"]').exists()).toBe(false);
  });

  it('applies disabled state correctly', async () => {
    await wrapper.setProps({
      isDrawing: false,
      disabled: true
    });
    
    const canvas = wrapper.find('canvas');
    expect(canvas.classes()).toContain('cursor-not-allowed');
  });

  it('exposes clearCanvas method', () => {
    expect(typeof wrapper.vm.clearCanvas).toBe('function');
  });

  it('handles mouse events for drawing', async () => {
    await wrapper.setProps({ isDrawing: true });
    
    // Mock canvas context
    const mockContext = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      clearRect: vi.fn()
    };
    
    // Mock getBoundingClientRect and getContext
    const mockCanvas = {
      getContext: () => mockContext,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 800, height: 600 }),
      width: 800,
      height: 600
    };
    
    // Set the mocked canvas
    wrapper.vm.canvasRef = mockCanvas as any;
    wrapper.vm.context = mockContext as any;
    
    // Simulate mouse events
    await wrapper.find('canvas').trigger('mousedown', {
      clientX: 100,
      clientY: 100
    });
    
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.moveTo).toHaveBeenCalledWith(100, 100);
    
    await wrapper.find('canvas').trigger('mousemove', {
      clientX: 150,
      clientY: 150
    });
    
    expect(mockContext.lineTo).toHaveBeenCalledWith(150, 150);
    expect(mockContext.stroke).toHaveBeenCalled();
  });
});