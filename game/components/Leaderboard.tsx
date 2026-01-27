
import React from 'react';
import { ScoreEntry } from '../types';
import { Trophy, ArrowLeft } from 'lucide-react';

interface LeaderboardProps {
  entries: ScoreEntry[];
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries, onBack }) => {
  return (
    <div className="bg-gray-900 p-8 rounded-2xl border-4 border-yellow-500 max-w-md w-full z-20 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl text-yellow-400 flex items-center gap-3">
          <Trophy className="text-yellow-400" /> TOP 5
        </h2>
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="space-y-3">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-xs">Aún no hay records.</p>
        ) : (
          entries.map((entry, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-3 rounded ${
                idx === 0 ? 'bg-yellow-400/10 border border-yellow-400/30' : 'bg-white/5'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`text-lg font-bold w-6 ${
                  idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'
                }`}>
                  {idx + 1}.
                </span>
                <div>
                  <div className="text-white text-sm">{entry.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase">{entry.character}</div>
                </div>
              </div>
              <div className="text-yellow-400 font-bold">{entry.score}</div>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={onBack}
        className="w-full mt-8 bg-orange-600 p-4 rounded text-white text-sm hover:bg-orange-500 border-b-4 border-orange-800"
      >
        VOLVER AL INICIO
      </button>
    </div>
  );
};

export default Leaderboard;
