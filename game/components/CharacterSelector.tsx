
import React, { useState } from 'react';
import { Character } from '../types';

interface CharacterSelectorProps {
  characters: Character[];
  onSelect: (char: Character) => void;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({ characters, onSelect }) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="flex w-full h-full relative font-sans overflow-hidden bg-black">
      {/* Title Overlay */}
      <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 z-20 pointer-events-none text-center w-full">
        <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-widest drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
            ELIGE TU MELLI
        </h1>
      </div>

      {/* Characters */}
      {characters.map((char) => (
         <div 
            key={char.id}
            className={`
                relative h-full transition-all duration-500 ease-in-out cursor-pointer flex items-center justify-center p-4 md:p-12
                ${hovered && hovered !== char.id ? 'w-[35%] grayscale brightness-50' : 'w-[50%]'}
                ${hovered === char.id ? 'w-[65%] z-10' : ''}
            `}
            style={{ backgroundColor: char.id === 'otto' ? '#ff9900' : '#d600ff' }}
            onMouseEnter={() => setHovered(char.id)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect(char)}
         >
            {/* Marco del Personaje */}
            <div className={`
                relative w-full h-[70%] max-w-2xl border-[12px] border-white shadow-[0_0_40px_rgba(0,0,0,0.4)] overflow-hidden bg-black/20 backdrop-blur-sm transition-transform duration-300
                ${hovered === char.id ? 'scale-105' : 'scale-100'}
            `}>
                {/* Imagen Centrada y Completa */}
                <img 
                    src={hovered === char.id ? char.imageActive : char.image} 
                    alt={char.name}
                    className="w-full h-full object-contain p-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
                />

                {/* Nombre del Personaje en el marco */}
                <div className="absolute bottom-0 left-0 w-full bg-white text-black py-2 md:py-4 text-center">
                    <span className="text-2xl md:text-4xl font-black tracking-tighter uppercase">
                        {char.name}
                    </span>
                </div>
            </div>

            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
         </div>
      ))}
    </div>
  );
};

export default CharacterSelector;
