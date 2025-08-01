import { useState, useRef, useEffect} from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewDice())
  const buttonRef = useRef(null)

  //Whereas .dot method returns an array
  //.every method returns boolean

  const gameWon =
    dice.every((die) => die.isHeld) &&
    dice.every((die) => die.value === dice[0].value);

    useEffect(() => {
      if(gameWon){
        buttonRef.current.focus()
      }
    }, [gameWon])

  function generateAllNewDice() {
    const newDice = [];
    // for (let i=0;i<10;i++){
    //   const rand = Math.ceil(Math.random() * 6)
    //   newDice.push(rand)
    // }
    // return newDice
    return new Array(10).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  function rollDice() {
    if (!gameWon) {
      setDice((oldDice) =>
        oldDice.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
        )
      );
    } else {
      setDice(generateAllNewDice());
    }
  }

  function hold(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((dieObj) => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
    />
  ));

  return (
    <main>
      {gameWon && <Confetti />}
      <div aria-live="polite" className="sr-only">
        {gameWon && (
          <p>Congratulations! You won! Press "New Game" to start again.</p>
        )}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button ref={buttonRef} className="roll-dice" onClick={rollDice}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}












// // A:
// const [dice, setDice] = useState(generateAllNewDice())

// // B:
// const [dice, setDice] = useState(() => generateAllNewDice())

// What’s the difference?
// A calls generateAllNewDice() immediately during the initial render and uses its return value as the initial state.

// B passes a function to useState (a lazy initializer). React will call that function once, during the initial render, to compute the initial state.

// In your case, since generateAllNewDice takes no arguments and you're only initializing once, both end up calling it exactly once and producing the same result.

// When the lazy form matters:
// If the initial state computation is expensive, wrapping it like in B ensures that the computation runs only once and only when React is initializing the state—not any earlier or multiple times by accident. It's a small optimization and a pattern to guard against unnecessary work.

// Note: useState(generateAllNewDice) (without parentheses) is also valid and equivalent to B; React treats the function you pass as a lazy initializer in that case.

// So:

// useState(generateAllNewDice()) → calls it immediately, uses result.

// useState(() => generateAllNewDice()) or useState(generateAllNewDice) → passes the function for React to call once lazily.

// In your app they behave the same, but the lazy pattern (B) is considered safer if generating the initial state was heavier.
