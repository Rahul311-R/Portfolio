import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';
import { soundFx } from '../../utils/audio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface HistoryItem {
  command: string;
  output: React.ReactNode;
}

export const TerminalHUD: React.FC = () => {
  const [input, setInput] = useState('');
  const reducedMotion = useReducedMotion();
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      command: 'sys.init()',
      output: (
        <div className="text-emerald-400 space-y-1">
          <div>[SYSTEM OK] RAHUL R DIGITAL LAB initialized.</div>
          <div>[INFO] Type <span className="text-[var(--accent-color)] font-bold">help</span> or click quick commands below.</div>
        </div>
      )
    }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [history, reducedMotion]);

  const executeCommand = (cmdStr: string) => {
    soundFx.playTerminalChime();
    const cleanCmd = cmdStr.trim().toLowerCase();
    let response: React.ReactNode;

    switch (cleanCmd) {
      case 'help':
        response = (
          <div className="space-y-1 text-xs">
            <div className="text-[var(--accent-color)] font-bold">AVAILABLE EXECUTABLE COMMANDS:</div>
            <div>• <span className="text-amber-400 font-bold">whoami</span> — Profile summary</div>
            <div>• <span className="text-amber-400 font-bold">skills</span> — Resume-listed tools</div>
            <div>• <span className="text-amber-400 font-bold">patent</span> — Publication note</div>
            <div>• <span className="text-amber-400 font-bold">projects</span> — Project index</div>
            <div>• <span className="text-amber-400 font-bold">clear</span> — Wipe terminal output</div>
          </div>
        );
        break;

      case 'whoami':
        response = (
          <div className="space-y-1 text-xs text-[var(--visual-muted)]">
            <div><span className="text-[var(--accent-color)] font-bold">NAME:</span> Rahul R</div>
            <div><span className="text-[var(--accent-color)] font-bold">FOCUS:</span> AI × Data × Code</div>
            <div><span className="text-[var(--accent-color)] font-bold">DEGREE:</span> B.Tech AI & Data Science (8.3/10 CGPA)</div>
            <div><span className="text-[var(--accent-color)] font-bold">LOCATION:</span> Coimbatore, India</div>
          </div>
        );
        break;

      case 'skills':
        response = (
          <div className="space-y-1 text-xs text-[var(--visual-muted)]">
            <div><span className="text-cyan-400 font-bold">[LANGUAGES]:</span> Python, Java, SQL</div>
            <div><span className="text-purple-400 font-bold">[DATA & VISION]:</span> OpenCV, Pandas, Matplotlib, Power BI</div>
            <div><span className="text-emerald-400 font-bold">[TOOLS]:</span> MySQL, Figma, Git, API Integration, GUI Development</div>
          </div>
        );
        break;

      case 'patent':
        response = (
          <div className="space-y-1 text-xs text-amber-300">
            <div className="font-bold">[PATENT PUBLISHED - INDIAN PATENT OFFICE]</div>
            <div>Project: AI-Powered Road Condition Analyzer</div>
            <div>Concept: AI + GPS + IoT sensors for road fault detection</div>
            <div>Status: Accepted & Published</div>
          </div>
        );
        break;

      case 'projects':
        response = (
          <div className="space-y-1 text-xs text-[var(--visual-muted)]">
            <div>1. <span className="text-[var(--accent-color)] font-bold">Road Condition Analyzer</span> [AI / Computer Vision / IoT]</div>
            <div>2. <span className="text-[var(--accent-color)] font-bold">Virtual Drawing Board</span> [Hand Tracking / 95%+ Detection Accuracy]</div>
            <div>3. <span className="text-[var(--accent-color)] font-bold">Weather Prediction GUI</span> [REST API / GUI]</div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        response = (
          <div className="text-rose-400 text-xs">
            Command not recognized: '{cleanCmd}'. Type '<span className="underline cursor-pointer" onClick={() => executeCommand('help')}>help</span>' for menu.
          </div>
        );
    }

    setHistory((prev) => [...prev, { command: cmdStr, output: response }]);
    setInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
  };

  return (
    <div className="visual-stage relative w-full max-w-xl border border-[var(--border-color)] rounded-lg shadow-2xl overflow-hidden font-mono text-xs">
      {/* Window Controls Header */}
      <div className="relative z-10 px-4 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          <span className="text-[10px] text-[var(--text-muted)] ml-2 flex items-center gap-1">
            <TerminalIcon className="w-3 h-3 text-[var(--accent-color)]" /> bash — 80x24
          </span>
        </div>
        <div className="text-[10px] text-[var(--accent-color)] uppercase tracking-wider">
          INTERACTIVE PROFILE TERMINAL
        </div>
      </div>

      {/* Output Buffer */}
      <div className="relative z-10 p-4 h-56 overflow-y-auto space-y-3 scrollbar-thin">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-[var(--visual-muted)]">
              <span className="text-emerald-400 font-bold">rahul@digital-lab:~$</span>
              <span className="text-[var(--visual-ink)] font-bold">{item.command}</span>
            </div>
            <div>{item.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input prompt */}
      <form onSubmit={handleSubmit} className="relative z-10 px-4 py-2 border-t border-white/10 bg-black/30 flex items-center gap-2">
        <span className="text-emerald-400 font-bold">rahul@digital-lab:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type command ('help', 'whoami', 'patent')..."
          className="flex-1 bg-transparent text-[var(--visual-ink)] font-mono focus:outline-none placeholder:text-[var(--visual-muted)] placeholder:opacity-60 text-xs"
        />
        <button type="submit" aria-label="Execute command" className="text-[var(--accent-color)] hover:text-[var(--visual-ink)]">
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Quick command triggers */}
      <div className="relative z-10 px-4 py-2 bg-white/5 border-t border-white/10 flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-[var(--text-muted)]">QUICK COMMANDS:</span>
        {['whoami', 'skills', 'patent', 'projects'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            type="button"
            className="px-2 py-0.5 bg-white/5 border border-white/10 text-[10px] text-[var(--accent-color)] hover:border-[var(--accent-color)] hover:bg-[var(--accent-glow)] rounded transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
