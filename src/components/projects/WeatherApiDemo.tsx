import React, { useState } from 'react';
import { Cloud, Search, Terminal, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface MockWeather {
  city: string;
  country: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
}

const MOCK_DATA: Record<string, MockWeather> = {
  coimbatore: { city: 'Coimbatore', country: 'IN', temp: 28, condition: 'Partly Cloudy', humidity: 68, windSpeed: 14, pressure: 1012 },
  chennai: { city: 'Chennai', country: 'IN', temp: 32, condition: 'Sunny', humidity: 75, windSpeed: 18, pressure: 1008 },
  bangalore: { city: 'Bangalore', country: 'IN', temp: 24, condition: 'Light Rain', humidity: 82, windSpeed: 12, pressure: 1014 },
  london: { city: 'London', country: 'UK', temp: 16, condition: 'Overcast', humidity: 88, windSpeed: 22, pressure: 1016 }
};

export const WeatherApiDemo: React.FC = () => {
  const [query, setQuery] = useState('Coimbatore');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MockWeather | null>(MOCK_DATA.coimbatore);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      const key = query.trim().toLowerCase();
      if (MOCK_DATA[key]) {
        setResult(MOCK_DATA[key]);
      } else {
        setResult(null);
        setError(`Demo validation: '${query}' is not in this local preview.`);
      }
    }, 400);
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-4 rounded-lg space-y-4">
      {/* Demo Header */}
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Cloud className="w-4 h-4 text-[var(--accent-color)]" />
          <span className="font-mono text-xs text-[var(--text-primary)] uppercase font-bold tracking-wider">
            Demo Preview
          </span>
        </div>
        <span className="font-mono text-[10px] text-[var(--accent-color)] px-2 py-0.5 bg-[var(--accent-glow)] border border-[var(--accent-color)]/30 rounded uppercase">
          Simulated interface, not a live API
        </span>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city (e.g. Coimbatore, Chennai, Bangalore)"
            className="w-full bg-[var(--bg-surface-secondary)] border border-[var(--border-color)] rounded pl-9 pr-3 py-2 text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-[var(--accent-color)] text-white text-xs font-mono rounded flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Preview response'}
        </button>
      </form>

      {/* Result Display */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded text-xs font-mono flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && !loading && (
        <div className="visual-stage relative border border-[var(--border-color)] p-4 rounded space-y-3 font-mono">
          <div className="relative z-10 flex items-center justify-between text-xs border-b border-white/10 pb-2">
            <span className="text-[var(--accent-color)] font-bold">
              Sample response / city={result.city}
            </span>
            <span className="text-emerald-400 text-[10px] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> SAMPLE DATA
            </span>
          </div>

          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <div className="bg-white/5 border border-white/10 p-2 rounded">
              <div className="text-[10px] text-[var(--visual-muted)] uppercase">Location</div>
              <div className="font-bold text-[var(--visual-ink)]">{result.city}, {result.country}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-2 rounded">
              <div className="text-[10px] text-[var(--visual-muted)] uppercase">Temp</div>
              <div className="font-bold text-[var(--accent-color)]">{result.temp}°C</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-2 rounded">
              <div className="text-[10px] text-[var(--visual-muted)] uppercase">Humidity</div>
              <div className="font-bold text-[var(--visual-ink)]">{result.humidity}%</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-2 rounded">
              <div className="text-[10px] text-[var(--visual-muted)] uppercase">Wind</div>
              <div className="font-bold text-[var(--visual-ink)]">{result.windSpeed} km/h</div>
            </div>
          </div>

          {/* Structured JSON payload snippet */}
          <div className="relative z-10 pt-2 text-[10px] text-[var(--visual-muted)]">
            <div className="flex items-center gap-1 mb-1 text-[var(--accent-color)]">
              <Terminal className="w-3 h-3" />
              <span>Sample JSON payload:</span>
            </div>
            <pre className="p-2 bg-black/40 rounded border border-white/10 overflow-x-auto text-[var(--visual-ink)]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
