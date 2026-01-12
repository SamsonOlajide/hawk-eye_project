"use client";

import { useEffect, useRef, useState } from "react";

import { HigherLowerImplementation } from "../../../src/game";
import type { Guess } from "../../../src/game";
import type { Card } from "../../../src/card";

type CardOrientation = "left" | "right";

/**
 * CardFace function - renders a single face of a card with a colored background and label.
 *
 * The background color is determined by the `side`:
 * - `"left"`: blue background
 * - `"right"`: red background
 */
function CardFace({label, card, side}: {label: string; card: Card | null; side: CardOrientation;
}) {
  const bgClass =
    side === "left" ? "bg-[#2020b0]" : "bg-[#a51414]";

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center rounded-3xl p-6 shadow-sm select-none ${bgClass}`}
    >
      <div className="text-sm opacity-70 text-white">{label}</div>
      <div className="mt-4 text-5xl font-semibold text-white">
        {card ? card.toString() : "—"}
      </div>
    </div>
  );
}

/**
 * Root page component for the Higher / Lower (Hawk-Eye Coding Task) game.
 *
 * This component:
 * - Initialises and stores a single `HigherLowerImplementation` game session.
 * - Keeps track of the current and challenging cards, score, remaining cards,
 *   user feedback message, game-over state, and input lock state using React
 *   state hooks.
 * - Starts a new game on first render and whenever the "New game" button is clicked.
 * - Handles user guesses by comparing the selected card via `checkHigherOrLower`,
 *   updating the UI state, and briefly pausing on correct guesses to load the next chalenging card.
 * - Renders the main game layout, including:
 *   - Score and remaining-card counters.
 *   - A status/message banner.
 *   - Two clickable card faces (current vs challenger cards).
 *   - A game-over summary when the session ends.
 *
 * @returns The main JSX layout for the Higher / Lower game page.
 */
export default function Page() {
  const session = useRef<HigherLowerImplementation | null>(null);

  const [current, setCurrent] = useState<Card | null>(null);
  const [challenger, setChallenger] = useState<Card | null>(null);
  const [score, setScore] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [message, setMessage] = useState<string>("Choose the higher card");
  const [gameOver, setGameOver] = useState(false);
  const [locked, setLocked] = useState(false);

  const syncFromGame = () => {
    const game = session.current!;
    setCurrent(game.getCurrentCard());
    setChallenger(game.getChallengingCard());
    setScore(game.getScore());
    setRemaining(game.remainingCards());
    setGameOver(game.isGameOver());
  };

  const newGame = () => {
    const game = new HigherLowerImplementation();
    session.current = game;
    game.begin();
    syncFromGame();
    setMessage("Click the higher card");
    setGameOver(false);
    setLocked(false);
  };

  useEffect(() => {
    newGame();
  }, []);

  const handlePick = async (pick: "left" | "right") => {
    if (locked || gameOver) return;
    if (!session.current) return;

    setLocked(true);

    const guess: Guess = pick === "left" ? "l" : "h";

    const result = session.current.checkHigherOrLower(guess);

    if (result.correct) {
      setMessage("Correct");
      await new Promise((r) => setTimeout(r, 350));
      syncFromGame();
      setLocked(false);
      return;
    }

    setMessage(` Game over: ${result.reason ?? "Wrong guess"}`);
    syncFromGame();
    setLocked(false);
  };

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-2xl font-semibold">Higher / Lower (Hawk-Eye Coding Task)</div>
            <div className="text-sm opacity-70">
              Click left or right to choose the higher card
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-black px-4 py-2 shadow-sm">
              <div className="text-xs opacity-60">Score</div>
              <div className="text-lg font-semibold">{score}</div>
            </div>
            <div className="rounded-2xl bg-black px-4 py-2 shadow-sm">
              <div className="text-xs opacity-60">Remaining</div>
              <div className="text-lg font-semibold">{remaining}</div>
            </div>

            <button
              onClick={newGame}
              className="rounded-2xl bg-black px-4 py-4 shadow-sm hover:bg-blue-800 active:scale-[0.99]"
            >
              New game
            </button>
          </div>
        </div>

        <div
          className={`rounded-2xl  bg-black px-4 py-3 shadow-sm ${
            locked ? "opacity-70" : ""
          }`}
        >
          <div className="text-xl">{message}</div>
        </div>

        <div className="grid h-[70vh] grid-cols-1 gap-6 md:grid-cols-2">
          <button
            onClick={() => handlePick("left")}
            disabled={locked || gameOver}
            className="group h-full w-full rounded-3xl outline-none disabled:cursor-not-allowed"
          >
            <div className="h-full w-full transition-transform group-hover:scale-[1.01]">
              <CardFace label="Current" card={current} side="left" />
            </div>
          </button>

          <button
            onClick={() => handlePick("right")}
            disabled={locked || gameOver}
            className="group h-full w-full rounded-3xl outline-none disabled:cursor-not-allowed"
          >
            <div className="h-full w-full transition-transform group-hover:scale-[1.01] ">
              <CardFace label="Challenger" card={challenger} side="right"/>
            </div>
          </button>
        </div>

        {gameOver && (
          <div className="rounded-2xl bg-black p-4 shadow-sm">
            <div className="font-semibold">Game over</div>
            <div className="text-sm opacity-70">
              Final score: {score} You need to click “New game” to play again.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}