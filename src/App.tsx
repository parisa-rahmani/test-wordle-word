import { useEffect, useState } from "react";
import "./styles.css";

const WORD_LENGTH = 5;
const API_URL = `https://random-word-api.herokuapp.com/word?number=100&length=${WORD_LENGTH}`;

export default function App() {
  const [guesses, setGuesses] = useState<(string | null)[]>(
    Array(6).fill(null)
  );
  const [targetWord, setTargetWord] = useState("");
  const [currentGuess, setCurrentGuess] = useState("");
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    const handleType = (event: KeyboardEvent) => {
      //handle edge cases
      if (isOver) {
        return;
      }

      if (event.key === "Enter") {
        if (currentGuess.length !== WORD_LENGTH) {
          return;
        }
      }

      const isCorrect = targetWord === currentGuess;
      if (isCorrect) {
        setIsOver(true);
      }

      if (event.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (currentGuess.length >= WORD_LENGTH) {
        return;
      }

      if (event.key.match(/^[a-z]$/)) {
        setCurrentGuess((prev) => prev + event.key);
      }
    };

    window.addEventListener("keydown", handleType);
    return () => window.removeEventListener("keydown", handleType);
  }, [currentGuess]);

  useEffect(() => {
    const getWords = async () => {
      const response = await fetch(API_URL);
      const words = await response.json();
      const randomWord = words[Math.floor(Math.random() * words.length)];

      setTargetWord(randomWord);
    };

    getWords();
  }, []);

  return (
    <div className="App">
      {targetWord}
      <div className="wrapper">
        {guesses.map((guess, i) => {
          const isCurrentGuess = i === guesses.findIndex((val) => val == null);
          return (
            <GuessRow key={i} guess={isCurrentGuess ? currentGuess : guess} />
          );
        })}
      </div>
      {currentGuess}
    </div>
  );
}

type GuessRowProps = {
  guess: string | null;
};

const GuessRow = ({ guess }: GuessRowProps) => {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess?.[i];
    tiles.push(
      <div key={i} className="tile">
        {char}
      </div>
    );
  }

  return <div className="row">{tiles}</div>;
};
