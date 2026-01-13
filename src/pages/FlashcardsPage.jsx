import React, { useState } from "react";
import Flashcards from "../tools/Active/Flashcards.jsx";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";

const FlashcardsPage = ({ decks, setDecks }) => {
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [newDeckName, setNewDeckName] = useState("");
  const [showCards, setShowCards] = useState(true);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const selectedDeck = decks.find(d => d.id === selectedDeckId);

  /* ---------- DECK ACTIONS ---------- */

  const addDeck = () => {
    if (!newDeckName.trim()) return;
    setDecks([
      ...decks,
      { id: Date.now().toString(), name: newDeckName, cards: [] }
    ]);
    setNewDeckName("");
  };

  const deleteDeck = id => {
    setDecks(decks.filter(d => d.id !== id));
    setSelectedDeckId(null);
  };

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;

    setDecks(decks.map(d =>
      d.id === selectedDeckId
        ? {
            ...d,
            cards: [
              ...d.cards,
              { id: Date.now().toString(), front, back }
            ]
          }
        : d
    ));

    setFront("");
    setBack("");
  };

  const deleteCard = cardId => {
    setDecks(decks.map(d =>
      d.id === selectedDeckId
        ? {
            ...d,
            cards: d.cards.filter(c => c.id !== cardId)
          }
        : d
    ));
  };

  /* ---------- DECK LIST ---------- */

  if (!selectedDeck) {
    return (
      <div className="p-12 max-w-6xl mx-auto overflow-x-hidden">
        <h1 className="text-4xl font-bold mb-6">Decks</h1>

        <div className="flex gap-2 mb-8">
          <input
            value={newDeckName}
            onChange={e => setNewDeckName(e.target.value)}
            placeholder="Deck name"
            className="bg-zinc-900 border border-zinc-800 rounded px-3 py-2"
          />
          <button
            onClick={addDeck}
            className="bg-emerald-500 text-black px-4 py-2 rounded flex gap-2 items-center"
          >
            <Plus size={16} />
            Add
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {decks.map(deck => (
            <div
              key={deck.id}
              onClick={() => setSelectedDeckId(deck.id)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 cursor-pointer hover:border-zinc-700"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{deck.name}</h3>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteDeck(deck.id);
                  }}
                  className="text-zinc-500 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <p className="text-sm text-zinc-500">
                {deck.cards.length} card(s)
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------- DECK VIEW ---------- */

  return (
    <div className="p-12 max-w-6xl mx-auto overflow-x-hidden">
      <button
        onClick={() => setSelectedDeckId(null)}
        className="text-zinc-400 hover:text-white mb-6"
      >
        ← Back to decks
      </button>

      <h2 className="text-3xl font-bold mb-8">{selectedDeck.name}</h2>

      {/* STUDY */}
      <div className="mb-12">
        <Flashcards
          title="Study"
          cards={selectedDeck.cards}
        />
      </div>

      {/* ADD CARD */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
        <h3 className="font-semibold mb-4">Add card</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={front}
            onChange={e => setFront(e.target.value)}
            placeholder="Front"
            className="bg-zinc-800 rounded px-3 py-2"
          />
          <input
            value={back}
            onChange={e => setBack(e.target.value)}
            placeholder="Back"
            className="bg-zinc-800 rounded px-3 py-2"
          />
          <button
            onClick={addCard}
            className="bg-emerald-500 text-black rounded px-4 py-2"
          >
            Add card
          </button>
        </div>
      </div>

      {/* TOGGLE CARD LIST */}
      <button
        onClick={() => setShowCards(v => !v)}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4"
      >
        {showCards ? <EyeOff size={16} /> : <Eye size={16} />}
        {showCards ? "Hide cards" : "Show cards"}
      </button>

      {/* CARD LIST */}
      {showCards && (
        <div className="space-y-3">
          {selectedDeck.cards.map(card => (
            <div
              key={card.id}
              className="group bg-zinc-900 border border-zinc-800 rounded-lg p-4 relative"
            >
              <button
                onClick={() => deleteCard(card.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition text-zinc-500 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>

              <div className="font-semibold">{card.front}</div>
              <div className="text-zinc-400 text-sm mt-1">{card.back}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardsPage;
