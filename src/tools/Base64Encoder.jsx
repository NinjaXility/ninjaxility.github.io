import { useState } from "react";

const Base64Encoder = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => setOutput(btoa(input));
  const decode = () => {
    try {
      setOutput(atob(input));
    } catch {
      setOutput("Invalid Base64");
    }
  };

  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
      <h3 className="text-xl font-semibold mb-2">Base64 Encoder</h3>
      <textarea
        rows={3}
        value={input}
        onChange={e => setInput(e.target.value)}
        className="w-full bg-zinc-800 rounded p-2 mb-2 text-sm"
        placeholder="Enter text or Base64"
      />
      <div className="flex gap-2 mb-2">
        <button onClick={encode} className="bg-emerald-500 px-4 py-2 rounded">Encode</button>
        <button onClick={decode} className="bg-emerald-500 px-4 py-2 rounded">Decode</button>
      </div>
      <pre className="bg-zinc-800 p-2 rounded text-sm">{output}</pre>
    </div>
  );
};

export default Base64Encoder;
