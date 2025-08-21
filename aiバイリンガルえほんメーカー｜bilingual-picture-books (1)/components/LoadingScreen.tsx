
import React from 'react';

interface LoadingScreenProps {
  message: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-amber-100/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="text-center p-8">
        <div className="relative w-40 h-40 mx-auto">
          <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping opacity-50"></div>
          <div className="absolute inset-0 bg-orange-400 rounded-full animate-pulse opacity-60"></div>
          <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center text-6xl shadow-inner">
            📖
          </div>
        </div>
        <h2 className="text-3xl font-display text-amber-700 mt-8 animate-bounce">絵本を作成中...</h2>
        <p className="text-slate-600 text-lg mt-4">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
