
import React, { useState } from 'react';

interface GameOverProps {
  score: number;
  comment: string;
  onSave: (name: string, score: number) => void;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, comment, onSave, onRestart }) => {
  const [name, setName] = useState('');

  return (
    <div className="bg-black/80 p-8 rounded-2xl border-4 border-red-500 max-w-sm w-full z-20 flex flex-col items-center gap-6 animate-scale-in">
      <h2 className="text-3xl text-red-500 font-bold">GAME OVER</h2>
      
      <div className="text-center">
        <p className="text-gray-400 text-xs mb-1">PUNTAJE FINAL</p>
        <p className="text-4xl text-yellow-400 font-bold">{score}</p>
      </div>

      {comment && (
        <div className="bg-white/10 p-4 rounded-lg italic text-sm text-center text-yellow-100 border-l-4 border-yellow-400">
          "{comment}"
          <p className="text-[10px] text-yellow-500 mt-2 font-normal non-italic">— Maestro Roshi</p>
        </div>
      )}

      <div className="w-full space-y-4">
        <div>
          <label className="text-[10px] text-gray-500 mb-2 block uppercase">Tu Nombre:</label>
          <input 
            type="text" 
            maxLength={8}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-900 border-2 border-gray-700 text-white p-3 rounded text-center focus:border-yellow-400 outline-none uppercase"
            placeholder="Kakarotto"
          />
        </div>

        <button 
          onClick={() => onSave(name, score)}
          className="w-full bg-green-600 hover:bg-green-500 text-white p-4 rounded border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
        >
          GUARDAR SCORE
        </button>

        <button 
          onClick={onRestart}
          className="w-full bg-gray-600 hover:bg-gray-500 text-white p-4 rounded border-b-4 border-gray-800 active:border-b-0 active:translate-y-1 transition-all text-xs"
        >
          REINTENTAR
        </button>
      </div>
    </div>
  );
};

export default GameOver;
