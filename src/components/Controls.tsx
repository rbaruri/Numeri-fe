'use client'

import React from 'react'
import { useDrawingStore } from '../store/useDrawingStore'

const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500', '#800080']

export const Controls: React.FC = () => {
  const { currentColor, brushSize, eraserSize, isErasing, setCurrentColor, setBrushSize, setEraserSize } = useDrawingStore()

  return (
    <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
      <div className="w-1/4">
        <h1 className="text-xl font-bold">Numeri</h1>
      </div>
      <div className="flex gap-6 items-center justify-center w-1/2">
        <div className="flex gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setCurrentColor(color)}
              className={`w-8 h-8 rounded-full ${
                currentColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">
            {isErasing ? 'Eraser' : 'Brush'} Size:
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={isErasing ? eraserSize : brushSize}
            onChange={(e) => 
              isErasing
                ? setEraserSize(Number(e.target.value))
                : setBrushSize(Number(e.target.value))
            }
            className="w-32"
          />
          <span className="text-sm w-8">
            {isErasing ? eraserSize : brushSize}px
          </span>
        </div>
      </div>
      <div className="w-1/4"></div>
    </div>
  )
}