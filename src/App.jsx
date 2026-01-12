import React, { useState, useEffect } from "react";
import FlashcardsPage from "./pages/FlashcardsPage.jsx";
import Flashcards from "./tools/active/Flashcards.jsx";
import {
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";
import { BookOpen, Zap, Home } from "lucide-react";

import ToolsPage from "./pages/ToolsPage.jsx";
import JSONFormatter from "./tools/active/JSONFormatter.jsx";
import Base64Encoder from "./tools/active/Base64Encoder.jsx";
import FieldTerminal from "./tools/active/FieldTerminal.jsx";

/* ------------------ NAV ITEM ------------------ */
const NavItem = ({ icon: Icon, label, onClick, active, badge }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center gap-3 px-4 py-2 rounded-md transition
      ${active
        ? "bg-zinc-800/60 text-white"
        : "text-zinc-500 hover:text-zinc-300"}
    `}
  >
    <Icon
      size={18}
      className={active ? "text-emerald-400" : "text-zinc-500"}
    />

    <span className="flex-1 text-left text-sm">
      {label}
    </span>

    {badge !== undefined && (
      <span className="text-[11px] text-zinc-500">
        {badge}
      </span>
    )}
  </button>
);
/* ------------------ HOME ------------------ */
const HomePage = ({ decks, navigate }) => {
  const flashcardState =
    decks.length === 0 ? "Idle" : `${decks.length} Decks`;

  return (
    <div className="p-12">
      <div className="max-w-5xl">
        <h1 className="text-5xl font-bold mb-3">
          Welcome to your <span className="text-emerald-500">toolkit</span>
        </h1>

        <p className="text-zinc-500 max-w-xl leading-relaxed">
          Local environment active. Tools are available. Nothing here is uploaded.
        </p>

        {/* System status */}
        <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-wide">
          <span className="px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-700 text-zinc-500">
            Local Mode
          </span>
          <span className="px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-700 text-zinc-500">
            No Cloud
          </span>
          <span className="px-3 py-1 rounded-full bg-zinc-900/60 border border-zinc-700 text-zinc-500">
            Telemetry Off
          </span>
        </div>

        {/* Primary actions */}
        <div className="mt-12 flex gap-6">
          <button
            onClick={() => navigate("/flashcards")}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-56 text-left hover:border-emerald-500/40 transition"
          >
            <BookOpen size={26} className="text-emerald-500 mb-4" />
            <div className="text-sm text-zinc-400">Study</div>
            <div className="text-2xl font-semibold mt-1">
              {flashcardState}
            </div>
            <div className="text-xs text-zinc-400 mt-2">
              {decks.length === 0
                ? "No decks initialized"
                : "Ready for review"}
            </div>
          </button>

          <button
            onClick={() => navigate("/tools")}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-56 text-left hover:border-emerald-500/40 transition"
          >
            <Zap size={26} className="text-emerald-500 mb-4" />
            <div className="text-sm text-zinc-400">Utilities</div>
            <div className="text-2xl font-semibold mt-1">Dev Kit</div>
            <div className="text-xs text-zinc-500 mt-2">
              Format · Encode · Inspect
            </div>
          </button>
        </div>

        {/* Quiet creed */}
        <p className="mt-14 text-sm text-zinc-600 max-w-md leading-relaxed">
          Tools don’t need an audience.
        </p>
      </div>
    </div>
  );
};

/* ------------------ APP ------------------ */
const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [decks, setDecks] = useState([]);
  const [showTerminal, setShowTerminal] = useState(() => {

    if (typeof window === "undefined") return false;
  return !localStorage.getItem("fieldTerminalSeen");
});

useEffect(() => {
  try {
    localStorage.setItem("devToolkitDecks", JSON.stringify(decks));
  } catch {}
}, [decks]);

  useEffect(() => {
    localStorage.setItem("devToolkitDecks", JSON.stringify(decks));
  }, [decks]);

  // First visit terminal

  const finishTerminal = () => {
    localStorage.setItem("fieldTerminalSeen", "1");
    setShowTerminal(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex relative">
      {showTerminal && <FieldTerminal onFinish={finishTerminal} />}

      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 p-4 border-r border-zinc-800 relative">
        {/* System header */}
        <div className="px-4 pb-4 mb-4 border-b border-zinc-800">
          <div className="text-xs uppercase tracking-widest text-zinc-400">
            Local Toolkit
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">
            Environment Ready
          </div>
        </div>

        <NavItem
          icon={Home}
          label="Overview"
          active={location.pathname === "/"}
          onClick={() => navigate("/")}
        />

        <NavItem
          icon={BookOpen}
          label="Study"
          badge={decks.length}
          active={location.pathname.startsWith("/flashcards")}
          onClick={() => navigate("/flashcards")}
        />

        <NavItem
          icon={Zap}
          label="Utilities"
          active={location.pathname.startsWith("/tools")}
          onClick={() => navigate("/tools")}
        />

        {/* Sidebar footer */}
        <div className="absolute bottom-4 left-4 text-[11px] text-zinc-600">
          Local only · v0.x
        </div>
      </div>

      {/* Main */}
      <div className="flex-1">
<Routes>
  <Route
    path="/"
    element={<HomePage decks={decks} navigate={navigate} />}
  />
  <Route
    path="/flashcards"
    element={<FlashcardsPage decks={decks} setDecks={setDecks} />}
  />
  <Route path="/tools" element={<ToolsPage />} />
  <Route path="/tools/json" element={<JSONFormatter />} />
  <Route path="/tools/base64" element={<Base64Encoder />} />
</Routes>

      </div>
    </div>
  );
};

export default App;
