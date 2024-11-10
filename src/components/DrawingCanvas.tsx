import React, { useRef, useEffect, useState } from 'react';
import { useDrawingStore } from '../store/useDrawingStore';
import { Eraser, Pencil } from 'lucide-react';

export const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { currentColor, brushSize, eraserSize, isErasing, setIsErasing, selectedHistoryItem, setSelectedHistoryItem } = useDrawingStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = currentColor;
    context.lineWidth = brushSize;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle = isErasing ? '#ffffff' : currentColor;
    contextRef.current.lineWidth = isErasing ? eraserSize : brushSize;
  }, [currentColor, brushSize, eraserSize, isErasing]);

  useEffect(() => {
    if (selectedHistoryItem) {
      const image = new Image();
      image.src = selectedHistoryItem.image;
      image.onload = () => {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        if (!canvas || !context) return;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [selectedHistoryItem]);

  const startDrawing = (e: React.MouseEvent) => {
    setSelectedHistoryItem(null);
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const stopDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setSelectedHistoryItem(null);
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 items-center">
        <button
          onClick={() => setIsErasing(false)}
          className={`p-2 rounded ${!isErasing ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          <Pencil size={20} />
        </button>
        <button
          onClick={() => setIsErasing(true)}
          className={`p-2 rounded ${isErasing ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          <Eraser size={20} />
        </button>
        <button
          onClick={clearCanvas}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border border-gray-300 rounded-lg bg-white cursor-crosshair"
        style={{ width: '100%', height: '400px' }}
      />
    </div>
  );
};