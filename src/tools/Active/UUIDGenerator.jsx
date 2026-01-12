import { useState } from 'react';
import { Copy, Check, RefreshCw, Hash } from 'lucide-react';

const UUIDGenerator = () => {
  const [uuids, setUuids] = useState([]);
  const [version, setVersion] = useState('v4');
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const generateUUID = () => {
    const newUuids = [];
    for (let i = 0; i < count; i++) {
      switch (version) {
        case 'v1':
          newUuids.push(generateV1UUID());
          break;
        case 'v4':
        default:
          newUuids.push(generateV4UUID());
          break;
      }
    }
    setUuids(newUuids);
  };

  const generateV4UUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateV1UUID = () => {
    // Simplified v1 UUID (not time-based for this demo)
    const time = Date.now();
    const timeHex = (time & 0xFFFFFFFFFFFF).toString(16).padStart(12, '0');
    return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${timeHex.slice(12, 15)}-${generateV4UUID().slice(19)}`;
  };

  const copyAllToClipboard = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySingleToClipboard = async (uuid) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validateUUID = (uuid) => {
    const pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return pattern.test(uuid);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">UUID Version</label>
            <div className="flex gap-2">
              <button
                onClick={() => setVersion('v4')}
                className={`flex-1 py-3 rounded-lg transition-colors ${
                  version === 'v4' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                Version 4 (Random)
              </button>
              <button
                onClick={() => setVersion('v1')}
                className={`flex-1 py-3 rounded-lg transition-colors ${
                  version === 'v1' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                Version 1 (Time-based)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Number of UUIDs</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-semibold w-8 text-center">{count}</span>
            </div>
          </div>

          <button
            onClick={generateUUID}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={20} />
            Generate UUIDs
          </button>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Hash size={20} />
            UUID Information
          </h3>
          <div className="text-sm text-zinc-400 space-y-2">
            <p><strong>Version 4 (Random)</strong>: Most common. Uses random numbers. Good for general purposes.</p>
            <p><strong>Version 1 (Time-based)</strong>: Based on timestamp and MAC address. Provides chronological ordering.</p>
            <p className="mt-4"><strong>Format</strong>: 8-4-4-4-12 hex characters (32 total + 4 hyphens)</p>
            <p><strong>Total possibilities</strong>: 2¹²⁸ ≈ 3.4 × 10³⁸ (virtually no collisions)</p>
          </div>
        </div>
      </div>

      {uuids.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Generated UUIDs</h3>
            <button
              onClick={copyAllToClipboard}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-2"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied All!' : 'Copy All'}
            </button>
          </div>
          <div className="space-y-3">
            {uuids.map((uuid, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg text-emerald-500">{uuid}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      validateUUID(uuid) 
                        ? 'bg-emerald-500/20 text-emerald-500' 
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {validateUUID(uuid) ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Version: {uuid[14]} • Variant: {uuid[19]}
                  </div>
                </div>
                <button
                  onClick={() => copySingleToClipboard(uuid)}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded transition-colors"
                  title="Copy UUID"
                >
                  <Copy size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">When to Use</h3>
          <ul className="text-sm text-zinc-400 space-y-1">
            <li>• Database primary keys</li>
            <li>• Distributed systems</li>
            <li>• Session identifiers</li>
            <li>• File names</li>
            <li>• API request IDs</li>
          </ul>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">UUID Structure</h3>
          <div className="text-sm text-zinc-400 space-y-1">
            <div className="font-mono text-xs">
              <span className="text-emerald-500">xxxxxxxx</span>-<span className="text-blue-500">xxxx</span>-<span className="text-purple-500">Mxxx</span>-<span className="text-yellow-500">Nxxx</span>-<span className="text-pink-500">xxxxxxxxxxxx</span>
            </div>
            <div className="mt-2">
              <div><span className="text-emerald-500">Time-low</span>: 8 hex digits</div>
              <div><span className="text-blue-500">Time-mid</span>: 4 hex digits</div>
              <div><span className="text-purple-500">M = version</span>: 4 hex digits</div>
              <div><span className="text-yellow-500">N = variant</span>: 1-3 hex digits</div>
              <div><span className="text-pink-500">Node</span>: 12 hex digits</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UUIDGenerator;