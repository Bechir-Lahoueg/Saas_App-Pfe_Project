import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Icônes pour le jeu Memory
const memoryIcons = [
  '🚀', '🎮', '🎯', '⚽', '🎸', '🎨', 
  '🍕', '🍦', '🌈', '🌟', '🐶', '🦄'
];

// Types de réservations pour FastTap
const bookingTypes = [
  { type: "haircut", label: "Coiffure", icon: "💇", color: "bg-blue-100 border-blue-300" },
  { type: "spa", label: "Spa", icon: "💆", color: "bg-purple-100 border-purple-300" },
  { type: "nails", label: "Manucure", icon: "💅", color: "bg-pink-100 border-pink-300" },
  { type: "massage", label: "Massage", icon: "👐", color: "bg-green-100 border-green-300" },
  { type: "makeup", label: "Maquillage", icon: "💄", color: "bg-red-100 border-red-300" }
];

// Images pour le jeu Snake
const foodEmojis = ['🍎', '🍌', '🍇', '🍓', '🍕', '🍩', '🍦', '🍪'];

const GameCenter = () => {
const navigate = (path) => console.log(`Navigation vers: ${path}`);
  const [activeGame, setActiveGame] = useState('memory');
  
  // --- États partagés ---
  const [highScores, setHighScores] = useState({
    memory: null,
    fasttap: 0,
    snake: 0,
    puzzle: 0
  });

  useEffect(() => {
    // Charger les meilleurs scores du localStorage
    const memoryScore = localStorage.getItem('planifygo-memory-bestscore');
    const fastTapScore = localStorage.getItem('planifygo-fasttap-highscore');
    const snakeScore = localStorage.getItem('planifygo-snake-highscore');
    const puzzleScore = localStorage.getItem('planifygo-puzzle-highscore');
    
    setHighScores({
      memory: memoryScore ? JSON.parse(memoryScore) : null,
      fasttap: fastTapScore ? parseInt(fastTapScore) : 0,
      snake: snakeScore ? parseInt(snakeScore) : 0,
      puzzle: puzzleScore ? parseInt(puzzleScore) : 0
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800">PlanifyGo Games</h1>
            <p className="text-gray-600">Amusez-vous pendant que vous attendez!</p>
          </div>
        </div>
        
        {/* Sélection du jeu */}
        <div className="bg-white rounded-t-xl shadow-md p-4 flex gap-2 overflow-x-auto">
          <button 
            onClick={() => setActiveGame('memory')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeGame === 'memory' 
              ? 'bg-purple-600 text-white' 
              : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <span className="text-xl">🧠</span> Memory
          </button>
          
          <button 
            onClick={() => setActiveGame('fasttap')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeGame === 'fasttap' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <span className="text-xl">🎯</span> FastTap
          </button>
          
          <button 
            onClick={() => setActiveGame('snake')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeGame === 'snake' 
              ? 'bg-green-600 text-white' 
              : 'bg-green-50 text-green-700 hover:bg-green-100'
            }`}
          >
            <span className="text-xl">🐍</span> Snake
          </button>
          
          <button 
            onClick={() => setActiveGame('puzzle')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              activeGame === 'puzzle' 
              ? 'bg-amber-600 text-white' 
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <span className="text-xl">🧩</span> Puzzle
          </button>
        </div>
        
        {/* Container des jeux */}
        <div className="bg-white rounded-b-xl shadow-md mb-6 overflow-hidden">
          {activeGame === 'memory' && <MemoryGame highScore={highScores.memory} setHighScore={(score) => setHighScores({...highScores, memory: score})} />}
          {activeGame === 'fasttap' && <FastTapGame highScore={highScores.fasttap} setHighScore={(score) => setHighScores({...highScores, fasttap: score})} />}
          {activeGame === 'snake' && <SnakeGame highScore={highScores.snake} setHighScore={(score) => setHighScores({...highScores, snake: score})} />}
          {activeGame === 'puzzle' && <PuzzleGame highScore={highScores.puzzle} setHighScore={(score) => setHighScores({...highScores, puzzle: score})} />}
        </div>
        
        <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-indigo-800 mb-4">Pourquoi jouer à nos mini-jeux?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                <span className="text-2xl">🧘</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Anti-stress</h3>
              <p className="text-sm text-gray-600">Relaxez-vous et détendez-vous pendant quelques minutes</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Passe-temps idéal</h3>
              <p className="text-sm text-gray-600">Parfait pour patienter pendant les temps d'attente</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">Stimulation cognitive</h3>
              <p className="text-sm text-gray-600">Gardez votre esprit vif et améliorez vos réflexes</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Styles globaux pour tous les jeux */}
      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        
        .backface-hidden {
          backface-visibility: hidden;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes flyUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        
        .animate-flyUp {
          animation: flyUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// Composant Memory Game
const MemoryGame = ({ highScore, setHighScore }) => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  
  // Initialiser le jeu
  useEffect(() => {
    initGame();
  }, []);
  
  const initGame = () => {
    // Créer les paires de cartes et les mélanger
    const cardPairs = [...memoryIcons, ...memoryIcons].map((icon, index) => ({
      id: index,
      icon,
      isFlipped: false,
      isMatched: false
    }));
    
    // Mélanger les cartes
    for (let i = cardPairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }
    
    setCards(cardPairs);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);
    setStartTime(Date.now());
    setEndTime(null);
  };
  
  // Gérer le clic sur une carte
  const handleCardClick = (id) => {
    // Ignorer si déjà 2 cartes sont retournées ou si la carte est déjà retournée ou appariée
    if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
    
    // Ajouter la carte aux cartes retournées
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    
    // Vérifier si c'est la deuxième carte retournée
    if (newFlipped.length === 2) {
      // Augmenter le nombre de coups
      setMoves(moves + 1);
      
      // Vérifier si les deux cartes correspondent
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        // Cartes correspondantes
        setMatched([...matched, first, second]);
        setFlipped([]);
        
        // Vérifier si toutes les cartes sont appariées
        if (matched.length + 2 === cards.length) {
          const endTimeValue = Date.now();
          setEndTime(endTimeValue);
          setGameOver(true);
          
          // Calculer le score (basé sur les mouvements et le temps)
          const timeInSeconds = Math.floor((endTimeValue - startTime) / 1000);
          const score = {
            moves: moves + 1,
            time: timeInSeconds,
            date: new Date().toLocaleDateString()
          };
          
          // Vérifier si c'est un nouveau meilleur score
          if (!highScore || moves + 1 < highScore.moves || 
             (moves + 1 === highScore.moves && timeInSeconds < highScore.time)) {
            setHighScore(score);
            localStorage.setItem('planifygo-memory-bestscore', JSON.stringify(score));
          }
        }
      } else {
        // Cartes non correspondantes, les retourner après un délai
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };
  
  // Formater le temps
  const formatTime = (timeInMs) => {
    if (!timeInMs) return '00:00';
    const seconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-purple-600">Coups:</span>
          <span className="font-bold text-gray-800">{moves}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-purple-600">Temps:</span>
          <span className="font-bold text-gray-800">
            {endTime 
              ? formatTime(endTime - startTime) 
              : formatTime(startTime ? Date.now() - startTime : 0)}
          </span>
        </div>
        
        <button 
          onClick={initGame}
          className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Recommencer
        </button>
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
        {cards.map((card) => (
          <div 
            key={card.id} 
            className={`aspect-square cursor-pointer transition-all duration-300 transform ${
              flipped.includes(card.id) || matched.includes(card.id) 
                ? 'rotate-y-180' 
                : ''
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            <div className="relative w-full h-full preserve-3d">
              {/* Face arrière */}
              <div className={`absolute inset-0 backface-hidden ${
                flipped.includes(card.id) || matched.includes(card.id) 
                  ? 'hidden' 
                  : 'block'
              } bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg border-2 border-purple-200 flex items-center justify-center`}>
                <span className="text-white text-2xl font-bold">?</span>
              </div>
              
              {/* Face avant */}
              <div className={`absolute inset-0 backface-hidden ${
                flipped.includes(card.id) || matched.includes(card.id) 
                  ? 'block' 
                  : 'hidden'
              } bg-white rounded-lg border-2 ${
                matched.includes(card.id) 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-purple-200'
              } flex items-center justify-center`}>
                <span className="text-4xl">{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {gameOver && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center mt-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-purple-800 mb-2">
            🎉 Félicitations! 🎉
          </h2>
          <p className="text-gray-700 mb-4">
            Vous avez trouvé toutes les paires en {moves} coups et {formatTime(endTime - startTime)}!
          </p>
          <button
            onClick={initGame}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Rejouer
          </button>
        </div>
      )}
      
      {highScore && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center mt-6">
          <h3 className="font-medium text-amber-800 mb-1">Meilleur score</h3>
          <p className="text-amber-700">
            {highScore.moves} coups en {formatTime(highScore.time * 1000)} ({highScore.date})
          </p>
        </div>
      )}
    </div>
  );
};

// Composant FastTap
const FastTapGame = ({ highScore, setHighScore }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeTarget, setActiveTarget] = useState(null);
  const [targetAppearTime, setTargetAppearTime] = useState(null);
  const [lastScore, setLastScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [missedTargets, setMissedTargets] = useState(0);
  const [difficulty, setDifficulty] = useState("normal");
  
  // Référence au timer
  const timerRef = useRef(null);
  const targetRef = useRef(null);
  
  // Heures possibles
  const hours = [9, 10, 11, 12, 14, 15, 16, 17, 18];
  
  // Positions pour les cibles
  const positions = [
    { top: "10%", left: "20%" },
    { top: "15%", left: "70%" },
    { top: "30%", left: "40%" },
    { top: "40%", left: "80%" },
    { top: "50%", left: "10%" },
    { top: "60%", left: "60%" },
    { top: "70%", left: "30%" },
    { top: "75%", left: "85%" },
    { top: "85%", left: "50%" }
  ];
  
  // Commencer le jeu
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(30);
    setMissedTargets(0);
    setCombo(0);
    createTarget();
    
    // Démarrer le timer principal
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };
  
  // Terminer le jeu
  const endGame = () => {
    clearInterval(timerRef.current);
    if (targetRef.current) {
      clearTimeout(targetRef.current);
    }
    
    setGameOver(true);
    setGameStarted(false);
    setActiveTarget(null);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('planifygo-fasttap-highscore', score.toString());
    }
  };
  
  // Créer une nouvelle cible
  const createTarget = () => {
    // Choisir aléatoirement un type de réservation
    const bookingType = bookingTypes[Math.floor(Math.random() * bookingTypes.length)];
    
    // Choisir aléatoirement une heure
    const hour = hours[Math.floor(Math.random() * hours.length)];
    
    // Choisir aléatoirement une position
    const position = positions[Math.floor(Math.random() * positions.length)];
    
    // Définir une durée aléatoire pour la réservation
    const durationMinutes = [15, 30, 45, 60][Math.floor(Math.random() * 4)];
    
    // Définir la cible active
    setActiveTarget({
      id: Date.now(),
      bookingType,
      hour,
      position,
      durationMinutes,
      expired: false,
      size: Math.random() < 0.3 ? 'small' : 'normal' // 30% de chance d'avoir une petite cible
    });
    
    // Enregistrer le moment où la cible apparaît
    setTargetAppearTime(Date.now());
    
    // Définir un délai après lequel la cible disparaît
    const targetDuration = difficulty === "easy" ? 2500 : difficulty === "normal" ? 2000 : 1500;
    
    targetRef.current = setTimeout(() => {
      setMissedTargets(prev => prev + 1);
      setCombo(0);
      createTarget();
    }, targetDuration);
  };
  
  // Gérer le clic sur une cible
  const handleTargetClick = () => {
    // Calculer le score en fonction du temps de réaction
    const reactionTime = Date.now() - targetAppearTime;
    
    // Base du score plus élevée pour les réactions rapides
    let pointsGained = Math.max(5, Math.floor(1500 / (reactionTime / 10)));
    
    // Bonus pour les petites cibles
    if (activeTarget.size === 'small') {
      pointsGained = Math.floor(pointsGained * 1.5);
    }
    
    // Bonus de combo
    const newCombo = combo + 1;
    setCombo(newCombo);
    
    if (newCombo > 2) {
      pointsGained = Math.floor(pointsGained * (1 + (newCombo * 0.1)));
    }
    
    setLastScore(pointsGained);
    setScore(prevScore => prevScore + pointsGained);
    
    // Effacer le timeout pour la cible actuelle
    if (targetRef.current) {
      clearTimeout(targetRef.current);
    }
    
    // Créer une nouvelle cible
    createTarget();
  };
  
  // Nettoyage lors du démontage du composant
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (targetRef.current) {
        clearTimeout(targetRef.current);
      }
    };
  }, []);
  
  return (
    <div className="p-6">
      {!gameStarted && !gameOver && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">FastTap Réservations</h2>
          <p className="text-gray-600 mb-6">
            Cliquez sur les réservations qui apparaissent à l'écran le plus rapidement possible.
            Plus vous êtes rapide, plus vous gagnez de points!
          </p>
          
          <div className="mb-6 bg-indigo-50 p-4 rounded-lg text-left">
            <h3 className="font-medium text-indigo-700 mb-2">Comment jouer:</h3>
            <ul className="text-gray-600 space-y-1 list-disc pl-5">
              <li>Des réservations apparaîtront aléatoirement à l'écran</li>
              <li>Cliquez dessus le plus vite possible</li>
              <li>Enchaînez les clics rapides pour obtenir des combos</li>
              <li>Attention aux petites réservations qui rapportent plus de points!</li>
              <li>Vous avez 30 secondes pour marquer un maximum de points</li>
            </ul>
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Choisissez la difficulté:</p>
            <div className="flex justify-center gap-2">
              <button 
                onClick={() => setDifficulty("easy")}
                className={`px-4 py-2 rounded-lg ${difficulty === "easy" 
                  ? "bg-green-600 text-white" 
                  : "bg-green-100 text-green-700"}`}
              >
                Facile
              </button>
              <button 
                onClick={() => setDifficulty("normal")}
                className={`px-4 py-2 rounded-lg ${difficulty === "normal" 
                  ? "bg-indigo-600 text-white" 
                  : "bg-indigo-100 text-indigo-700"}`}
              >
                Normal
              </button>
              <button 
                onClick={() => setDifficulty("hard")}
                className={`px-4 py-2 rounded-lg ${difficulty === "hard" 
                  ? "bg-red-600 text-white" 
                  : "bg-red-100 text-red-700"}`}
              >
                Difficile
              </button>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-lg shadow-md transform transition-transform hover:scale-105"
          >
            Commencer
          </button>
          {highScore > 0 && (
            <p className="mt-4 text-indigo-600 font-medium">Meilleur score: {highScore}</p>
          )}
        </div>
      )}
      
      {gameStarted && !gameOver && (
        <div className="relative bg-indigo-50 rounded-xl p-4 h-[60vh] overflow-hidden">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="bg-indigo-100 text-indigo-800 font-bold rounded-full py-2 px-4">
              Score: {score}
            </div>
            <div className="bg-amber-100 text-amber-800 font-bold rounded-full py-2 px-4">
              Temps: {timeLeft}s
            </div>
            {combo > 2 && (
              <div className="bg-green-100 text-green-800 font-bold rounded-full py-2 px-4 animate-pulse">
                Combo x{combo}
              </div>
            )}
          </div>
          
          {activeTarget && (
            <div 
              className={`absolute flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform ${activeTarget.bookingType.color} border-2 rounded-lg p-3 shadow-md animate-fadeIn`}
              style={{ 
                top: activeTarget.position.top, 
                left: activeTarget.position.left,
                transform: `scale(${activeTarget.size === 'small' ? 0.7 : 1})`,
              }}
              onClick={handleTargetClick}
            >
              <div className="text-3xl mb-1">{activeTarget.bookingType.icon}</div>
              <div className="font-medium text-gray-800">{activeTarget.bookingType.label}</div>
              <div className="text-sm text-gray-600">{activeTarget.hour}:00 - {activeTarget.hour + Math.floor(activeTarget.durationMinutes/60)}:{activeTarget.durationMinutes % 60 || '00'}</div>
              {lastScore > 0 && (
                <div className="absolute -top-8 right-0 text-green-600 font-bold animate-flyUp">
                  +{lastScore}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {gameOver && (
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">Temps écoulé!</h2>
          <p className="text-lg text-gray-600 mb-4">Votre score final: <span className="font-bold text-indigo-600">{score}</span></p>
          
          {score >= highScore && score > 0 && (
            <div className="bg-yellow-100 p-4 rounded-lg mb-6">
              <p className="text-yellow-800 font-bold">🏆 Nouveau record! 🏆</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-sm">Combo maximum</p>
              <p className="text-xl font-bold text-indigo-700">{combo}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-sm">Réservations manquées</p>
              <p className="text-xl font-bold text-indigo-700">{missedTargets}</p>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium"
          >
            Rejouer
          </button>
        </div>
      )}
    </div>
  );
};

// Composant Snake
const SnakeGame = ({ highScore, setHighScore }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState([
    { x: 10, y: 10 }
  ]);
  const [food, setFood] = useState({ x: 5, y: 5, emoji: foodEmojis[0] });
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(150); // ms
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const canvasRef = useRef(null);
  const gameLoopRef = useRef(null);
  
  const gridSize = 20; // Taille de la grille
  const cellSize = 20; // Taille d'une cellule en pixels
  
  // Initialiser le jeu
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setSnake([{ x: 10, y: 10 }]);
    randomizeFood();
    setDirection('RIGHT');
    setScore(0);
    setIsPaused(false);
    setSpeed(150);
  };
  
  // Placer la nourriture aléatoirement
  const randomizeFood = () => {
    const x = Math.floor(Math.random() * (gridSize - 1));
    const y = Math.floor(Math.random() * (gridSize - 1));
    const emoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
    setFood({ x, y, emoji });
  };
  
  // Dessiner le jeu
  const drawGame = () => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, gridSize * cellSize, gridSize * cellSize);
    
    // Dessiner le serpent
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#3B82F6' : '#93C5FD';
      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
      
      // Bordure des segments
      ctx.strokeStyle = '#2563EB';
      ctx.strokeRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
      
      // Yeux pour la tête du serpent
      if (index === 0) {
        ctx.fillStyle = 'white';
        
        // Position des yeux selon la direction
        let eyeX1, eyeY1, eyeX2, eyeY2;
        switch(direction) {
          case 'UP':
            eyeX1 = segment.x * cellSize + cellSize * 0.25;
            eyeY1 = segment.y * cellSize + cellSize * 0.25;
            eyeX2 = segment.x * cellSize + cellSize * 0.75;
            eyeY2 = segment.y * cellSize + cellSize * 0.25;
            break;
          case 'DOWN':
            eyeX1 = segment.x * cellSize + cellSize * 0.25;
            eyeY1 = segment.y * cellSize + cellSize * 0.75;
            eyeX2 = segment.x * cellSize + cellSize * 0.75;
            eyeY2 = segment.y * cellSize + cellSize * 0.75;
            break;
          case 'LEFT':
            eyeX1 = segment.x * cellSize + cellSize * 0.25;
            eyeY1 = segment.y * cellSize + cellSize * 0.25;
            eyeX2 = segment.x * cellSize + cellSize * 0.25;
            eyeY2 = segment.y * cellSize + cellSize * 0.75;
            break;
          case 'RIGHT':
            eyeX1 = segment.x * cellSize + cellSize * 0.75;
            eyeY1 = segment.y * cellSize + cellSize * 0.25;
            eyeX2 = segment.x * cellSize + cellSize * 0.75;
            eyeY2 = segment.y * cellSize + cellSize * 0.75;
            break;
          default:
            break;
        }
        
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, cellSize/8, 0, 2 * Math.PI);
        ctx.arc(eyeX2, eyeY2, cellSize/8, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    
    // Dessiner la nourriture
    ctx.font = `${cellSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      food.emoji,
      food.x * cellSize + cellSize/2,
      food.y * cellSize + cellSize/2
    );
  };
  
  // Mettre à jour le jeu
  const updateGame = () => {
    if (isPaused || gameOver) return;
    
    // Copier le serpent actuel
    const newSnake = [...snake];
    
    // Calculer la nouvelle position de la tête
    let newHead = { ...newSnake[0] };
    
    switch(direction) {
      case 'UP':
        newHead.y -= 1;
        break;
      case 'DOWN':
        newHead.y += 1;
        break;
      case 'LEFT':
        newHead.x -= 1;
        break;
      case 'RIGHT':
        newHead.x += 1;
        break;
      default:
        break;
    }
    
    // Vérifier les collisions avec les murs
    if (
      newHead.x < 0 ||
      newHead.y < 0 ||
      newHead.x >= gridSize ||
      newHead.y >= gridSize
    ) {
      handleGameOver();
      return;
    }
    
    // Vérifier les collisions avec le corps
    for (let i = 0; i < newSnake.length; i++) {
      if (newSnake[i].x === newHead.x && newSnake[i].y === newHead.y) {
        handleGameOver();
        return;
      }
    }
    
    // Ajouter la nouvelle tête
    newSnake.unshift(newHead);
    
    // Vérifier si le serpent a mangé
    if (newHead.x === food.x && newHead.y === food.y) {
      // Augmenter le score
      const newScore = score + 10;
      setScore(newScore);
      
      // Accélérer légèrement le jeu
      if (newScore % 50 === 0) {
        setSpeed(prevSpeed => Math.max(prevSpeed - 10, 70));
      }
      
      // Générer une nouvelle nourriture
      randomizeFood();
    } else {
      // Retirer la queue si le serpent n'a pas mangé
      newSnake.pop();
    }
    
    setSnake(newSnake);
  };
  
  // Gérer la fin du jeu
  const handleGameOver = () => {
    setGameOver(true);
    setGameStarted(false);
    
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('planifygo-snake-highscore', score.toString());
    }
  };
  
  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted || gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        case ' ':
          setIsPaused(!isPaused);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction, gameStarted, gameOver, isPaused]);
  
  // Boucle de jeu
  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;
    
    const gameLoop = () => {
      updateGame();
      drawGame();
    };
    
    gameLoopRef.current = setInterval(gameLoop, speed);
    
    return () => {
      clearInterval(gameLoopRef.current);
    };
  }, [snake, food, direction, gameStarted, gameOver, isPaused, speed]);
  
  // Dessiner le jeu initial
  useEffect(() => {
    drawGame();
  }, [snake, food, gameStarted]);
  
  return (
    <div className="p-6 text-center">
      {!gameStarted && !gameOver ? (
        <div>
          <h2 className="text-2xl font-bold text-green-700 mb-4">Snake Game</h2>
          <p className="text-gray-600 mb-6">
            Dirigez le serpent pour manger le plus de nourriture possible sans vous cogner aux murs ou à vous-même!
          </p>
          
          <div className="mb-6 bg-green-50 p-4 rounded-lg text-left">
            <h3 className="font-medium text-green-700 mb-2">Contrôles:</h3>
            <ul className="text-gray-600 space-y-1 list-disc pl-5">
              <li>Flèches directionnelles pour diriger le serpent</li>
              <li>Barre d'espace pour mettre en pause</li>
              <li>Plus vous mangez, plus vous grandissez</li>
              <li>Le jeu s'accélère à mesure que votre score augmente</li>
              <li>La partie se termine si vous touchez un mur ou votre queue</li>
            </ul>
          </div>
          
          <button
            onClick={startGame}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-lg shadow-md transform transition-transform hover:scale-105"
          >
            Commencer
          </button>
          {highScore > 0 && (
            <p className="mt-4 text-green-600 font-medium">Meilleur score: {highScore}</p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-green-700 font-bold text-xl">Score: {score}</div>
            {isPaused && (
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-lg">
                PAUSE
              </div>
            )}
            {!gameOver && (
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                {isPaused ? 'Reprendre' : 'Pause'}
              </button>
            )}
          </div>
          
          <div className="border-2 border-green-200 rounded-lg overflow-hidden mx-auto" style={{ width: gridSize * cellSize, height: gridSize * cellSize }}>
            <canvas
              ref={canvasRef}
              width={gridSize * cellSize}
              height={gridSize * cellSize}
              className="bg-green-50"
            />
          </div>
          
          {gameOver && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Game Over!
              </h2>
              <p className="text-gray-700 mb-4">
                Votre score final: <span className="font-bold">{score}</span>
              </p>
              
              {score >= highScore && score > 0 && (
                <div className="bg-yellow-100 p-3 rounded-lg mb-4">
                  <p className="text-yellow-800 font-bold">🏆 Nouveau record! 🏆</p>
                </div>
              )}
              
              <button
                onClick={startGame}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Rejouer
              </button>
            </div>
          )}
          
          <div className="flex justify-center mt-4">
            <div className="grid grid-cols-3 gap-1">
              <div></div>
              <button 
                onClick={() => setDirection('UP')}
                className="bg-green-100 hover:bg-green-200 text-green-800 w-10 h-10 rounded flex items-center justify-center"
                disabled={direction === 'DOWN' || !gameStarted || gameOver}
              >
                ↑
              </button>
              <div></div>
              <button 
                onClick={() => setDirection('LEFT')}
                className="bg-green-100 hover:bg-green-200 text-green-800 w-10 h-10 rounded flex items-center justify-center"
                disabled={direction === 'RIGHT' || !gameStarted || gameOver}
              >
                ←
              </button>
              <div className="bg-green-50 w-10 h-10 rounded"></div>
              <button 
                onClick={() => setDirection('RIGHT')}
                className="bg-green-100 hover:bg-green-200 text-green-800 w-10 h-10 rounded flex items-center justify-center"
                disabled={direction === 'LEFT' || !gameStarted || gameOver}
              >
                →
              </button>
              <div></div>
              <button 
                onClick={() => setDirection('DOWN')}
                className="bg-green-100 hover:bg-green-200 text-green-800 w-10 h-10 rounded flex items-center justify-center"
                disabled={direction === 'UP' || !gameStarted || gameOver}
              >
                ↓
              </button>
              <div></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant Puzzle
const PuzzleGame = ({ highScore, setHighScore }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [grid, setGrid] = useState([]);
  const [emptyCell, setEmptyCell] = useState({ row: 3, col: 3 });
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  
  const gridSize = 4; // Puzzle 4x4
  const puzzleImages = [
    'salon de coiffure',
    'spa',
    'manucure',
    'massage'
  ];
  
  // Initialiser le jeu
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setMoves(0);
    setStartTime(Date.now());
    setEndTime(null);
    
    // Créer et mélanger la grille
    const newGrid = createShuffledGrid();
    setGrid(newGrid);
    
    // Trouver la position de la case vide (15 est notre case vide)
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (newGrid[row][col] === gridSize * gridSize - 1) {
          setEmptyCell({ row, col });
          break;
        }
      }
    }
  };
  
  // Créer une grille mélangée de façon solvable
  const createShuffledGrid = () => {
    // Créer un tableau de 0 à 15 (0-15 pour un puzzle 4x4)
    const numbers = Array.from(Array(gridSize * gridSize).keys());
    
    // Mélanger les nombres de façon à ce que le puzzle soit solvable
    let inversions;
    do {
      shuffleArray(numbers);
      inversions = countInversions(numbers);
      
      // Pour un puzzle 4x4, le puzzle est solvable si:
      // 1. La case vide est sur une ligne paire en partant du bas ET le nombre d'inversions est impair, OU
      // 2. La case vide est sur une ligne impaire en partant du bas ET le nombre d'inversions est pair
      const emptyPos = numbers.indexOf(gridSize * gridSize - 1);
      const emptyRow = Math.floor(emptyPos / gridSize);
      const rowFromBottom = gridSize - 1 - emptyRow;
      
      // Si cette condition est vraie, le puzzle est solvable
    } while (!((rowFromBottom % 2 === 0 && inversions % 2 === 1) || 
               (rowFromBottom % 2 === 1 && inversions % 2 === 0)));
    
    // Convertir le tableau 1D en tableau 2D
    const grid = [];
    for (let i = 0; i < gridSize; i++) {
      grid.push(numbers.slice(i * gridSize, (i + 1) * gridSize));
    }
    
    return grid;
  };
  
  // Mélanger un tableau
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };
  
  // Compter les inversions dans un puzzle (utilisé pour déterminer si le puzzle est solvable)
  const countInversions = (numbers) => {
    let inversions = 0;
    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === gridSize * gridSize - 1) continue; // Ignorer la case vide
      
      for (let j = i + 1; j < numbers.length; j++) {
        if (numbers[j] === gridSize * gridSize - 1) continue; // Ignorer la case vide
        
        if (numbers[i] > numbers[j]) {
          inversions++;
        }
      }
    }
    return inversions;
  };
  
  // Vérifier si le puzzle est résolu
  const isPuzzleSolved = () => {
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const value = row * gridSize + col;
        if (grid[row][col] !== value) {
          return false;
        }
      }
    }
    return true;
  };
  
  // Gérer le clic sur une tuile
  const handleTileClick = (row, col) => {
    // Vérifier si la tuile est adjacente à la case vide
    if (
      (Math.abs(row - emptyCell.row) === 1 && col === emptyCell.col) ||
      (Math.abs(col - emptyCell.col) === 1 && row === emptyCell.row)
    ) {
      // Échanger la tuile avec la case vide
      const newGrid = [...grid.map(r => [...r])];
      newGrid[emptyCell.row][emptyCell.col] = newGrid[row][col];
      newGrid[row][col] = gridSize * gridSize - 1; // La case vide est représentée par gridSize * gridSize - 1
      
      setGrid(newGrid);
      setEmptyCell({ row, col });
      setMoves(moves + 1);
      
      // Vérifier si le puzzle est résolu
      setTimeout(() => {
        if (isPuzzleSolved()) {
          const endTimeValue = Date.now();
          setEndTime(endTimeValue);
          setGameOver(true);
          
          // Calculer le score
          const timeInSeconds = Math.floor((endTimeValue - startTime) / 1000);
          const score = Math.max(1000 - moves * 5 - timeInSeconds, 0);
          
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('planifygo-puzzle-highscore', score.toString());
          }
        }
      }, 100);
    }
  };
  
  // Formater le temps
  const formatTime = (timeInMs) => {
    if (!timeInMs) return '00:00';
    const seconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Changer l'image du puzzle
  const changeImage = () => {
    setImageIndex((imageIndex + 1) % puzzleImages.length);
  };
  
  // Obtenir la couleur de fond pour une tuile
  const getTileBackground = (value) => {
    if (value === gridSize * gridSize - 1) return 'bg-white'; // Case vide
    
    // Selon l'image sélectionnée, utiliser un gradient de couleur différent
    switch (imageIndex) {
      case 0: // Salon de coiffure
        return `bg-gradient-to-br from-blue-${100 + (value * 25) % 400} to-indigo-${100 + (value * 25) % 400}`;
      case 1: // Spa
        return `bg-gradient-to-br from-purple-${100 + (value * 25) % 400} to-pink-${100 + (value * 25) % 400}`;
      case 2: // Manucure
        return `bg-gradient-to-br from-pink-${100 + (value * 25) % 400} to-red-${100 + (value * 25) % 400}`;
      case 3: // Massage
        return `bg-gradient-to-br from-green-${100 + (value * 25) % 400} to-teal-${100 + (value * 25) % 400}`;
      default:
        return 'bg-blue-200';
    }
  };
  
  // Obtenir un emoji pour une tuile (pour représenter visuellement le thème)
  const getTileEmoji = (value) => {
    if (value === gridSize * gridSize - 1) return '';
    
    switch (imageIndex) {
      case 0: return value % 3 === 0 ? '💇' : '';
      case 1: return value % 3 === 0 ? '💆' : '';
      case 2: return value % 3 === 0 ? '💅' : '';
      case 3: return value % 3 === 0 ? '👐' : '';
      default: return '';
    }
  };
  
  return (
    <div className="p-6 text-center">
      {!gameStarted ? (
        <div>
          <h2 className="text-2xl font-bold text-amber-700 mb-4">Puzzle Glissant</h2>
          <p className="text-gray-600 mb-6">
            Déplacez les tuiles pour reconstituer l'image en utilisant le moins de mouvements possible!
          </p>
          
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Choisissez un thème:</p>
            <div className="flex justify-center gap-4 mb-4">
              {puzzleImages.map((theme, index) => (
                <button 
                  key={index}
                  onClick={() => setImageIndex(index)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    index === imageIndex 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg text-left mb-6">
              <h3 className="font-medium text-amber-700 mb-2">Comment jouer:</h3>
              <ul className="text-gray-600 space-y-1 list-disc pl-5">
                <li>Cliquez sur une tuile adjacente à l'espace vide pour la déplacer</li>
                <li>Reconstituez l'image numérotée de 0 à 14 (la case 15 est vide)</li>
                <li>Essayez de terminer en utilisant le moins de mouvements possible</li>
                <li>Le score est basé sur la rapidité et le nombre de mouvements</li>
              </ul>
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-lg shadow-md transform transition-transform hover:scale-105"
          >
            Commencer
          </button>
          {highScore > 0 && (
            <p className="mt-4 text-amber-600 font-medium">Meilleur score: {highScore}</p>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-amber-700 font-medium">Thème: </span>
              <span className="font-bold text-gray-800 capitalize">{puzzleImages[imageIndex]}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-amber-700 font-medium">Mouvements: </span>
              <span className="font-bold text-gray-800">{moves}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-amber-700 font-medium">Temps: </span>
              <span className="font-bold text-gray-800">
                {endTime 
                  ? formatTime(endTime - startTime) 
                  : formatTime(startTime ? Date.now() - startTime : 0)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
            {grid.map((row, rowIndex) => (
              row.map((value, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square flex items-center justify-center text-lg font-bold rounded-lg ${
                    value === gridSize * gridSize - 1 
                    ? 'bg-white border border-dashed border-amber-200' 
                    : `${getTileBackground(value)} text-white cursor-pointer hover:shadow-lg transition-transform hover:scale-105`
                  }`}
                  onClick={() => handleTileClick(rowIndex, colIndex)}
                >
                  <div className="flex flex-col items-center">
                    <span>{value !== gridSize * gridSize - 1 ? value : ''}</span>
                    <span className="text-2xl">{getTileEmoji(value)}</span>
                  </div>
                </div>
              ))
            ))}
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={startGame}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              Recommencer
            </button>
            <button
              onClick={changeImage}
              className="px-4 py-2 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
            >
              Changer d'image
            </button>
          </div>
          
          {gameOver && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mt-6 animate-fade-in">
              <h2 className="text-2xl font-bold text-amber-800 mb-2">
                🎉 Félicitations! 🎉
              </h2>
              <p className="text-gray-700 mb-2">
                Puzzle résolu en {moves} mouvements et {formatTime(endTime - startTime)}!
              </p>
              <p className="text-gray-600 mb-4">
                Score: <span className="font-bold text-amber-700">{Math.max(1000 - moves * 5 - Math.floor((endTime - startTime) / 1000), 0)}</span> points
              </p>
              
              {Math.max(1000 - moves * 5 - Math.floor((endTime - startTime) / 1000), 0) > highScore && (
                <div className="bg-yellow-100 p-3 rounded-lg mb-4">
                  <p className="text-yellow-800 font-bold">🏆 Nouveau record! 🏆</p>
                </div>
              )}
              
              <button
                onClick={startGame}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Nouveau puzzle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameCenter;