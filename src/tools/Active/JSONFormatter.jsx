import { useState } from "react";

const JSONFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput("Invalid JSON");
    }
  };

  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
      <h3 className="text-xl font-semibold mb-2">JSON Formatter</h3>
      <textarea
        rows={5}
        value={input}
        onChange={e => setInput(e.target.value)}
        className="w-full bg-zinc-800 rounded p-2 mb-2 text-sm"
        placeholder="Paste JSON here"
      />
      <button
        onClick={formatJSON}
        className="bg-emerald-500 px-4 py-2 rounded mb-2"
      >
        Format
      </button>
      <pre className="bg-zinc-800 p-2 rounded text-sm">{output}</pre>
    </div>
  );
};

export default JSONFormatter;
