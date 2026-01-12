import React, { useState, useEffect } from "react";

const Flashcards = ({ cards = [] }) => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  // Safety when cards change
  useEffect(() => {
    if (index >= cards.length) {
      setIndex(0);
      setFlipped(false);
    }
  }, [cards.length, index]);

  if (cards.length === 0) {
    return (
      <div className="text-zinc-500 text-center py-12">
        No cards
      </div>
    );
  }

  const card = cards[index];

  return (
    <div>
      <div
        onClick={() => setFlipped(v => !v)}
        className="h-64 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-3xl font-semibold cursor-pointer mb-4 select-none"
      >
        {flipped ? card.back : card.front}
      </div>

      <div className="flex justify-center gap-4 text-sm text-zinc-400">
        <button onClick={() => { setIndex(i => (i - 1 + cards.length) % cards.length); setFlipped(false); }}>
          Prev
        </button>
        <span>
          {index + 1} / {cards.length}
        </span>
        <button onClick={() => { setIndex(i => (i + 1) % cards.length); setFlipped(false); }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Flashcards;
