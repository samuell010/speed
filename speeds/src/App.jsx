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

  // we use useRef to store the value between renders
  const timeoutIdRef = useRef(null);
  const roundsCount = useRef(0);
  const currentInst = useRef(0);

  let pace = 1000;
  let levelAmount;

  const gameSetHandler = (level, name) => {
    // findIndex() from array based on level name and then reading amount from object
    // const levelIndex = levels.findIndex((el) => el.name === level);
    // levelAmount = levels[levelIndex].amount;

    // find() matching name and destructuring the amount
    const { amount } = levels.find((el) => el.name === level);
    levelAmount = amount;

    const circlesArray = Array.from({ length: levelAmount }, (_, i) => i);

    setCircles(circlesArray);
    setPlayer({
      level: level,
      name: name,
    });

    // using the callback to ensure that we have the latest state
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

  function gameStart() {
    setGameOn(!gameOn);
    randomNumb();
  }

  const clickHandler = (id) => {
    if (current !== id) {
      stopHandler();
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
  };

  return (
    <>
      <h1>Catch the snow!</h1>
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
    </>
  );
}

export default App;
