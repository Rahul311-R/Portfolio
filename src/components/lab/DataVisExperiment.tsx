import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Radio } from 'lucide-react';

interface WavePoint {
  step: string;
  amplitude: number;
}

export const DataVisExperiment: React.FC = () => {
  const [data, setData] = useState<WavePoint[]>([
    { step: '001', amplitude: 42 },
    { step: '002', amplitude: 68 },
    { step: '003', amplitude: 55 },
    { step: '004', amplitude: 89 },
    { step: '005', amplitude: 74 },
    { step: '006', amplitude: 95 }
  ]);

  useEffect(() => {
    let tick = 6;
    const interval = setInterval(() => {
      tick += 1;
      const newPoint: WavePoint = {
        step: String(tick).padStart(3, '0'),
        amplitude: Math.floor(Math.random() * 60) + 40
      };
      setData((prev) => [...prev.slice(-11), newPoint]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-lg space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--accent-color)]" />
          <h3 className="text-xs text-[var(--accent-color)] uppercase font-bold tracking-wider">
            EXPERIMENT 05 // GENERATIVE DATA SKETCH
          </h3>
        </div>
        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] rounded">
          Experimental / Personal Work
        </span>
      </div>

      <p className="text-[11px] leading-relaxed text-[var(--text-muted)]">
        A charting study with synthetic wave data generated in the browser —
        not measured telemetry from any system.
      </p>

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-emerald-400" />
          <span>Synthetic wave · redraws every 2s</span>
        </div>
        <div className="text-[10px]">12-POINT WINDOW</div>
      </div>

      <div className="visual-stage relative h-64 w-full p-2 border border-[var(--border-color)] rounded">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="step" stroke="#A7AFBF" fontSize={10} tickLine={false} />
            <YAxis stroke="#A7AFBF" fontSize={10} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#181B24',
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#F5F7FA',
                fontSize: '11px'
              }}
            />
            <Area
              type="monotone"
              dataKey="amplitude"
              stroke="var(--accent-color)"
              fillOpacity={1}
              fill="url(#colorWave)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
