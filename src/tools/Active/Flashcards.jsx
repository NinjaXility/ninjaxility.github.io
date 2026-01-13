import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  Repeat
} from "lucide-react";

const Flashcards = ({ cards = [], title = "Study" }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [inverted, setInverted] = useState(false);

  // Safety: clamp index if cards change
  useEffect(() => {
    if (index >= cards.length) {
      setIndex(0);
      setFlipped(false);
    }
  }, [cards.length, index]);

  if (cards.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-500">
        No cards to study
      </div>
    );
  }

  const card = cards[index];

  const next = () => {
    setIndex((i) => (i + 1) % cards.length);
    setFlipped(false);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + cards.length) % cards.length);
    setFlipped(false);
  };

  const shuffle = () => {
    setIndex(Math.floor(Math.random() * cards.length));
    setFlipped(false);
  };

  const reset = () => {
    setIndex(0);
    setFlipped(false);
    setInverted(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-zinc-500">
          Click the card to flip
        </p>
      </div>

      {/* Card */}
      <div
        onClick={() => setFlipped(v => !v)}
        className="
          h-80 mb-6 cursor-pointer select-none
          bg-zinc-900 border border-zinc-800 rounded-xl
          flex items-center justify-center
          text-4xl font-bold text-center
          transition-colors
          hover:border-zinc-700
        "
      >
        {!flipped
          ? inverted
            ? card.back
            : card.front
          : inverted
          ? card.front
          : card.back}
      </div>

      {/* Progress */}
      <div className="text-center text-sm text-zinc-500 mb-6">
        Card {index + 1} of {cards.length}
        <div className="w-full bg-zinc-800 rounded-full h-1 mt-2">
          <div
            className="bg-emerald-500 h-1 rounded-full transition-all"
            style={{
              width: `${((index + 1) / cards.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-3 flex-wrap">
        <button
          onClick={prev}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded flex gap-2 items-center"
        >
          <ChevronLeft size={18} />
          Prev
        </button>

        <button
          onClick={shuffle}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded flex gap-2 items-center"
        >
          <Shuffle size={18} />
          Shuffle
        </button>

        <button
          onClick={() => {
            setInverted(v => !v);
            setFlipped(false);
          }}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded flex gap-2 items-center"
        >
          <Repeat size={18} />
          Invert
        </button>

        <button
          onClick={reset}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded flex gap-2 items-center"
        >
          <RotateCcw size={18} />
          Reset
        </button>

        <button
          onClick={next}
          className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded flex gap-2 items-center"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
