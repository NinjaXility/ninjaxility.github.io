import ToolsPage from './pages/ToolsPage.jsx';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { BookOpen, Code2, Zap, Plus, ChevronLeft, ChevronRight, Shuffle, RotateCcw, Check, X, Trash2, Edit2, Home } from 'lucide-react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [decks, setDecks] = useState([]);
  const [activedeck, setActivedeck] = useState(null);
  const [showAddDeck, setShowAddDeck] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);

  // Load decks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('devToolkitDecks');
    if (saved) {
      setDecks(JSON.parse(saved));
    } else {
      // Default deck
      const defaultDeck = {
        id: '1',
        name: '-Test Deck',
        frontLabel: 'Side A',
        backLabel: 'Side B',
        cards: [
          { id: '1', front: 'Hello', back: 'Thank you', score: 0 },
        ],
        stats: { correct: 0, total: 0 },
        history: []
      };
      setDecks([defaultDeck]);
      localStorage.setItem('devToolkitDecks', JSON.stringify([defaultDeck]));
    }
  }, []);

  // Save decks to localStorage
  useEffect(() => {
    if (decks.length > 0) {
      localStorage.setItem('devToolkitDecks', JSON.stringify(decks));
    }
  }, [decks]);

  const addDeck = (name, frontLabel, backLabel) => {
    const newDeck = {
      id: Date.now().toString(),
      name,
      frontLabel,
      backLabel,
      cards: [],
      stats: { correct: 0, total: 0 },
      history: []
    };
    setDecks([...decks, newDeck]);
    setShowAddDeck(false);
  };

  const deleteDeck = (deckId) => {
    setDecks(decks.filter(d => d.id !== deckId));
  };

  const addCard = (deckId, front, back) => {
    setDecks(decks.map(deck => {
      if (deck.id === deckId) {
        return {
          ...deck,
          cards: [...deck.cards, {
            id: Date.now().toString(),
            front,
            back,
            score: 0
          }]
        };
      }
      return deck;
    }));
    setShowAddCard(false);
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} decks={decks} />;
      case 'flashcards':
        return <FlashcardsPage 
          decks={decks} 
          setDecks={setDecks}
          activedeck={activedeck}
          setActivedeck={setActivedeck}
          showAddDeck={showAddDeck}
          setShowAddDeck={setShowAddDeck}
          showAddCard={showAddCard}
          setShowAddCard={setShowAddCard}
          addDeck={addDeck}
          addCard={addCard}
          deleteDeck={deleteDeck}
        />;
      case 'tools':
        return <ToolsPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} decks={decks} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-2xl font-bold">
            Dev<span className="text-emerald-500">Kit</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">Tools & Learning</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem 
            icon={Home} 
            label="Home" 
            active={currentPage === 'home'}
            onClick={() => setCurrentPage('home')}
          />
          <NavItem 
            icon={BookOpen} 
            label="Flashcards" 
            active={currentPage === 'flashcards'}
            onClick={() => setCurrentPage('flashcards')}
            badge={decks.length}
          />
          <NavItem 
            icon={Zap} 
            label="Dev Tools" 
            active={currentPage === 'tools'}
            onClick={() => setCurrentPage('tools')}
          />
        </nav>

        <div className="p-4 border-t border-zinc-800 text-xs text-zinc-600">
          © 2026 — Techy + Earthy
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {renderPage()}
      </div>
    </div>
  );
};

const NavItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
      active 
        ? 'bg-emerald-500/10 text-emerald-500' 
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
    }`}
  >
    <Icon size={20} />
    <span className="flex-1 text-left font-medium">{label}</span>
    {badge && (
      <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full">{badge}</span>
    )}
  </button>
);

const HomePage = ({ setCurrentPage, decks }) => {
  return (
    <div className="p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-16">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to your <span className="text-emerald-500">toolkit</span>
          </h1>
          <p className="text-zinc-400 text-lg">
            Everything you need to learn, build, and grow.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HomeCard
            icon={BookOpen}
            title="Flashcards"
            description="Master anything with spaced repetition"
            stats={`${decks.length} decks`}
            onClick={() => setCurrentPage('flashcards')}
          />
          <HomeCard
            icon={Zap}
            title="Dev Tools"
            description="JSON, Base64, Regex, and more"
            stats="6 tools"
            onClick={() => setCurrentPage('tools')}
          />
        </div>

        <div className="mt-16 p-8 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-3 gap-6">
            <StatItem label="Total Cards" value={decks.reduce((acc, d) => acc + d.cards.length, 0)} />
            <StatItem label="Decks" value={decks.length} />
            <StatItem label="Study Streak" value="0 days" />
          </div>
        </div>
      </div>
    </div>
  );
};

const HomeCard = ({ icon: Icon, title, description, stats, onClick }) => (
  <button
    onClick={onClick}
    className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 transition-all group text-left"
  >
    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-all">
      <Icon className="text-emerald-500" size={24} />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-zinc-400 text-sm mb-4">{description}</p>
    <span className="text-xs text-zinc-500">{stats}</span>
  </button>
);

const StatItem = ({ label, value }) => (
  <div>
    <p className="text-zinc-500 text-sm mb-1">{label}</p>
    <p className="text-3xl font-bold text-emerald-500">{value}</p>
  </div>
);

const FlashcardsPage = ({ 
  decks, 
  setDecks,
  activeDeck,
  setActiveDeck,
  showAddDeck, 
  setShowAddDeck,
  showAddCard,
  setShowAddCard,
  addDeck,
  addCard,
  deleteDeck
}) => {
  const [selectedDeck, setSelectedDeck] = useState(null);

  if (selectedDeck) {
    return (
      <FlashcardStudy 
        deck={decks.find(d => d.id === selectedDeck)} 
        onBack={() => setSelectedDeck(null)}
        setDecks={setDecks}
        decks={decks}
      />
    );
  }

  return (
    <div className="p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Flashcard Decks</h1>
            <p className="text-zinc-400">Master anything through repetition</p>
          </div>
          <button
            onClick={() => setShowAddDeck(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all"
          >
            <Plus size={20} />
            New Deck
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => (
            <DeckCard 
              key={deck.id}
              deck={deck}
              onSelect={() => setSelectedDeck(deck.id)}
              onDelete={() => deleteDeck(deck.id)}
            />
          ))}
        </div>

        {showAddDeck && (
          <AddDeckModal 
            onClose={() => setShowAddDeck(false)}
            onAdd={addDeck}
          />
        )}
      </div>
    </div>
  );
};

const DeckCard = ({ deck, onSelect, onDelete }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-xl font-semibold">{deck.name}</h3>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-zinc-600 hover:text-red-500 transition-colors"
      >
        <Trash2 size={18} />
      </button>
    </div>
    <div className="text-sm text-zinc-500 mb-4">
      {deck.frontLabel} → {deck.backLabel}
    </div>
    <div className="flex justify-between items-center mb-6">
      <span className="text-2xl font-bold text-emerald-500">{deck.cards.length}</span>
      <span className="text-sm text-zinc-500">cards</span>
    </div>
    <button
      onClick={onSelect}
      className="w-full bg-zinc-800 hover:bg-emerald-500 text-zinc-300 hover:text-white py-3 rounded-lg font-medium transition-all"
    >
      Study Now
    </button>
  </div>
);

const AddDeckModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [frontLabel, setFrontLabel] = useState('');
  const [backLabel, setBackLabel] = useState('');

  const handleSubmit = () => {
    if (name && frontLabel && backLabel) {
      onAdd(name, frontLabel, backLabel);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">Create New Deck</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Deck Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g., Git Commands"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Front Label</label>
            <input
              type="text"
              value={frontLabel}
              onChange={(e) => setFrontLabel(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g., Command"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Back Label</label>
            <input
              type="text"
              value={backLabel}
              onChange={(e) => setBackLabel(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="e.g., Description"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg font-medium transition-all"
            >
              Create Deck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlashcardStudy = ({ deck, onBack, setDecks, decks }) => {
  const [cards, setCards] = useState(deck.cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [showAddCard, setShowAddCard] = useState(false);

  const currentCard = cards[currentIndex];

  const shuffleCards = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const nextCard = () => {
    setCurrentIndex((currentIndex + 1) % cards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentIndex((currentIndex - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  const markCorrect = () => {
    setSessionStats(prev => ({
      correct: prev.correct + 1,
      total: prev.total + 1
    }));
    nextCard();
  };

  const markIncorrect = () => {
    setSessionStats(prev => ({
      ...prev,
      total: prev.total + 1
    }));
    nextCard();
  };

  const addCardToDeck = (front, back) => {
    setDecks(decks.map(d => {
      if (d.id === deck.id) {
        const newCard = { id: Date.now().toString(), front, back, score: 0 };
        return {
          ...d,
          cards: [...d.cards, newCard]
        };
      }
      return d;
    }));
    setCards([...cards, { id: Date.now().toString(), front, back, score: 0 }]);
    setShowAddCard(false);
  };

  const performance = sessionStats.total === 0 ? 0 : Math.round((sessionStats.correct / sessionStats.total) * 10);

  if (cards.length === 0) {
    return (
      <div className="p-12">
        <div className="max-w-4xl mx-auto text-center">
          <button onClick={onBack} className="mb-8 text-zinc-400 hover:text-zinc-100 flex items-center gap-2">
            <ChevronLeft size={20} />
            Back to Decks
          </button>
          <h2 className="text-3xl font-bold mb-4">No cards yet</h2>
          <p className="text-zinc-400 mb-8">Add your first card to start studying</p>
          <button
            onClick={() => setShowAddCard(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg font-medium transition-all inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Add First Card
          </button>
          {showAddCard && (
            <AddCardModal
              deck={deck}
              onClose={() => setShowAddCard(false)}
              onAdd={addCardToDeck}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="text-zinc-400 hover:text-zinc-100 flex items-center gap-2">
            <ChevronLeft size={20} />
            Back to Decks
          </button>
          <button
            onClick={() => setShowAddCard(true)}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg font-medium transition-all"
          >
            <Plus size={18} />
            Add Card
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8">{deck.name}</h1>

        {/* Performance */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-zinc-400 text-sm mb-1">Session Performance</p>
              <p className="text-4xl font-bold text-emerald-500">{performance}/10</p>
              <p className="text-zinc-500 text-sm mt-1">{sessionStats.correct}/{sessionStats.total} correct</p>
            </div>
          </div>
        </div>

        {/* Flashcard */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative w-full h-96 cursor-pointer mb-8"
        >
          <div className={`absolute w-full h-full bg-zinc-900 border-2 ${isFlipped ? 'border-emerald-500' : 'border-zinc-800'} rounded-2xl flex flex-col items-center justify-center p-8 transition-all hover:border-emerald-500/50`}>
            <div className="text-sm text-zinc-500 mb-4">
              {isFlipped ? (isInverted ? deck.frontLabel : deck.backLabel) : (isInverted ? deck.backLabel : deck.frontLabel)}
            </div>
            <div className="text-5xl font-bold text-center">
              {isFlipped 
                ? (isInverted ? currentCard.front : currentCard.back)
                : (isInverted ? currentCard.back : currentCard.front)
              }
            </div>
            {!isFlipped && (
              <div className="mt-8 text-zinc-500 text-sm">
                Click to flip
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="text-center mb-6">
          <span className="text-lg font-semibold">
            Card {currentIndex + 1} of {cards.length}
          </span>
          <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
            <div
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={markIncorrect}
            className="bg-red-500/10 border border-red-500/50 hover:bg-red-500 hover:border-red-500 text-red-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all flex items-center gap-2"
          >
            <X size={20} />
            Wrong
          </button>
          <button
            onClick={markCorrect}
            className="bg-emerald-500/10 border border-emerald-500/50 hover:bg-emerald-500 hover:border-emerald-500 text-emerald-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all flex items-center gap-2"
          >
            <Check size={20} />
            Correct
          </button>
        </div>

        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={prevCard}
            className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <ChevronLeft size={20} />
            Previous
          </button>
          
          <button
            onClick={shuffleCards}
            className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <Shuffle size={20} />
            Shuffle
          </button>

          <button
            onClick={() => setIsInverted(!isInverted)}
            className="bg-emerald-500/10 border border-emerald-500/50 hover:bg-emerald-500/20 text-emerald-500 px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <RotateCcw size={20} />
            {isInverted ? `${deck.backLabel} → ${deck.frontLabel}` : `${deck.frontLabel} → ${deck.backLabel}`}
          </button>

          <button
            onClick={nextCard}
            className="bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            Next
            <ChevronRight size={20} />
          </button>
        </div>

        {showAddCard && (
          <AddCardModal
            deck={deck}
            onClose={() => setShowAddCard(false)}
            onAdd={addCardToDeck}
          />
        )}
      </div>
    </div>
  );
};

const AddCardModal = ({ deck, onClose, onAdd }) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');

  const handleSubmit = () => {
    if (front && back) {
      onAdd(front, back);
      setFront('');
      setBack('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">Add New Card</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">{deck.frontLabel}</label>
            <input
              type="text"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder={`Enter ${deck.frontLabel.toLowerCase()}`}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">{deck.backLabel}</label>
            <input
              type="text"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder={`Enter ${deck.backLabel.toLowerCase()}`}
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg font-medium transition-all"
            >
              Add Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



const ToolCard = ({ title, description, status }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all">
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-zinc-400 text-sm mb-4">{description}</p>
    <span className="text-xs text-zinc-600 bg-zinc-800 px-3 py-1 rounded-full">{status}</span>
  </div>
);

export default App;