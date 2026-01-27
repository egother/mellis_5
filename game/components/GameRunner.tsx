
import React, { useRef, useEffect, useState } from 'react';
import { Character, Obstacle, Collectible } from '../types';
import { 
  GRAVITY, 
  JUMP_FORCE, 
  GROUND_HEIGHT, 
  INITIAL_SPEED, 
  SPEED_INCREMENT, 
  OBSTACLE_TYPES,
  BACKGROUND_IMAGE,
  DRAGON_BALL_IMAGES
} from '../constants';

interface GameRunnerProps {
  character: Character;
  onGameOver: (score: number) => void;
}

const GameRunner: React.FC<GameRunnerProps> = ({ character, onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  
  // Load images
  const playerImgRef = useRef<HTMLImageElement>(new Image());
  const bgImgRef = useRef<HTMLImageElement>(new Image());
  const dbImgsRef = useRef<HTMLImageElement[]>([]);
  const obsImgsRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    playerImgRef.current.src = character.imageGame; 
    bgImgRef.current.src = BACKGROUND_IMAGE;
    
    // Load Dragon Balls
    dbImgsRef.current = DRAGON_BALL_IMAGES.map(src => {
        const img = new Image();
        img.src = src;
        return img;
    });

    // Load Obstacles
    OBSTACLE_TYPES.forEach(type => {
        const img = new Image();
        img.src = type.image;
        obsImgsRef.current[type.type] = img;
    });

  }, [character]);

  const gameStateRef = useRef({
    playerY: 0,
    playerVelocity: 0,
    isJumping: false,
    obstacles: [] as Obstacle[],
    collectibles: [] as Collectible[],
    speed: INITIAL_SPEED,
    frameCount: 0,
    score: 0,
    isGameOver: false,
    bgOffset: 0
  });

  const jump = () => {
    if (!gameStateRef.current.isJumping) {
      gameStateRef.current.playerVelocity = JUMP_FORCE;
      gameStateRef.current.isJumping = true;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gameStateRef.current.playerY = canvas.height - GROUND_HEIGHT - 100; // Initial Y
    };
    resize();
    window.addEventListener('resize', resize);

    const handleAction = (e: any) => {
        if (e.type === 'touchstart') e.preventDefault();
        jump();
    }
    window.addEventListener('keydown', (e) => { if (e.code === 'Space' || e.code === 'ArrowUp') jump(); });
    window.addEventListener('mousedown', handleAction);
    window.addEventListener('touchstart', handleAction, { passive: false });

    let animationFrameId: number;

    const spawnObstacle = () => {
      const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      gameStateRef.current.obstacles.push({
        x: canvas.width,
        y: canvas.height - GROUND_HEIGHT - type.height,
        ...type,
        speed: gameStateRef.current.speed
      });
    };

    const spawnCollectible = () => {
        // Random Height: Low (Jump needed or run?), Mid (Jump), High (High Jump)
        // Let's make 3 lanes: Ground level (+20), Jump Level (-100), High (-200)
        const heights = [
            canvas.height - GROUND_HEIGHT - 60, // Run to get
            canvas.height - GROUND_HEIGHT - 180, // Single jump
            canvas.height - GROUND_HEIGHT - 280  // High jump peak
        ];
        const y = heights[Math.floor(Math.random() * heights.length)];
        
        gameStateRef.current.collectibles.push({
            id: Date.now(),
            x: canvas.width,
            y: y,
            width: 50,
            height: 50,
            speed: gameStateRef.current.speed,
            imageIndex: Math.floor(Math.random() * 7)
        });
    }

    const draw = () => {
      if (gameStateRef.current.isGameOver) return;

      const { frameCount, speed, playerY, isJumping } = gameStateRef.current;

      // 1. DRAW BACKGROUND
      gameStateRef.current.bgOffset -= speed * 0.5;
      if (bgImgRef.current.complete) {
        const patternWidth = bgImgRef.current.width * (canvas.height / bgImgRef.current.height);
        const relativeOffset = gameStateRef.current.bgOffset % patternWidth;
        
        ctx.drawImage(bgImgRef.current, relativeOffset, 0, patternWidth, canvas.height);
        ctx.drawImage(bgImgRef.current, relativeOffset + patternWidth, 0, patternWidth, canvas.height);
        if (relativeOffset + patternWidth * 2 < canvas.width) {
             ctx.drawImage(bgImgRef.current, relativeOffset + patternWidth * 2, 0, patternWidth, canvas.height);
        }
      } else {
        ctx.fillStyle = '#333';
        ctx.fillRect(0,0, canvas.width, canvas.height);
      }

      // 2. PLAYER LOGIC
      gameStateRef.current.playerVelocity += GRAVITY;
      gameStateRef.current.playerY += gameStateRef.current.playerVelocity;

      const floor = canvas.height - GROUND_HEIGHT - 120;
      if (gameStateRef.current.playerY > floor) {
        gameStateRef.current.playerY = floor;
        gameStateRef.current.playerVelocity = 0;
        gameStateRef.current.isJumping = false;
      }

      // 3. DRAW PLAYER
      const pH = 120;
      let pW = 100; // Default fallback width
      
      // Calculate width based on aspect ratio to avoid squashing
      if (playerImgRef.current.complete && playerImgRef.current.naturalHeight !== 0) {
          pW = pH * (playerImgRef.current.naturalWidth / playerImgRef.current.naturalHeight);
      }
      
      ctx.save();
      let bobY = 0;
      if (!isJumping) {
          bobY = Math.sin(frameCount * 0.2) * 5;
      }
      
      ctx.translate(50, gameStateRef.current.playerY + bobY);
      
      if (playerImgRef.current.complete) {
          ctx.drawImage(playerImgRef.current, 0, 0, pW, pH);
      } else {
          ctx.fillStyle = character.color;
          ctx.fillRect(0,0, pW, pH);
      }
      ctx.restore();

      // 4. OBSTACLES
      if (frameCount % 100 === 0) spawnObstacle();

      gameStateRef.current.obstacles = gameStateRef.current.obstacles.filter(obs => {
        obs.x -= speed;

        const pBox = { 
            x: 50 + 20, 
            y: gameStateRef.current.playerY + 20, 
            w: pW - 40, 
            h: pH - 40 
        };
        
        if (
          pBox.x < obs.x + obs.width &&
          pBox.x + pBox.w > obs.x &&
          pBox.y < obs.y + obs.height &&
          pBox.y + pBox.h > obs.y
        ) {
          gameStateRef.current.isGameOver = true;
          onGameOver(Math.floor(gameStateRef.current.score));
          return false;
        }

        // Draw Obstacle
        const obsImg = obsImgsRef.current[obs.type];
        if (obsImg && obsImg.complete && obsImg.naturalHeight !== 0) {
            // Maintain aspect ratio based on height
            const ratio = obsImg.naturalWidth / obsImg.naturalHeight;
            const newWidth = obs.height * ratio;
            
            // Update logical width for collision to match visual
            obs.width = newWidth;
            
            ctx.drawImage(obsImg, obs.x, obs.y, newWidth, obs.height);
        } else {
             ctx.fillStyle = obs.color || 'red'; // Fallback
             ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
             ctx.strokeStyle = 'black';
             ctx.lineWidth = 3;
             ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
        }

        return obs.x + obs.width > 0;
      });

      // 5. COLLECTIBLES (DRAGON BALLS)
      // Spawn slightly less often than obstacles
      if (frameCount % 250 === 0) spawnCollectible();

      gameStateRef.current.collectibles = gameStateRef.current.collectibles.filter(ball => {
          ball.x -= speed;

          // Collision check
          const pBox = { 
            x: 50, 
            y: gameStateRef.current.playerY, 
            w: pW, 
            h: pH 
          };

          // Circle collision might be better, but Box is consistent
          if (
              pBox.x < ball.x + ball.width &&
              pBox.x + pBox.w > ball.x &&
              pBox.y < ball.y + ball.height &&
              pBox.y + pBox.h > ball.y
            ) {
              // Collected!
              gameStateRef.current.score += 500; // Big Bonus!
              // Visual flair could go here (particle effect)
              return false; // Remove from array
            }

          // Draw Ball
          const img = dbImgsRef.current[ball.imageIndex];
          if (img && img.complete) {
              // Add a floating effect
              const floatY = Math.sin(frameCount * 0.1) * 10;
              ctx.drawImage(img, ball.x, ball.y + floatY, ball.width, ball.height);
          } else {
              ctx.fillStyle = 'orange';
              ctx.beginPath();
              ctx.arc(ball.x + 25, ball.y + 25, 25, 0, Math.PI*2);
              ctx.fill();
          }

          return ball.x + ball.width > -100;
      });


      gameStateRef.current.score += 0.1;
      gameStateRef.current.speed += SPEED_INCREMENT;
      gameStateRef.current.frameCount++;
      setScore(Math.floor(gameStateRef.current.score));

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousedown', handleAction);
      window.removeEventListener('touchstart', handleAction);
    };
  }, [character, onGameOver]);

  return (
    <div className="w-full h-full cursor-pointer overflow-hidden touch-none relative">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 right-4 pointer-events-none">
        <div className="bg-black/50 px-6 py-2 rounded-full border-2 border-white backdrop-blur-sm">
          <span className="text-xl text-white font-bold font-mono">{score.toString().padStart(5, '0')}</span>
        </div>
      </div>
    </div>
  );
};

export default GameRunner;
