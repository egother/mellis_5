
import React from 'react';
import { Play, Trophy } from 'lucide-react';

interface MainMenuProps {
  onStart: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center gap-12 z-10 animate-fade-in p-4 text-center">
      <div className="relative">
        <h1 className="text-4xl md:text-6xl text-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,1)] tracking-tighter uppercase font-bold">
          Dragon Runner
        </h1>
        <p className="text-xs md:text-sm text-white mt-2 tracking-widest bg-black/40 px-2 py-1 rounded inline-block">
          PAOZU VALLEY ADVENTURE
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full max-w-xs">
        <button 
          onClick={onStart}
          className="bg-orange-600 hover:bg-orange-500 text-white p-6 rounded-lg border-b-8 border-orange-800 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-4 text-xl"
        >
          <Play fill="white" size={32} />
          JUGAR
        </button>
      </div>

      <p className="text-[10px] text-gray-400 mt-8 leading-relaxed">
        SALTA LOS OBSTÁCULOS <br/> PARA LLEGAR A LA CIMA
      </p>
    </div>
  );
};

export default MainMenu;
