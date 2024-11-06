import { useState } from "react";

function NewGame({ onclick }) {
  const [name, setName] = useState('');

  const inputHandler = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="new-game">
      <h2>Start the game choose the difficulty level and enter your name</h2>
      <input type="text" placeholder="Your Name" onChange={inputHandler} />
      <div className="difficulty-buttons">
        <button onClick={() => onclick('easy', name)}>Easy</button>
        <button onClick={() => onclick('medium', name)}>Medium</button>
        <button onClick={() => onclick('hard', name)}>Hard</button>
      </div>
    </div>
  );
}

export default NewGame;
