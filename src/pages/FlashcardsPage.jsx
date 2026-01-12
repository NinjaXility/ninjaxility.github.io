import React, { useState } from "react";
import Flashcards from "../tools/active/Flashcards.jsx";

const FlashcardsPage = ({ decks, setDecks }) => {
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [deckName, setDeckName] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const selectedDeck = decks.find(d => d.id === selectedDeckId);

  const addDeck = () => {
    if (!deckName.trim()) return;
    setDecks([...decks, { id: Date.now().toString(), name: deckName, cards: [] }]);
    setDeckName("");
  };

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;
    setDecks(decks.map(d =>
      d.id === selectedDeckId
        ? { ...d, cards: [...d.cards, { id: Date.now().toString(), front, back }] }
        : d
    ));
    setFront("");
    setBack("");
  };

  if (!selectedDeck) {
    return (
      <div className="p-12 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Decks</h1>

        <div className="flex gap-2 mb-6">
          <input
            value={deckName}
            onChange={e => setDeckName(e.target.value)}
            placeholder="Deck name"
            className="bg-zinc-800 px-3 py-2 rounded"
          />
          <button onClick={addDeck} className="bg-emerald-500 text-black px-4 py-2 rounded">
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {decks.map(d => (
            <li
              key={d.id}
              onClick={() => setSelectedDeckId(d.id)}
              className="bg-zinc-900 p-4 rounded cursor-pointer"
            >
              {d.name} · {d.cards.length} cards
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="p-12 max-w-4xl mx-auto">
      <button onClick={() => setSelectedDeckId(null)} className="mb-4 text-zinc-400">
        ← Back
      </button>

      <h2 className="text-3xl font-bold mb-6">{selectedDeck.name}</h2>

      <Flashcards cards={selectedDeck.cards} />

      <div className="mt-8 flex gap-2">
        <input
          value={front}
          onChange={e => setFront(e.target.value)}
          placeholder="Front"
          className="bg-zinc-800 px-3 py-2 rounded flex-1"
        />
        <input
          value={back}
          onChange={e => setBack(e.target.value)}
          placeholder="Back"
          className="bg-zinc-800 px-3 py-2 rounded flex-1"
        />
        <button onClick={addCard} className="bg-emerald-500 text-black px-4 py-2 rounded">
          Add card
        </button>
      </div>
    </div>
  );
};

export default FlashcardsPage;
