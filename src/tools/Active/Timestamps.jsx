import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * TimestampTool
 * - Edit ANY field → all other fields update.
 * - Internal source of truth: epoch milliseconds (UTC).
 * - No history, no ticking clock, no ceremony.
 */

const pad2 = (n) => String(n).padStart(2, "0");
const pad3 = (n) => String(n).padStart(3, "0");

function formatLocalHuman(ms) {
  const d = new Date(ms);
  return (
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ` +
    `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`
  );
}

function formatUTCHuman(ms) {
  const d = new Date(ms);
  return (
    `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())} ` +
    `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())} UTC`
  );
}

function formatISO(ms) {
  // ISO is always UTC
  return new Date(ms).toISOString();
}

function toUnixSeconds(ms) {
  return String(Math.floor(ms / 1000));
}

function toUnixMillis(ms) {
  return String(Math.floor(ms));
}

function parseNumberStrict(s) {
  const t = s.trim();
  if (!t) return null;
  if (!/^[+-]?\d+$/.test(t)) return null;
  // Avoid Number overflow nonsense: still ok for typical epoch ranges.
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

// Accept:
// - ISO 8601: 2026-01-14T12:34:56Z / with offset / without Z (treated as local by Date.parse)
// - Date.parse-compatible strings (browser-dependent)
// - We keep it minimal: if Date.parse can parse it, we accept.
function parseISOorNative(s) {
  const t = s.trim();
  if (!t) return null;
  const ms = Date.parse(t);
  if (!Number.isFinite(ms)) return null;
  return ms;
}

// Accept local human:
// - "YYYY-MM-DD HH:mm:ss"
// - "YYYY-MM-DD HH:mm"
// - "YYYY-MM-DD"
function parseLocalHuman(s) {
  const t = s.trim();
  if (!t) return null;

  // Allow replacing "T" with space
  const normalized = t.replace("T", " ");

  const m = normalized.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (!m) return null;

  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const hh = m[4] !== undefined ? Number(m[4]) : 0;
  const mm = m[5] !== undefined ? Number(m[5]) : 0;
  const ss = m[6] !== undefined ? Number(m[6]) : 0;

  // Basic sanity ranges
  if (
    mo < 1 || mo > 12 ||
    d < 1 || d > 31 ||
    hh < 0 || hh > 23 ||
    mm < 0 || mm > 59 ||
    ss < 0 || ss > 59
  ) return null;

  const date = new Date(y, mo - 1, d, hh, mm, ss, 0);
  const ms = date.getTime();
  if (!Number.isFinite(ms)) return null;

  // Guard against JS Date auto-roll (e.g. 2025-02-31 → Mar 3)
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== (mo - 1) ||
    date.getDate() !== d ||
    date.getHours() !== hh ||
    date.getMinutes() !== mm ||
    date.getSeconds() !== ss
  ) return null;

  return ms;
}

// Accept UTC human:
// - "YYYY-MM-DD HH:mm:ss" (optional trailing "UTC")
// - "YYYY-MM-DD HH:mm"
function parseUTCHuman(s) {
  let t = s.trim();
  if (!t) return null;
  t = t.replace(/\s*UTC\s*$/i, "").trim();
  t = t.replace("T", " ");

  const m = t.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?$/
  );
  if (!m) return null;

  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const hh = m[4] !== undefined ? Number(m[4]) : 0;
  const mm = m[5] !== undefined ? Number(m[5]) : 0;
  const ss = m[6] !== undefined ? Number(m[6]) : 0;

  if (
    mo < 1 || mo > 12 ||
    d < 1 || d > 31 ||
    hh < 0 || hh > 23 ||
    mm < 0 || mm > 59 ||
    ss < 0 || ss > 59
  ) return null;

  const ms = Date.UTC(y, mo - 1, d, hh, mm, ss, 0);
  if (!Number.isFinite(ms)) return null;

  // Guard against rollover by reconstructing and comparing UTC fields
  const check = new Date(ms);
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== (mo - 1) ||
    check.getUTCDate() !== d ||
    check.getUTCHours() !== hh ||
    check.getUTCMinutes() !== mm ||
    check.getUTCSeconds() !== ss
  ) return null;

  return ms;
}

function clampEpoch(ms) {
  // Keep it sane: JS Date supports about ±8.64e15 ms, but we can keep wide.
  if (!Number.isFinite(ms)) return null;
  const min = -8.64e15;
  const max = 8.64e15;
  if (ms < min || ms > max) return null;
  return ms;
}

const Field = ({ label, hint, value, onChange, onFocus, error, onCopy }) => (
  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="text-sm font-semibold text-white">{label}</div>
        {hint && <div className="text-xs text-zinc-500 mt-1">{hint}</div>}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCopy}
          className="text-xs px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
          title="Copy"
        >
          Copy
        </button>
      </div>
    </div>

    <input
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      className={`mt-3 w-full bg-zinc-950 border rounded px-3 py-2 text-zinc-200 focus:outline-none ${
        error ? "border-red-500/60" : "border-zinc-800 focus:border-emerald-500/60"
      }`}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
    />

    {error && (
      <div className="text-xs text-red-400 mt-2">
        {error}
      </div>
    )}
  </div>
);

export default function TimestampTool() {
  const [epochMs, setEpochMs] = useState(() => Date.now());

  // Controlled inputs (we let users type anything; we only sync from epochMs when not actively editing a different field)
  const [unixS, setUnixS] = useState(() => toUnixSeconds(Date.now()));
  const [unixMs, setUnixMs] = useState(() => toUnixMillis(Date.now()));
  const [iso, setIso] = useState(() => formatISO(Date.now()));
  const [utcHuman, setUtcHuman] = useState(() => formatUTCHuman(Date.now()));
  const [localHuman, setLocalHuman] = useState(() => formatLocalHuman(Date.now()));

  const [errors, setErrors] = useState({
    unixS: "",
    unixMs: "",
    iso: "",
    utcHuman: "",
    localHuman: "",
  });

  // Track which field the user last edited to avoid fighting their typing.
  const lastEditedRef = useRef(null);
  const debounceRef = useRef(null);

  const computed = useMemo(() => {
    return {
      unixS: toUnixSeconds(epochMs),
      unixMs: toUnixMillis(epochMs),
      iso: formatISO(epochMs),
      utcHuman: formatUTCHuman(epochMs),
      localHuman: formatLocalHuman(epochMs),
    };
  }, [epochMs]);

  // Sync displayed values when epoch changes, unless user is in the middle of editing that field.
  useEffect(() => {
    const last = lastEditedRef.current;
    if (last !== "unixS") setUnixS(computed.unixS);
    if (last !== "unixMs") setUnixMs(computed.unixMs);
    if (last !== "iso") setIso(computed.iso);
    if (last !== "utcHuman") setUtcHuman(computed.utcHuman);
    if (last !== "localHuman") setLocalHuman(computed.localHuman);

    // Clear errors once we have a valid epoch and outputs are consistent.
    setErrors((e) => ({ ...e, unixS: "", unixMs: "", iso: "", utcHuman: "", localHuman: "" }));
  }, [computed]);

  function scheduleParse(field, rawValue) {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      let ms = null;

      if (field === "unixS") {
        const n = parseNumberStrict(rawValue);
        ms = n === null ? null : n * 1000;
      } else if (field === "unixMs") {
        const n = parseNumberStrict(rawValue);
        ms = n === null ? null : n;
      } else if (field === "iso") {
        ms = parseISOorNative(rawValue);
      } else if (field === "utcHuman") {
        ms = parseUTCHuman(rawValue);
      } else if (field === "localHuman") {
        ms = parseLocalHuman(rawValue);
      }

      ms = ms !== null ? clampEpoch(ms) : null;

      if (ms === null) {
        setErrors((e) => ({
          ...e,
          [field]:
            "Unrecognized format.",
        }));
        return;
      }

      setErrors((e) => ({ ...e, [field]: "" }));
      setEpochMs(ms);
    }, 350);
  }

  function setEdited(field) {
    lastEditedRef.current = field;
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Silent. (No ceremony.)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Timestamp</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Edit any field. Everything else aligns.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => {
            lastEditedRef.current = null;
            setEpochMs(Date.now());
          }}
          className="bg-emerald-500 text-black px-4 py-2 rounded hover:opacity-90"
        >
          Now
        </button>

        <div className="text-xs text-zinc-500">
          Internal truth: epoch milliseconds (UTC)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Field
          label="Unix (seconds)"
          hint="Example: 1736851200"
          value={unixS}
          error={errors.unixS}
          onFocus={() => setEdited("unixS")}
          onChange={(e) => {
            setEdited("unixS");
            setUnixS(e.target.value);
            scheduleParse("unixS", e.target.value);
          }}
          onCopy={() => copy(unixS)}
        />

        <Field
          label="Unix (milliseconds)"
          hint="Example: 1736851200000"
          value={unixMs}
          error={errors.unixMs}
          onFocus={() => setEdited("unixMs")}
          onChange={(e) => {
            setEdited("unixMs");
            setUnixMs(e.target.value);
            scheduleParse("unixMs", e.target.value);
          }}
          onCopy={() => copy(unixMs)}
        />

        <Field
          label="ISO 8601 (UTC)"
          hint="Example: 2026-01-14T12:34:56.000Z"
          value={iso}
          error={errors.iso}
          onFocus={() => setEdited("iso")}
          onChange={(e) => {
            setEdited("iso");
            setIso(e.target.value);
            scheduleParse("iso", e.target.value);
          }}
          onCopy={() => copy(iso)}
        />

        <Field
          label="UTC (human)"
          hint='Example: 2026-01-14 12:34:56 UTC'
          value={utcHuman}
          error={errors.utcHuman}
          onFocus={() => setEdited("utcHuman")}
          onChange={(e) => {
            setEdited("utcHuman");
            setUtcHuman(e.target.value);
            scheduleParse("utcHuman", e.target.value);
          }}
          onCopy={() => copy(utcHuman)}
        />

        <div className="lg:col-span-2">
          <Field
            label="Local (human)"
            hint='Example: 2026-01-14 14:34:56'
            value={localHuman}
            error={errors.localHuman}
            onFocus={() => setEdited("localHuman")}
            onChange={(e) => {
              setEdited("localHuman");
              setLocalHuman(e.target.value);
              scheduleParse("localHuman", e.target.value);
            }}
            onCopy={() => copy(localHuman)}
          />
        </div>
      </div>

      <div className="mt-6 text-xs text-zinc-600">
        Accepts ISO strings, unix seconds/millis, and simple human formats.
      </div>
    </div>
  );
}