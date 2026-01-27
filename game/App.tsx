
import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Character, ScoreEntry } from './types';
import { CHARACTERS } from './constants';
import MainMenu from './components/MainMenu';
import CharacterSelector from './components/CharacterSelector';
import GameRunner from './components/GameRunner';
import GameOver from './components/GameOver';
import Leaderboard from './components/Leaderboard';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [lastScore, setLastScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<ScoreEntry[]>([]);
  const [aiComment, setAiComment] = useState<string>('');

  // Load Leaderboard
  useEffect(() => {
    const saved = localStorage.getItem('dragon_runner_scores');
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    }
  }, []);

  const saveScore = (name: string, score: number) => {
    const newEntry: ScoreEntry = {
      name: name.toUpperCase() || 'ANON',
      score,
      character: selectedCharacter.name,
      date: new Date().toLocaleDateString()
    };
    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    setLeaderboard(updated);
    localStorage.setItem('dragon_runner_scores', JSON.stringify(updated));
    setGameState(GameState.LEADERBOARD);
  };

  const handleGameOver = async (score: number) => {
    setLastScore(score);
    setGameState(GameState.GAME_OVER);
    
    // Generate an AI comment about the performance using Gemini
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `Act as Master Roshi from Dragon Ball. Short comment (max 15 words) about ${selectedCharacter.name} achieving a score of ${score} in the Paozu Valley runner game. Be funny or encouraging in Spanish.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setAiComment(response.text || '¡Sigue entrenando, pequeño guerrero!');
    } catch (error) {
      setAiComment('¡Buen intento! Necesitas más entrenamiento.');
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-black select-none">
      {gameState === GameState.MENU && (
        <MainMenu onStart={() => setGameState(GameState.CHARACTER_SELECT)} />
      )}

      {gameState === GameState.CHARACTER_SELECT && (
        <CharacterSelector 
          characters={CHARACTERS} 
          onSelect={(char) => {
            setSelectedCharacter(char);
            setGameState(GameState.PLAYING);
          }} 
        />
      )}

      {gameState === GameState.PLAYING && (
        <GameRunner 
          character={selectedCharacter} 
          onGameOver={handleGameOver} 
        />
      )}

      {gameState === GameState.GAME_OVER && (
        <GameOver 
          score={lastScore} 
          comment={aiComment}
          onSave={saveScore} 
          onRestart={() => setGameState(GameState.CHARACTER_SELECT)}
        />
      )}

      {gameState === GameState.LEADERBOARD && (
        <Leaderboard 
          entries={leaderboard} 
          onBack={() => setGameState(GameState.MENU)} 
        />
      )}
    </div>
  );
};

export default App;
