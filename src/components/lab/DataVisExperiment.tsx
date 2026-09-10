import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Radio } from 'lucide-react';

interface TelemetryPoint {
  time: string;
  packets: number;
  latency: number;
}

export const DataVisExperiment: React.FC = () => {
  const [data, setData] = useState<TelemetryPoint[]>([
    { time: '10:00:01', packets: 42, latency: 12 },
    { time: '10:00:02', packets: 68, latency: 15 },
    { time: '10:00:03', packets: 55, latency: 14 },
    { time: '10:00:04', packets: 89, latency: 22 },
    { time: '10:00:05', packets: 74, latency: 18 },
    { time: '10:00:06', packets: 95, latency: 16 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newPoint: TelemetryPoint = {
        time: timeStr,
        packets: Math.floor(Math.random() * 60) + 40,
        latency: Math.floor(Math.random() * 15) + 10
      };
      setData((prev) => [...prev.slice(1), newPoint]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-color)] p-5 rounded-lg space-y-4 font-mono">
      <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-[var(--accent-color)]" />
          <h3 className="text-xs text-[var(--accent-color)] uppercase font-bold tracking-wider">
            EXPERIMENT 05 // NEURAL DATA STREAM GRAPH
          </h3>
        </div>
        <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] rounded">
          Experimental / Personal Work
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>Real-time Stream Telemetry</span>
        </div>
        <div className="text-[10px]">SAMPLING INTERVAL: 2000ms</div>
      </div>

      <div className="visual-stage relative h-64 w-full p-2 border border-[var(--border-color)] rounded">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPackets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#A7AFBF" fontSize={10} tickLine={false} />
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
              dataKey="packets"
              stroke="var(--accent-color)"
              fillOpacity={1}
              fill="url(#colorPackets)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
