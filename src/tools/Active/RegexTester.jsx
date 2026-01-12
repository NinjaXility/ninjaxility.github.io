import { useState } from 'react';
import { Copy, Check, Play, AlertCircle } from 'lucide-react';

const RegexTester = () => {
  const [pattern, setPattern] = useState('\\d+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('I have 123 apples and 456 oranges');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [replaceWith, setReplaceWith] = useState('');
  const [replaced, setReplaced] = useState('');

  const testRegex = () => {
    try {
      setError('');
      const regex = new RegExp(pattern, flags);
      const allMatches = [];
      let match;
      
      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null) {
          allMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
            fullMatch: match
          });
        }
      } else {
        const singleMatch = regex.exec(testString);
        if (singleMatch) {
          allMatches.push({
            match: singleMatch[0],
            index: singleMatch.index,
            groups: singleMatch.slice(1),
            fullMatch: singleMatch
          });
        }
      }
      
      setMatches(allMatches);
      
      // Test replacement
      if (replaceWith) {
        const result = testString.replace(regex, replaceWith);
        setReplaced(result);
      } else {
        setReplaced('');
      }
    } catch (err) {
      setError(err.message);
      setMatches([]);
      setReplaced('');
    }
  };

  const commonPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'URL', pattern: 'https?://[^\\s]+' },
    { name: 'Phone', pattern: '\\+?\\d{1,4}[-.\\s]?\\(?\\d{1,3}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}' },
    { name: 'Digits', pattern: '\\d+' },
    { name: 'Words', pattern: '\\b\\w+\\b' },
    { name: 'HTML Tags', pattern: '<[^>]+>' },
  ];

  const flagOptions = [
    { value: 'g', label: 'Global (g)' },
    { value: 'i', label: 'Case-insensitive (i)' },
    { value: 'm', label: 'Multiline (m)' },
    { value: 's', label: 'Dotall (s)' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Regular Expression Pattern</label>
            <div className="flex gap-2">
              <input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                placeholder="Enter regex pattern"
              />
              <button
                onClick={testRegex}
                className="px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Play size={18} />
                Test
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Flags</label>
            <div className="flex flex-wrap gap-2">
              {flagOptions.map((flag) => (
                <label key={flag.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={flags.includes(flag.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFlags(flags + flag.value);
                      } else {
                        setFlags(flags.replace(flag.value, ''));
                      }
                    }}
                    className="rounded border-zinc-700 bg-zinc-800"
                  />
                  <span className="text-sm">{flag.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Test String</label>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              className="w-full h-48 bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Enter text to test against..."
              spellCheck="false"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Replace With</label>
            <input
              value={replaceWith}
              onChange={(e) => setReplaceWith(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="Optional: text to replace matches with"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Matches ({matches.length} found)</label>
            <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-auto">
              {matches.length > 0 ? (
                <div className="space-y-2">
                  {matches.map((match, index) => (
                    <div key={index} className="p-3 bg-zinc-800 rounded-lg">
                      <div className="flex justify-between items-start">
                        <span className="font-mono text-emerald-500">{match.match}</span>
                        <span className="text-sm text-zinc-500">Index: {match.index}</span>
                      </div>
                      {match.groups.length > 0 && (
                        <div className="mt-2">
                          <span className="text-sm text-zinc-400">Groups:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {match.groups.map((group, i) => (
                              <span key={i} className="px-2 py-1 bg-zinc-700 rounded text-sm">
                                Group {i + 1}: {group}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-zinc-500 h-full flex items-center justify-center">
                  {error ? `Error: ${error}` : 'No matches found'}
                </div>
              )}
            </div>
          </div>

          {replaced && (
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Replaced Result</label>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm">
                {replaced}
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Common Patterns</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {commonPatterns.map((pattern) => (
            <button
              key={pattern.name}
              onClick={() => {
                setPattern(pattern.pattern);
                testRegex();
              }}
              className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors text-left"
            >
              <div className="font-medium">{pattern.name}</div>
              <div className="text-xs text-zinc-400 font-mono truncate mt-1">{pattern.pattern}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Quick Reference</h3>
          <div className="text-sm text-zinc-400 space-y-1">
            <div><code className="text-emerald-500">\d</code> - Digit (0-9)</div>
            <div><code className="text-emerald-500">\w</code> - Word character</div>
            <div><code className="text-emerald-500">\s</code> - Whitespace</div>
            <div><code className="text-emerald-500">^</code> - Start of string</div>
            <div><code className="text-emerald-500">$</code> - End of string</div>
            <div><code className="text-emerald-500">[abc]</code> - Character set</div>
            <div><code className="text-emerald-500">(abc)</code> - Capturing group</div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Quantifiers</h3>
          <div className="text-sm text-zinc-400 space-y-1">
            <div><code className="text-emerald-500">*</code> - 0 or more</div>
            <div><code className="text-emerald-500">+</code> - 1 or more</div>
            <div><code className="text-emerald-500">?</code> - 0 or 1</div>
            <div><code className="text-emerald-500">{'{3}'}</code> - Exactly 3</div>
            <div><code className="text-emerald-500">{'{3,5}'}</code> - 3 to 5</div>
            <div><code className="text-emerald-500">{'{3,}'}</code> - 3 or more</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;