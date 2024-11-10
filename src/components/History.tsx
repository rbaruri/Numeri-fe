import React from 'react';
import { useDrawingStore, HistoryItem } from '../store/useDrawingStore';
import { Clock } from 'lucide-react';

export const History: React.FC = () => {
  const { history, setSelectedHistoryItem, selectedHistoryItem } = useDrawingStore();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Clock size={24} />
        History
      </h2>
      <div className="space-y-4">
        {history.map((item: HistoryItem) => (
          <div
            key={item.id}
            onClick={() => setSelectedHistoryItem(item)}
            className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer
              ${selectedHistoryItem?.id === item.id ? 'ring-2 ring-blue-500 shadow-md' : ''}`}
          >
            <img
              src={item.image}
              alt="Drawing"
              className="w-full h-32 object-contain bg-gray-50 rounded mb-2"
            />
            <div className="text-sm text-gray-500">{formatDate(item.timestamp)}</div>
            <div className="mt-2">
              <div className="font-medium">Answer:</div>
              <div className="text-gray-700">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};