'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Icons from '@phosphor-icons/react';
import clsx from 'clsx';

// --- Types ---
interface DrawConfig {
  width: number;
  height: number;
  complexity: number;
  targetKB: number;
  mode: 'pattern' | 'emoji';
  palette: string[];
  emoji: string;
  emojiDensity: number;
}

interface ImageStats {
  finalSize: number;
  baseSize: number;
  targetBytes: number;
  paddedBytes: number;
  qualityUsed: number;
  format: string;
  width: number;
  height: number;
  ext: string;
  hitsTarget: boolean;
  isTooLarge: boolean;
}

// --- Constants ---
const MAX_DIM = 6000;
const MAX_AREA = 16_000_000;

const PALETTES = [
    { name: 'Cyberpunk', colors: ['#0b1220', '#0ea5e9', '#a855f7'] },
    { name: 'Ocean', colors: ['#0f172a', '#38bdf8', '#22c55e'] },
    { name: 'Sunset', colors: ['#1e1b4b', '#f97316', '#fbbf24'] },
    { name: 'Midnight', colors: ['#020617', '#1e293b', '#6366f1'] },
    { name: 'Emerald', colors: ['#064e3b', '#10b981', '#a7f3d0'] },
    { name: 'Rose', colors: ['#4c0519', '#e11d48', '#fda4af'] },
];

const EMOJIS = ['🚀', '🔥', '⚡', '💎', '🌈', '🎨', '💻', '📱', '🎮', '❤️', '🌟', '🦄', '🐱', '🍕', '☕', '🌍'];

// --- Helper Functions ---
const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes.toFixed(0)} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const toBlob = (canvas: HTMLCanvasElement, format: string, quality?: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) return resolve(blob);
            reject(new Error('Unable to generate image file'));
        }, format, quality);
    });
};

const addPadding = (blob: Blob, targetBytes: number) => {
    const paddingNeeded = targetBytes - blob.size;
    if (paddingNeeded <= 0) return { blob, padding: 0 };
    
    const padding = new Uint8Array(paddingNeeded);
    if (window.crypto && crypto.getRandomValues) {
        const MAX_CHUNK = 65536;
        for (let offset = 0; offset < paddingNeeded; offset += MAX_CHUNK) {
            const view = padding.subarray(offset, Math.min(offset + MAX_CHUNK, paddingNeeded));
            crypto.getRandomValues(view);
        }
    } else {
        for (let i = 0; i < paddingNeeded; i++) padding[i] = Math.floor(Math.random() * 256);
    }
    
    return { blob: new Blob([blob, padding], { type: blob.type }), padding: paddingNeeded };
};

const drawArtwork = (canvas: HTMLCanvasElement, config: DrawConfig) => {
    const { width, height, complexity, mode, palette, emoji, emojiDensity, targetKB } = config;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingQuality = 'high';

    // 1. Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, palette[0]);
    gradient.addColorStop(1, palette[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Artistic Blobs
    const blobGrad = ctx.createRadialGradient(width * 0.2, height * 0.15, 0, width * 0.25, height * 0.25, Math.max(width, height) * 0.6);
    blobGrad.addColorStop(0, palette[1] + 'cc');
    blobGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = blobGrad;
    ctx.fillRect(0, 0, width, height);

    if (mode === 'pattern') {
        // --- Pattern Mode ---
        const rectCount = 12 + complexity * 8;
        for (let i = 0; i < rectCount; i++) {
            ctx.fillStyle = `${palette[Math.floor(Math.random() * 3)]}${Math.floor(Math.random() * 40 + 20).toString(16)}`;
            const w = Math.random() * (width * 0.4);
            const h = Math.random() * (height * 0.4);
            ctx.fillRect(Math.random() * width, Math.random() * height, w, h);
        }

        ctx.beginPath();
        const lineCount = 60 + complexity * 35;
        for (let i = 0; i < lineCount; i++) {
            ctx.moveTo(Math.random() * width, Math.random() * height);
            ctx.lineTo(Math.random() * width, Math.random() * height);
        }
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();
    } else {
        // --- Emoji Mode (Watermark Grid Style) ---
        const cellWidth = Math.max(60, width / (emojiDensity * 2));
        const cellHeight = cellWidth;
        const emojiSize = cellWidth * 0.5;
        
        ctx.font = `${emojiSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let x = 0; x <= width + cellWidth; x += cellWidth) {
            let rowIdx = 0;
            for (let y = 0; y <= height + cellHeight; y += cellHeight) {
                const offsetX = (rowIdx % 2 === 0) ? 0 : cellWidth / 2;
                
                ctx.save();
                ctx.translate(x + offsetX, y);
                // Subtle rotation for watermark feel
                ctx.rotate(-Math.PI / 8); 
                
                // Varied but subtle opacity
                ctx.globalAlpha = 0.15 + (Math.random() * 0.2);
                ctx.fillText(emoji, 0, 0);
                ctx.restore();
                
                rowIdx++;
            }
        }
        ctx.globalAlpha = 1.0;
    }

    // 3. Grid overlay
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    const step = Math.max(32, Math.min(width, height) / 20);
    for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
            ctx.fillRect(x, y, 1, 1);
        }
    }

    // 4. Center Label (Refined 2-line layout)
    const fontSize = Math.max(18, Math.min(width, height) * 0.08);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    const boxHeight = fontSize * 2.8;
    ctx.fillRect(0, (height / 2) - boxHeight / 2, width, boxHeight);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Line 1: Dimensions + Size
    ctx.font = `700 ${fontSize * 0.9}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${width} × ${height} PX (${targetKB} KB)`, width / 2, height / 2 - fontSize * 0.2);

    // Line 2: Branding
    ctx.font = `600 ${fontSize * 0.35}px "JetBrains Mono", monospace`;
    ctx.fillStyle = palette[1];
    ctx.letterSpacing = '4px';
    ctx.fillText(`MOCK IMAGE • DEV HERO`, width / 2, height / 2 + fontSize * 0.65);
    ctx.letterSpacing = '0px'; // Reset
};

const tuneQuality = async (canvas: HTMLCanvasElement, format: string, targetBytes: number, startingQuality: number) => {
    let low = 0.01;
    let high = startingQuality;
    let bestBlob = await toBlob(canvas, format, 0.01);
    let bestQuality = 0.01;

    if (bestBlob.size > targetBytes) return { blob: bestBlob, quality: 0.01 };

    for (let i = 0; i < 10; i++) {
        const mid = parseFloat(((low + high) / 2).toFixed(3));
        const candidate = await toBlob(canvas, format, mid);
        if (!candidate) break;

        if (candidate.size > targetBytes) {
            high = mid;
        } else {
            if (candidate.size > bestBlob.size) {
                bestBlob = candidate;
                bestQuality = mid;
            }
            low = mid;
        }
    }
    return { blob: bestBlob, quality: bestQuality };
};

const PRESETS = [
    { id: 'custom', name: 'Custom', w: 1200, h: 630 },
    { id: 'hd', name: 'HD (16:9)', w: 1920, h: 1080 },
    { id: 'fb', name: 'FB Link (1.91:1)', w: 1200, h: 630 },
    { id: 'ig', name: 'IG Story (9:16)', w: 1080, h: 1920 },
    { id: 'square', name: 'Square (1:1)', w: 1080, h: 1080 },
    { id: 'banner', name: 'Twitch/Twitter Banner', w: 1500, h: 500 },
];

export default function ImagePage() {
    const [width, setWidth] = useState(1200);
    const [height, setHeight] = useState(630);
    const [maxSize, setMaxSize] = useState(500);
    const [format, setFormat] = useState('image/jpeg');
    const [complexity, setComplexity] = useState(3);
    const [quality, setQuality] = useState(90);
    const [genMode, setGenMode] = useState<'pattern' | 'emoji'>('pattern');
    const [activePalette, setActivePalette] = useState(PALETTES[0]);
    const [selectedEmoji, setSelectedEmoji] = useState('🚀');
    const [emojiDensity, setEmojiDensity] = useState(3);
    const [orientation, setOrientation] = useState<'landscape' | 'portrait'>('landscape');
    const [preset, setPreset] = useState('fb');
    
    const [busy, setBusy] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [stats, setStats] = useState<ImageStats | null>(null);
    const [status, setStatus] = useState('Ready');
    const [statusColor, setStatusColor] = useState('text-emerald-300');

    const handlePresetChange = (id: string) => {
        setPreset(id);
        if (id === 'custom') return;
        const p = PRESETS.find(x => x.id === id);
        if (p) {
            if (orientation === 'portrait') {
                const [min, max] = [Math.min(p.w, p.h), Math.max(p.w, p.h)];
                setWidth(min); setHeight(max);
            } else {
                const [min, max] = [Math.min(p.w, p.h), Math.max(p.w, p.h)];
                setWidth(max); setHeight(min);
            }
        }
    };

    const toggleOrientation = (type: 'landscape' | 'portrait') => {
        if (orientation === type) return;
        setOrientation(type);
        // Swap Dimensions
        setWidth(height);
        setHeight(width);
    };

    const handleGenerate = async () => {
        if (busy) return;
        
        if (!width || !height || width <= 0 || height <= 0) {
            setStatus('Invalid Dim'); setStatusColor('text-rose-300'); return;
        }
        if (width > MAX_DIM || height > MAX_DIM || width * height > MAX_AREA) {
            setStatus('Too Large'); setStatusColor('text-rose-300'); return;
        }

        setBusy(true);
        setStatus('Generating...');
        setStatusColor('text-sky-300');
        
        try {
            const canvas = document.createElement('canvas');
            drawArtwork(canvas, { 
                width, height, complexity, 
                targetKB: maxSize, mode: genMode, 
                palette: activePalette.colors, 
                emoji: selectedEmoji, 
                emojiDensity 
            });

            const targetBytes = Math.floor(maxSize * 1024);
            const qualityNormalized = quality / 100;
            const baseBlob = await toBlob(canvas, format, format === 'image/jpeg' ? qualityNormalized : undefined);

            let workingBlob = baseBlob;
            let workingQuality = format === 'image/jpeg' ? qualityNormalized : 1;

            if (format === 'image/jpeg' && workingBlob.size > targetBytes) {
                const tuned = await tuneQuality(canvas, format, targetBytes, qualityNormalized);
                workingBlob = tuned.blob;
                workingQuality = tuned.quality;
            }

            const isTooLarge = workingBlob.size > targetBytes;
            let paddedBytes = 0;

            if (!isTooLarge && workingBlob.size < targetBytes) {
                const padded = addPadding(workingBlob, targetBytes);
                workingBlob = padded.blob;
                paddedBytes = padded.padding;
            }

            const ext = format === 'image/jpeg' ? 'jpg' : 'png';
            const hitsTarget = Math.abs(workingBlob.size - targetBytes) < 2;

            const url = URL.createObjectURL(workingBlob);
            setPreviewUrl(url);
            setStats({
                finalSize: workingBlob.size,
                baseSize: baseBlob.size,
                targetBytes,
                paddedBytes,
                qualityUsed: workingQuality,
                format,
                width,
                height,
                ext,
                hitsTarget,
                isTooLarge
            });

            setStatus(isTooLarge ? 'Capped at min quality' : 'Done');
            setStatusColor(isTooLarge ? 'text-amber-300' : 'text-emerald-300');

        } catch (e) {
            setStatus('Error');
            setStatusColor('text-rose-300');
            console.error(e);
        } finally {
            setBusy(false);
        }
    };

    const handleReset = () => {
        setWidth(800);
        setHeight(600);
        setMaxSize(500);
        setFormat('image/jpeg');
        setComplexity(3);
        setQuality(90);
        setGenMode('pattern');
        setActivePalette(PALETTES[0]);
        setPreviewUrl(null);
        setStats(null);
        setStatus('Ready');
    };

    useEffect(() => {
        return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
    }, [previewUrl]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-slate-200 font-sans">
          <header className="glass h-[70px] flex-shrink-0 flex items-center justify-between px-6 shadow-lg relative z-10 border-b border-white/10">
            <div className="flex items-center gap-3">
                <div className="bg-cyan-500 p-2 rounded-lg shadow-cyan-500/20 shadow-lg">
                    <Icons.ImageSquare className="text-white text-xl" weight="fill" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-wide uppercase">IMAGE <span className="text-cyan-400">HERO</span></h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Premium Mock Generator</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-800/60 border border-slate-700 text-slate-200 hover:bg-slate-700 transition">
                        <Icons.House weight="bold" /> Index
                    </Link>
                </div>
                <div className={clsx("flex items-center gap-2 font-black text-[10px] bg-slate-800/80 px-4 py-2 rounded-full border border-white/5", statusColor)}>
                    <div className={clsx("w-2 h-2 rounded-full bg-current", busy && "animate-pulse shadow-[0_0_10px_currentColor]")}></div>
                    <span>{status.toUpperCase()}</span>
                </div>
            </div>
          </header>

          <main className="flex flex-1 relative overflow-hidden bg-[#0a0f1d]">
             
             {/* Left Rail: Pickers */}
             <div className="w-[80px] border-r border-white/5 bg-slate-900/40 flex flex-col items-center py-6 gap-8 overflow-y-auto shrink-0">
                <div className="flex flex-col gap-3 items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase vertical-text mb-2">Modes</span>
                    <button onClick={() => setGenMode('pattern')} className={clsx("p-3 rounded-xl transition-all active:scale-95 shadow-lg", genMode === 'pattern' ? "bg-cyan-500 text-slate-900 shadow-cyan-500/20" : "bg-slate-800 text-slate-400 hover:text-white")}>
                        <Icons.CompassTool size={20} weight="fill" />
                    </button>
                    <button onClick={() => setGenMode('emoji')} className={clsx("p-3 rounded-xl transition-all active:scale-95 shadow-lg", genMode === 'emoji' ? "bg-purple-500 text-white shadow-purple-500/20" : "bg-slate-800 text-slate-400 hover:text-white")}>
                        <Icons.Smiley size={20} weight="fill" />
                    </button>
                </div>

                <div className="h-px w-8 bg-white/5"></div>

                <div className="flex flex-col gap-3 items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase vertical-text mb-1">Theme</span>
                    {PALETTES.map(p => (
                        <button 
                            key={p.name} 
                            onClick={() => setActivePalette(p)}
                            className={clsx(
                                "w-8 h-8 rounded-full border-2 transition-all p-0.5",
                                activePalette.name === p.name ? "border-white scale-110 shadow-lg" : "border-white/10 opacity-60 hover:opacity-100"
                            )}
                            style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[2]})` }}
                            title={p.name}
                        />
                    ))}
                </div>

                {genMode === 'emoji' && (
                    <>
                        <div className="h-px w-8 bg-white/5"></div>
                        <div className="flex flex-col gap-2 items-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase vertical-text mb-1">Emoji</span>
                            <div className="grid grid-cols-1 gap-2">
                                {EMOJIS.map(e => (
                                    <button 
                                        key={e} 
                                        onClick={() => setSelectedEmoji(e)}
                                        className={clsx(
                                            "w-10 h-10 flex items-center justify-center rounded-lg text-lg transition-all",
                                            selectedEmoji === e ? "bg-white/10 scale-110 shadow-inner ring-1 ring-white/20" : "hover:bg-white/5 opacity-60 hover:opacity-100"
                                        )}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
             </div>

             {/* Controls Panel */}
             <div className="w-[300px] border-r border-white/5 flex flex-col bg-slate-900/40 p-6 space-y-6 overflow-y-auto shrink-0 shadow-2xl">
                <div className="space-y-6">
                    <div>
                    <h2 className="text-sm font-black text-white mb-4 flex items-center gap-2">
                        <Icons.GearSix weight="fill" className="text-cyan-400" />
                        CONFIGURATION
                    </h2>
                    <div className="space-y-4">
                        {/* Presets & Orientation Row */}
                        <div className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex bg-slate-800 p-1 rounded-lg">
                                <button 
                                    onClick={() => toggleOrientation('landscape')}
                                    className={clsx("flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-black rounded-md transition-all", orientation === 'landscape' ? "bg-slate-700 text-white shadow-xl" : "text-slate-500 hover:text-slate-300")}
                                >
                                    <Icons.ProjectorScreenChart weight="bold" /> LANDSCAPE
                                </button>
                                <button 
                                    onClick={() => toggleOrientation('portrait')}
                                    className={clsx("flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-black rounded-md transition-all", orientation === 'portrait' ? "bg-slate-700 text-white shadow-xl" : "text-slate-500 hover:text-slate-300")}
                                >
                                    <Icons.DeviceMobile weight="bold" /> PORTRAIT
                                </button>
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Size Preset</label>
                                <select 
                                    value={preset} 
                                    onChange={e => handlePresetChange(e.target.value)}
                                    className="w-full bg-slate-800/80 border border-white/5 rounded-lg p-2.5 text-[11px] font-bold appearance-none outline-none focus:ring-1 focus:ring-cyan-500"
                                >
                                    {PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Width</label>
                                <input type="number" value={width} onChange={e => { setWidth(Number(e.target.value)); setPreset('custom'); }} className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-3 text-xs font-mono focus:ring-1 focus:ring-cyan-500 outline-none" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Height</label>
                                <input type="number" value={height} onChange={e => { setHeight(Number(e.target.value)); setPreset('custom'); }} className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-3 text-xs font-mono focus:ring-1 focus:ring-cyan-500 outline-none" />
                            </div>
                        </div>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Target Size (KB)</label>
                                <input type="number" value={maxSize} onChange={e => setMaxSize(Number(e.target.value))} className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-3 text-sm font-mono text-emerald-400 font-bold focus:ring-1 focus:ring-cyan-500 outline-none" />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Format</label>
                                <select value={format} onChange={e => setFormat(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-3 text-xs font-bold appearance-none outline-none focus:ring-1 focus:ring-cyan-500">
                                    <option value="image/jpeg">JPG (Supports Target)</option>
                                    <option value="image/png">PNG (Lossless)</option>
                                </select>
                            </div>
                             
                            {genMode === 'pattern' ? (
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                        <span>Art Complexity</span>
                                        <span className="text-cyan-400">Lv {complexity}</span>
                                    </div>
                                    <input type="range" min="1" max="5" value={complexity} onChange={e => setComplexity(Number(e.target.value))} className="w-full accent-cyan-500 bg-slate-800 rounded-lg" />
                                </div>
                            ) : (
                                <div className="space-y-2 pt-2">
                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                        <span>Emoji Density</span>
                                        <span className="text-purple-400">Lv {emojiDensity}</span>
                                    </div>
                                    <input type="range" min="1" max="10" value={emojiDensity} onChange={e => setEmojiDensity(Number(e.target.value))} className="w-full accent-purple-500 bg-slate-800 rounded-lg" />
                                </div>
                            )}

                             <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                    <span>Init Quality</span>
                                    <span className="text-slate-300">{quality}%</span>
                                </div>
                                <input type="range" min="1" max="100" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-slate-500 h-1 bg-slate-800 rounded-full" />
                            </div>

                            <div className="pt-4 flex flex-col gap-2">
                                <button onClick={handleGenerate} disabled={busy} className="w-full bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-900 font-black py-4 rounded-xl disabled:opacity-50 transition-all shadow-[0_10px_20px_-10px_rgba(6,182,212,0.5)] active:scale-[0.98] uppercase tracking-wider text-xs">
                                    {busy ? 'Processing...' : 'Generate Image'}
                                </button>
                                <button onClick={handleReset} className="w-full px-3 py-3 border border-white/5 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                    <Icons.ArrowClockwise size={14} weight="bold" /> Reset All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
             </div>

             {/* Preview Area */}
             <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-y-auto bg-grid-pattern">
                <div className="w-full max-w-4xl space-y-6">
                    
                    {/* Main Preview */}
                    <div className="bg-slate-900/60 border-2 border-dashed border-white/5 rounded-[2.5rem] p-4 min-h-[450px] flex items-center justify-center relative shadow-inner overflow-hidden">
                        {previewUrl ? (
                            <div className="relative group p-2 bg-white/[0.02] rounded-3xl backdrop-blur-3xl shadow-2xl ring-1 ring-white/10">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={previewUrl} alt="Preview" className="max-h-[500px] max-w-full object-contain rounded-2xl" />
                                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none"></div>
                            </div>
                        ) : (
                            <div className="text-slate-700 flex flex-col items-center opacity-40">
                                <Icons.ImageSquare size={80} weight="thin" />
                                <p className="mt-4 text-xs font-black uppercase tracking-[0.3em]">Awaiting Generation</p>
                            </div>
                        )}
                        {busy && <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-cyan-500/20 rounded-full"></div>
                                <div className="absolute top-0 w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                <div className="mt-4 text-[10px] font-black text-cyan-500 animate-pulse text-center">RENDERING...</div>
                            </div>
                        </div>}
                    </div>

                    {/* Stats Dashboard */}
                    {stats && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-slate-900/80 border border-white/10 p-5 rounded-3xl relative overflow-hidden group">
                                    <div className="absolute -right-4 -top-4 w-12 h-12 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform"></div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Final Byte Size</p>
                                    <p className={clsx("font-mono text-xl font-bold font-jetbrains", stats.hitsTarget ? "text-emerald-400" : "text-amber-400")}>{formatBytes(stats.finalSize)}</p>
                                    <div className="mt-1 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-full animate-pulse"></div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-900/80 border border-white/10 p-5 rounded-3xl">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Target Limit</p>
                                    <p className="font-mono text-xl text-slate-300 font-bold font-jetbrains">{formatBytes(stats.targetBytes)}</p>
                                    <p className="text-[10px] text-slate-600 mt-1 uppercase font-bold">Accuracy: {stats.hitsTarget ? '±1 Byte' : 'Skipped'}</p>
                                </div>

                                <div className="bg-slate-900/80 border border-white/10 p-5 rounded-3xl">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Inject Padding</p>
                                    <p className="font-mono text-xl text-cyan-400 font-bold font-jetbrains">{formatBytes(stats.paddedBytes)}</p>
                                    <div className="flex gap-1 mt-2">
                                        {[...Array(4)].map((_, i) => <div key={i} className="h-1 flex-1 bg-cyan-500/20 rounded-full overflow-hidden"><div className="h-full bg-cyan-500/80" style={{ width: i < (stats.paddedBytes > 0 ? 4 : 0) ? '100%' : '0' }}></div></div>)}
                                    </div>
                                </div>

                                <div className="bg-emerald-500 text-slate-950 p-2 rounded-3xl flex flex-col items-stretch overflow-hidden shadow-[0_10px_30px_-10px_rgba(16,185,129,0.3)]">
                                    <a href={previewUrl!} download={`devhero-${stats.width}x${stats.height}.${stats.ext}`} className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-emerald-950/20 hover:bg-white/10 rounded-2xl transition-all group">
                                        <Icons.DownloadSimple weight="fill" size={24} className="group-hover:bounce mb-1" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Download .{stats.ext}</span>
                                    </a>
                                </div>
                            </div>

                            {stats.isTooLarge && (
                                <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-3xl flex items-start gap-4 ring-1 ring-orange-500/5">
                                    <Icons.WarningCircle className="text-orange-400 mt-0.5 shrink-0" size={24} weight="fill" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-orange-200 uppercase tracking-widest">Physical Constraint Warning</p>
                                        <p className="text-[11px] text-orange-200/60 leading-relaxed font-medium">
                                            The base encoding at minimum quality ({formatBytes(stats.baseSize)}) exceeds your target of {formatBytes(stats.targetBytes)}. 
                                            The file cannot be made smaller without reducing resolution or changing complexity.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
             </div>
          </main>
        </div>
    );
}
