import { create } from 'zustand';

interface DrawingState {
  history: HistoryItem[];
  currentColor: string;
  brushSize: number;
  eraserSize: number;
  isErasing: boolean;
  selectedHistoryItem: HistoryItem | null;
  addToHistory: (item: Omit<HistoryItem, 'id'>) => void;
  setCurrentColor: (color: string) => void;
  setBrushSize: (size: number) => void;
  setEraserSize: (size: number) => void;
  setIsErasing: (isErasing: boolean) => void;
  setSelectedHistoryItem: (item: HistoryItem | null) => void;
}

export interface HistoryItem {
  id: string;
  image: string;
  question: string;
  answer: string;
  timestamp: number;
}

export const useDrawingStore = create<DrawingState>((set) => ({
  history: [],
  currentColor: '#000000',
  brushSize: 5,
  eraserSize: 20,
  isErasing: false,
  selectedHistoryItem: null,
  addToHistory: (item) =>
    set((state) => ({
      history: [
        { ...item, id: crypto.randomUUID() },
        ...state.history,
      ],
    })),
  setCurrentColor: (color) => set({ currentColor: color }),
  setBrushSize: (size) => set({ brushSize: size }),
  setEraserSize: (size) => set({ eraserSize: size }),
  setIsErasing: (isErasing) => set({ isErasing }),
  setSelectedHistoryItem: (item) => set({ selectedHistoryItem: item }),
}));