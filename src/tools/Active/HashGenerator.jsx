import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import CryptoJS from 'crypto-js';

const HashGenerator = () => {
  const [input, setInput] = useState('Hello World');
  const [hashes, setHashes] = useState({});
  const [copied, setCopied] = useState({});

  const generateHashes = () => {
    const newHashes = {
      MD5: CryptoJS.MD5(input).toString(),
      SHA1: CryptoJS.SHA1(input).toString(),
      SHA256: CryptoJS.SHA256(input).toString(),
      SHA512: CryptoJS.SHA512(input).toString(),
      SHA3: CryptoJS.SHA3(input).toString(),
      RIPEMD160: CryptoJS.RIPEMD160(input).toString(),
    };
    setHashes(newHashes);
  };

  const copyToClipboard = async (hash, algorithm) => {
    await navigator.clipboard.writeText(hash);
    setCopied({ ...copied, [algorithm]: true });
    setTimeout(() => {
      setCopied({ ...copied, [algorithm]: false });
    }, 2000);
  };

  const hashAlgorithms = [
    { name: 'MD5', description: '128-bit hash (fast, insecure)' },
    { name: 'SHA1', description: '160-bit hash (deprecated)' },
    { name: 'SHA256', description: '256-bit hash (secure)' },
    { name: 'SHA512', description: '512-bit hash (more secure)' },
    { name: 'SHA3', description: 'Keccak algorithm' },
    { name: 'RIPEMD160', description: '160-bit hash' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-zinc-400 mb-2">Input Text</label>
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 h-32 bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            placeholder="Enter text to hash..."
            spellCheck="false"
          />
          <button
            onClick={generateHashes}
            className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hashAlgorithms.map((algo) => (
          <div key={algo.name} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{algo.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{algo.description}</p>
              </div>
              {hashes[algo.name] && (
                <button
                  onClick={() => copyToClipboard(hashes[algo.name], algo.name)}
                  className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
                  title="Copy hash"
                >
                  {copied[algo.name] ? (
                    <Check size={16} className="text-emerald-500" />
                  ) : (
                    <Copy size={16} className="text-zinc-400" />
                  )}
                </button>
              )}
            </div>
            {hashes[algo.name] ? (
              <div className="font-mono text-sm text-emerald-500 break-all">
                {hashes[algo.name]}
              </div>
            ) : (
              <div className="text-sm text-zinc-500 italic">Generate hash to see result</div>
            )}
            {hashes[algo.name] && (
              <div className="mt-2 text-xs text-zinc-500">
                Length: {hashes[algo.name].length} chars
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Hash Information</h3>
        <div className="text-sm text-zinc-400 space-y-2">
          <p>• <strong>MD5</strong>: Fast but cryptographically broken. Use for non-security purposes.</p>
          <p>• <strong>SHA1</strong>: Considered insecure since 2005. Not recommended for security.</p>
          <p>• <strong>SHA256</strong>: Currently secure and widely used (Bitcoin, TLS, etc.).</p>
          <p>• <strong>SHA512</strong>: More secure than SHA256 but slower.</p>
          <p>• <strong>SHA3</strong>: Latest SHA standard, different design from SHA-2.</p>
          <p>• <strong>RIPEMD160</strong>: Used in Bitcoin addresses (along with SHA256).</p>
        </div>
      </div>
    </div>
  );
};

export default HashGenerator;