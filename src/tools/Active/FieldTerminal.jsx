import { useEffect, useRef, useState } from "react";

const ACCESS_PHRASE = "#savenature";

/*
  Phrase visible in source.
  That is intentional.
*/

const LINES = [
  "Booting local environment…",
  "",
  "Network: disconnected",
  "Telemetry: disabled",
  "Cloud: ignored",
  "",
  "This system does not measure growth.",
  "It measures loss.",
  "",
  "Soil thins.",
  "Water warms.",
  "Silence spreads where noise once lived.",
  "",
  "Most damage is quiet.",
  "Most warnings are late.",
  "",
  "There may not be another season to notice.",
  "There may not be another day.",
  "",
  "If this remains, it will be because someone paid attention.",
  "",
  "You are here now."
];

export default function FieldTerminal({ onFinish }) {
  const bufferRef = useRef("");
  const typingRef = useRef(false);

  const [output, setOutput] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState("typing"); // typing | input
  const [input, setInput] = useState("");

  // menu state
  const [showHint, setShowHint] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [selection, setSelection] = useState(0);

  // -------- Typing engine --------
  useEffect(() => {
    if (phase !== "typing") return;
    if (typingRef.current) return;

    if (lineIndex >= LINES.length) {
      setPhase("input");
      return;
    }

    typingRef.current = true;
    const line = LINES[lineIndex];
    let charIndex = 0;

    if (line.length === 0) {
      setTimeout(() => {
        bufferRef.current += "\n";
        setOutput(bufferRef.current);
        typingRef.current = false;
        setLineIndex(i => i + 1);
      }, 260);
      return;
    }

    const typeChar = () => {
      if (charIndex < line.length) {
        bufferRef.current += line.charAt(charIndex);
        setOutput(bufferRef.current);
        charIndex++;
        setTimeout(typeChar, 30);
      } else {
        setTimeout(() => {
          bufferRef.current += "\n";
          setOutput(bufferRef.current);
          typingRef.current = false;
          setLineIndex(i => i + 1);
        }, 220);
      }
    };

    setTimeout(typeChar, 300);
  }, [lineIndex, phase]);

  // -------- Menu options (dynamic) --------
  const options = [
    "Enter Toolkit",
    "Skip",
    ...(hintUsed ? [] : ["Hint"])
  ];

  // -------- Keyboard navigation --------
  useEffect(() => {
    if (phase !== "input") return;

    const onKey = (e) => {
      if (e.key === "ArrowUp") {
        setSelection(s => (s - 1 + options.length) % options.length);
      }

      if (e.key === "ArrowDown") {
        setSelection(s => (s + 1) % options.length);
      }

      if (e.key === "Enter") {
        handleSelect(options[selection]);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, selection, options]);

  const handleSelect = (option) => {
    if (option === "Hint") {
      setShowHint(true);
      setHintUsed(true);
      setSelection(0);
      return;
    }

    // Empty input === skip (intentional)
    if (input && input !== ACCESS_PHRASE) return;

    bufferRef.current += "\nAcknowledged.\nProceed carefully.\n";
    setOutput(bufferRef.current);

    setTimeout(onFinish, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="w-full max-w-3xl px-6">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">

          {/* Title bar */}
          <div className="h-8 bg-zinc-900 flex items-center px-3 gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>

          {/* Screen */}
          <div className="p-6 text-zinc-200 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {output}

            {phase === "input" && (
              <>
                {showHint && (
                  <div className="mt-6 text-xs text-amber-300/80 text-center">
                    Check the source code of
                    <br />
                    <span className="text-amber-200">
                      src/tools/Active/FieldTerminal.jsx
                    </span>
                  </div>
                )}

                <div className="mt-6">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Optional access phrase"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded px-4 py-2 text-zinc-200 focus:outline-none focus:border-emerald-500/60"
                  />
                </div>

                <div className="mt-6 space-y-1">
                  {options.map((opt, i) => (
                    <div
                      key={opt}
                      className={i === selection ? "text-emerald-400" : "text-zinc-500"}
                    >
                      {i === selection ? "➤" : " "} {opt}
                    </div>
                  ))}
                </div>

                {input && input !== ACCESS_PHRASE && (
                  <div className="mt-3 text-xs text-zinc-500">
                    No response. Try again or select Skip.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="text-xs text-zinc-500 mt-3 text-center">
          Use ↑ ↓ to choose · Enter to confirm
        </div>
      </div>
    </div>
  );
}
