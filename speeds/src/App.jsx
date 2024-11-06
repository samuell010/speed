import { useRef, useState } from 'react';
import NewGame from './components/NewGame';
import Game from './components/Game';
import GameOver from './components/GameOver';
import { levels } from './levels';

const getRndInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

function App() {
  const [player, setPlayer] = useState();
  const [circles, setCircles] = useState([]);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState();
  const [gameLaunch, setGameLaunch] = useState(true);
  const [gameOn, setGameOn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [chances, setChances] = useState(3); // Track remaining chances

  const timeoutIdRef = useRef(null);
  const roundsCount = useRef(0);
  const currentInst = useRef(0);

  let pace = 1000;
  let levelAmount;

  const gameSetHandler = (level, name) => {
    const { amount } = levels.find((el) => el.name === level);
    levelAmount = amount;

    const circlesArray = Array.from({ length: levelAmount }, (_, i) => i);

    setCircles(circlesArray);
    setPlayer({ level, name });
    setChances(3); // Reset chances when the game starts
    setGameLaunch((prevLaunch) => !prevLaunch);
    gameStart();
  };

  const randomNumb = () => {
    if (roundsCount.current >= 3) {
      stopHandler();
      return;
    }

    let nextActive;
    do {
      nextActive = getRndInt(0, levelAmount);
    } while (nextActive === currentInst.current);

    setCurrent(nextActive);
    currentInst.current = nextActive;
    roundsCount.current++;
    pace *= 0.95;
    timeoutIdRef.current = setTimeout(randomNumb, pace);
  };

  const gameStart = () => {
    setGameOn(!gameOn);
    randomNumb();
  };

  const clickHandler = (id) => {
    if (current !== id) {
      // Handle wrong click
      setChances((prev) => {
        const newChances = prev - 1;
        if (newChances <= 0) {
          stopHandler();
        }
        return newChances;
      });
      return;
    }
    setScore((prevScore) => prevScore + 10);
    roundsCount.current--;
  };

  const stopHandler = () => {
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = null;

    setGameOn(false);
    setGameOver(!gameOver);
    roundsCount.current = null;
    pace = 1000;
  };

  const closeHandler = () => {
    setGameOver(!gameOver);
    setGameLaunch(!gameLaunch);
    setScore(0);
    setChances(3); // Reset chances when game is closed
  };

  return (
    <div className="app-container">
      <h1>Catch your money</h1>
      {gameLaunch && <NewGame onclick={gameSetHandler} />}
      {gameOn && (
        <Game
          score={score}
          circles={circles}
          stopHandler={stopHandler}
          clickHandler={clickHandler}
          current={current}
        />
      )}
      {gameOver && (
        <GameOver closeHandler={closeHandler} {...player} score={score} />
      )}
    </div>
  );
}

export default App;
