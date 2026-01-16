'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import * as Icons from '@phosphor-icons/react';
import clsx from 'clsx';

// --- Types ---
interface TimezoneOption {
  value: string;
  label: string;
  offset: number;
}

// --- Constants ---
const TIMEZONES: TimezoneOption[] = [
  { value: 'UTC', label: 'UTC (GMT)', offset: 0 },
  { value: 'Asia/Bangkok', label: 'Bangkok (+07:00)', offset: 7 },
  { value: 'Asia/Tokyo', label: 'Tokyo (+09:00)', offset: 9 },
  { value: 'Asia/Seoul', label: 'Seoul (+09:00)', offset: 9 },
  { value: 'Asia/Singapore', label: 'Singapore (+08:00)', offset: 8 },
  { value: 'Asia/Shanghai', label: 'Shanghai (+08:00)', offset: 8 },
  { value: 'Europe/London', label: 'London (+00:00/+01:00)', offset: 0 },
  { value: 'Europe/Paris', label: 'Paris (+01:00/+02:00)', offset: 1 },
  { value: 'America/New_York', label: 'New York (-05:00/-04:00)', offset: -5 },
  { value: 'America/Los_Angeles', label: 'Los Angeles (-08:00/-07:00)', offset: -8 },
];

export default function TimestampPage() {
  const [unixInput, setUnixInput] = useState<string>('');
  const [humanInput, setHumanInput] = useState<string>('');
  const [isoInput, setIsoInput] = useState<string>('');
  const [selectedZone, setSelectedZone] = useState<TimezoneOption>(TIMEZONES[1]); // Context for Human input
  const [targetZone, setTargetZone] = useState<TimezoneOption>(TIMEZONES[0]); // Target for featured conversion
  const [status, setStatus] = useState('Ready');
  const [statusColor, setStatusColor] = useState('text-emerald-300');

  const syncFromUnix = useCallback((ms: number) => {
    const date = new Date(ms);
    const isValid = !isNaN(date.getTime());
    
    if (isValid) {
      // 1. Update Human Input based on selected context zone
      const tzDate = new Date(ms + (selectedZone.offset * 60 * 60 * 1000));
      setHumanInput(tzDate.toISOString().slice(0, 19));
      
      // 2. Update ISO Input (always UTC)
      setIsoInput(date.toISOString());
    } else {
      setHumanInput('');
      setIsoInput('');
    }
  }, [selectedZone.offset]);

  const handleSetNow = useCallback(() => {
    const now = new Date();
    const ms = now.getTime();
    setUnixInput(Math.floor(ms / 1000).toString());
    syncFromUnix(ms);
  }, [syncFromUnix]);

  // Load current time on mount
  useEffect(() => {
    handleSetNow();
  }, [handleSetNow]);

  const syncFromHuman = (val: string) => {
    if (!val) return;
    const date = new Date(val + 'Z'); 
    if (isNaN(date.getTime())) return;
    
    const ms = date.getTime() - (selectedZone.offset * 60 * 60 * 1000);
    setUnixInput(Math.floor(ms / 1000).toString());
    setIsoInput(new Date(ms).toISOString());
  };

  const syncFromIso = (val: string) => {
    if (!val) return;
    const date = new Date(val);
    if (isNaN(date.getTime())) return;
    
    const ms = date.getTime();
    setUnixInput(Math.floor(ms / 1000).toString());
    
    const tzDate = new Date(ms + (selectedZone.offset * 60 * 60 * 1000));
    setHumanInput(tzDate.toISOString().slice(0, 19));
  };

  const handleUnixChange = (val: string) => {
    setUnixInput(val);
    const num = parseInt(val);
    if (isNaN(num)) return;
    const ms = val.length > 11 ? num : num * 1000;
    syncFromUnix(ms);
  };

  const handleHumanChange = (val: string) => {
    setHumanInput(val);
    syncFromHuman(val);
  };

  const handleIsoChange = (val: string) => {
    setIsoInput(val);
    syncFromIso(val);
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setStatus('Copied!');
    setStatusColor('text-sky-300');
    setTimeout(() => {
      setStatus('Ready');
      setStatusColor('text-emerald-300');
    }, 2000);
  };

  const currentMs = unixInput.length > 11 ? parseInt(unixInput) : parseInt(unixInput) * 1000;
  const currentDate = new Date(isNaN(currentMs) ? 0 : currentMs);
  const isValidDate = !isNaN(currentDate.getTime()) && unixInput !== '';

  // Calculate target date
  const targetDate = new Date(currentMs + (targetZone.offset * 60 * 60 * 1000));
  const isValidTarget = !isNaN(targetDate.getTime()) && isValidDate;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-slate-200 font-sans">
      <header className="glass h-[70px] flex-shrink-0 flex items-center justify-between px-6 shadow-lg relative z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-500 p-2 rounded-lg shadow-indigo-500/20 shadow-lg">
                <Icons.Clock className="text-white text-xl" weight="fill" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-white tracking-wide uppercase font-jetbrains">TIMESTAMP <span className="text-indigo-400">HERO</span></h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Timezone & Format Converter</p>
            </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-800/60 border border-slate-700 text-slate-200 hover:bg-slate-700 transition">
                <Icons.House weight="bold" /> Index
            </Link>
            <div className={clsx("flex items-center gap-2 font-black text-[10px] bg-slate-800/80 px-4 py-2 rounded-full border border-white/5", statusColor)}>
                <div className="w-2 h-2 rounded-full bg-current"></div>
                <span>{status.toUpperCase()}</span>
            </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-[#0a0f1d]">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Inputs (12 -> 7) */}
            <section className="lg:col-span-7 space-y-6">
              <div className="card glass p-6 border-slate-800/50 h-full">
                <h2 className="text-sm font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest opacity-80">
                  <Icons.Keyhole weight="fill" className="text-indigo-400" />
                  Triple-Sync Input
                </h2>

                <div className="space-y-6">
                  {/* Unix Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Unix Timestamp (s / ms)</label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={unixInput}
                        onChange={(e) => handleUnixChange(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-xl font-mono text-indigo-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" 
                        placeholder="e.g. 1705408593"
                      />
                      <button 
                        onClick={() => copyToClipboard(unixInput)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white transition-colors"
                      >
                        <Icons.Copy weight="bold" size={20} />
                      </button>
                    </div>
                  </div>

                  {/* ISO Input (New) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">ISO 8601 String (UTC)</label>
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={isoInput}
                        onChange={(e) => handleIsoChange(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-lg font-mono text-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all px-4" 
                        placeholder="YYYY-MM-DDTHH:mm:ss.sssZ"
                      />
                      <button 
                        onClick={() => copyToClipboard(isoInput)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-white transition-colors"
                      >
                        <Icons.Copy weight="bold" size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div className="h-px flex-1 bg-slate-800"></div>
                    <span className="text-[10px] font-black text-slate-600 uppercase">Contextual Sync</span>
                    <div className="h-px flex-1 bg-slate-800"></div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Input Timezone (Local)</label>
                          <div className="relative">
                            <select 
                              value={selectedZone.value}
                              onChange={(e) => {
                                const zone = TIMEZONES.find(z => z.value === e.target.value)!;
                                setSelectedZone(zone);
                                if (isValidDate) {
                                  const ms = currentMs;
                                  const tzDate = new Date(ms + (zone.offset * 60 * 60 * 1000));
                                  setHumanInput(tzDate.toISOString().slice(0, 19));
                                }
                              }}
                              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm font-bold appearance-none outline-none focus:border-indigo-500 transition-all text-slate-300 pr-10 cursor-pointer"
                            >
                              {TIMEZONES.map(tz => (
                                <option key={tz.value} value={tz.value}>{tz.label}</option>
                              ))}
                            </select>
                            <Icons.CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" weight="bold" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Human Readable (Input)</label>
                          <input 
                            type="datetime-local" 
                            step="1"
                            value={humanInput}
                            onChange={(e) => handleHumanChange(e.target.value)}
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-lg font-mono text-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all dark:[color-scheme:dark]" 
                          />
                        </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSetNow}
                    className="w-full py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98] uppercase tracking-widest text-xs"
                  >
                    Reset all to &quot;NOW&quot;
                  </button>
                </div>
              </div>
            </section>

            {/* Right Column: Featured Conversion (12 -> 5) */}
            <section className="lg:col-span-5 space-y-6">
              <div className="card glass p-8 border-indigo-500/20 bg-indigo-500/5 h-full flex flex-col">
                <h2 className="text-sm font-black text-white mb-8 flex items-center gap-2 uppercase tracking-widest opacity-80">
                  <Icons.Target weight="fill" className="text-rose-400" />
                  Target Zone Hero
                </h2>

                <div className="flex-1 space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Output Timezone (Target)</label>
                    <div className="relative">
                      <select 
                        value={targetZone.value}
                        onChange={(e) => {
                          const zone = TIMEZONES.find(z => z.value === e.target.value)!;
                          setTargetZone(zone);
                        }}
                        className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-sm font-bold appearance-none outline-none focus:border-indigo-500 transition-all text-indigo-300 pr-10 cursor-pointer"
                      >
                        {TIMEZONES.map(tz => (
                          <option key={tz.value} value={tz.value}>{tz.label}</option>
                        ))}
                      </select>
                      <Icons.CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" weight="bold" />
                    </div>
                  </div>

                  <div className="p-8 bg-slate-950/80 border border-indigo-500/30 rounded-[2.5rem] relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Icons.Clock weight="fill" size={120} />
                    </div>
                    <div className="relative z-10 text-center">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Converted Value</p>
                        <h3 className="text-3xl md:text-4xl font-mono font-black text-white mb-2 break-all">
                            {isValidTarget ? targetDate.toISOString().slice(11, 19) : '--:--:--'}
                        </h3>
                        <p className="text-lg font-mono text-slate-400 mb-6">
                            {isValidTarget ? targetDate.toISOString().slice(0, 10) : '---- -- --'}
                        </p>
                        <button 
                            onClick={() => isValidTarget && copyToClipboard(`${targetDate.toISOString().slice(0, 10)} ${targetDate.toISOString().slice(11, 19)}`)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all text-slate-300 active:scale-95"
                        >
                            Copy Pretty
                        </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Offset</p>
                        <div className="bg-slate-900/50 p-4 rounded-2xl font-mono text-emerald-400 text-sm font-bold">
                            {targetZone.offset >= 0 ? `+${targetZone.offset}` : targetZone.offset}:00
                        </div>
                    </div>
                    <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Target ISO</p>
                        <div 
                            onClick={() => isValidTarget && copyToClipboard(targetDate.toISOString().replace('Z', ''))}
                            className="bg-slate-900/50 p-4 rounded-2xl font-mono text-indigo-300 text-[10px] font-bold truncate cursor-pointer hover:bg-slate-800"
                        >
                            {isValidTarget ? targetDate.toISOString().replace('Z', '') : '-'}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Bottom Section: Multi Timezone Comparison */}
          <section className="space-y-6 pb-20">
             <div className="flex items-center justify-between px-2">
                <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest opacity-80">
                  <Icons.Globe weight="fill" className="text-indigo-400" />
                  Quick View Matrix
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Auto Sync Grid</span>
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {TIMEZONES.map(tz => {
                  const localizedDate = new Date(currentMs + (tz.offset * 60 * 60 * 1000));
                  const isContext = tz.value === selectedZone.value;
                  const isTarget = tz.value === targetZone.value;
                  const isValid = !isNaN(localizedDate.getTime()) && isValidDate;

                  return (
                    <div 
                      key={tz.value}
                      className={clsx(
                        "group p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden",
                        isContext && "bg-indigo-500/10 border-indigo-500/50",
                        isTarget && !isContext && "bg-rose-500/10 border-rose-500/30",
                        !isContext && !isTarget && "bg-slate-800/20 border-white/5 hover:border-white/10"
                      )}
                      onClick={() => {
                        if (isValid) {
                          setTargetZone(tz);
                        }
                      }}
                    >
                      {isContext && <div className="absolute right-0 top-0 bg-indigo-500 text-[8px] font-black text-white px-2 py-0.5 rounded-bl-lg tracking-widest">CONTEXT</div>}
                      {isTarget && !isContext && <div className="absolute right-0 top-0 bg-rose-500 text-[8px] font-black text-white px-2 py-0.5 rounded-bl-lg tracking-widest">TARGET</div>}
                      
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest break-all mb-3">{tz.label.split('(')[0]}</p>
                      <div className="space-y-0.5">
                        <p className="text-lg font-mono font-bold text-white truncate leading-none">
                            {isValid ? localizedDate.toISOString().slice(11, 16) : '--:--'}
                        </p>
                        <p className="text-[9px] font-mono text-slate-500">
                            {isValid ? localizedDate.toISOString().slice(0, 10) : '---- -- --'}
                        </p>
                      </div>
                    </div>
                  );
                })}
             </div>
          </section>

        </div>
      </main>
    </div>
  );
}
