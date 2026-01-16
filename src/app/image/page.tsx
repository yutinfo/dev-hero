'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Icons from '@phosphor-icons/react';
import clsx from 'clsx';

interface DrawConfig {
  width: number;
  height: number;
  complexity: number;
  targetKB: number;
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
}

// --- Constants ---
const MAX_DIM = 6000;
const MAX_AREA = 16_000_000;
const MIN_TARGET_KB = 10;

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

const drawArtwork = (canvas: HTMLCanvasElement, { width, height, complexity, targetKB }: DrawConfig) => {
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.imageSmoothingQuality = 'high';

    const palettes = [
        ['#0b1220', '#0ea5e9', '#a855f7'],
        ['#0f172a', '#22c55e', '#38bdf8'],
        ['#0a0f1d', '#f97316', '#22d3ee'],
        ['#0d111f', '#e0f2fe', '#38bdf8']
    ];
    const palette = palettes[Math.floor(Math.random() * palettes.length)];

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, palette[0]);
    gradient.addColorStop(1, palette[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const blobGrad = ctx.createRadialGradient(width * 0.2, height * 0.15, 0, width * 0.25, height * 0.25, Math.max(width, height) * 0.6);
    blobGrad.addColorStop(0, palette[1] + 'cc');
    blobGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = blobGrad;
    ctx.fillRect(0, 0, width, height);

    const rectCount = 12 + complexity * 8;
    for (let i = 0; i < rectCount; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.${Math.floor(Math.random() * 6) + 2})`;
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
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    const step = Math.max(32, Math.min(width, height) / 18);
    for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
            ctx.fillRect(x, y, 1.2, 1.2);
        }
    }

    const fontSize = Math.max(18, Math.min(width, height) * 0.08);
    ctx.fillStyle = 'rgba(5, 8, 20, 0.78)';
    const boxHeight = fontSize * 3.2;
    ctx.fillRect(0, (height / 2) - boxHeight / 2, width, boxHeight);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e2e8f0';
    // Use system font stack or imported fonts if available on canvas
    ctx.font = `600 ${fontSize}px "Space Grotesk", sans-serif`;
    ctx.fillText(`${width} × ${height}px`, width / 2, height / 2 - fontSize * 0.4);
    ctx.font = `500 ${Math.max(14, fontSize * 0.55)}px sans-serif`;
    ctx.fillText(`Target ~ ${targetKB} KB`, width / 2, height / 2 + fontSize * 0.65);

    ctx.fillStyle = 'rgba(14, 165, 233, 0.3)';
    ctx.fillRect(24, 24, 180, 44);
    ctx.fillStyle = '#e0f2fe';
    ctx.font = '600 16px "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('devhero image', 36, 50);
};

const tuneQuality = async (canvas: HTMLCanvasElement, format: string, targetBytes: number, startingQuality: number) => {
    let low = 0.25;
    let high = startingQuality;
    let bestBlob = await toBlob(canvas, format, startingQuality);
    let bestQuality = startingQuality;

    for (let i = 0; i < 8; i++) {
        const mid = parseFloat(((low + high) / 2).toFixed(3));
        const candidate = await toBlob(canvas, format, mid);
        if (!candidate) break;

        if (candidate.size > targetBytes) {
            high = mid;
        } else {
            if (targetBytes - candidate.size < targetBytes - bestBlob.size) {
                bestBlob = candidate;
                bestQuality = mid;
            }
            low = mid;
        }
    }

    return { blob: bestBlob, quality: bestQuality };
};

export default function ImagePage() {
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [maxSize, setMaxSize] = useState(500);
    const [format, setFormat] = useState('image/jpeg');
    const [complexity, setComplexity] = useState(3);
    const [quality, setQuality] = useState(90);
    
    const [busy, setBusy] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [stats, setStats] = useState<ImageStats | null>(null);
    const [status, setStatus] = useState('Ready');
    const [statusColor, setStatusColor] = useState('text-emerald-300');

    const handleGenerate = async () => {
        if (busy) return;
        
        // Validation
        if (!width || !height || width <= 0 || height <= 0) {
            setStatus('Enter valid dimension'); setStatusColor('text-rose-300'); return;
        }
        if (width > MAX_DIM || height > MAX_DIM) {
            setStatus('Dimension too large'); setStatusColor('text-rose-300'); return;
        }
        if (width * height > MAX_AREA) {
            setStatus('Area too large'); setStatusColor('text-rose-300'); return;
        }
        if (!maxSize || maxSize < MIN_TARGET_KB) {
             setStatus(`Min target ${MIN_TARGET_KB} KB`); setStatusColor('text-rose-300'); return;
        }

        setBusy(true);
        setStatus('Generating...');
        setStatusColor('text-sky-300');
        
        try {
            const canvas = document.createElement('canvas');
            drawArtwork(canvas, { width, height, complexity, targetKB: maxSize });

            const targetBytes = maxSize * 1024;
            const qualityNormalized = quality / 100;
            const baseBlob = await toBlob(canvas, format, format === 'image/jpeg' ? qualityNormalized : undefined);

            let workingBlob = baseBlob;
            let workingQuality = format === 'image/jpeg' ? qualityNormalized : 1;

            if (format === 'image/jpeg' && workingBlob.size > targetBytes) {
                const tuned = await tuneQuality(canvas, format, targetBytes, qualityNormalized);
                workingBlob = tuned.blob;
                workingQuality = tuned.quality;
            }

            let paddedBytes = 0;
            if (workingBlob.size < targetBytes) {
                const padded = addPadding(workingBlob, targetBytes);
                workingBlob = padded.blob;
                paddedBytes = padded.padding;
            }

            const ext = format === 'image/jpeg' ? 'jpg' : 'png';
            const hitsTarget = workingBlob.size <= targetBytes;

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
                hitsTarget
            });

            setStatus('Done');
            setStatusColor('text-emerald-300');

        } catch (e) {
            setStatus('Error generating');
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
        setPreviewUrl(null);
        setStats(null);
        setStatus('Ready');
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-slate-200 font-sans">
          <header className="glass h-[70px] flex-shrink-0 flex items-center justify-between px-6 shadow-lg relative z-10 border-b border-white/10">
            <div className="flex items-center gap-3">
                <div className="bg-cyan-500 p-2 rounded-lg shadow-cyan-500/20 shadow-lg">
                    <Icons.ImageSquare className="text-white text-xl" weight="fill" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-white tracking-wide">IMAGE <span className="text-cyan-400">HERO</span></h1>
                    <p className="text-xs text-slate-400">Mock Image Generator</p>
                </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-800/60 border border-slate-700 text-slate-200 hover:bg-slate-700 transition">
                    <Icons.House weight="bold" /> Index
                </Link>
                <div className={clsx("flex items-center gap-2", statusColor)}>
                    <span className={clsx("w-2 h-2 rounded-full bg-current", busy && "animate-pulse")}></span>
                    <span>{status}</span>
                </div>
            </div>
          </header>

          <main className="flex flex-1 relative overflow-hidden">
             
             {/* Controls */}
             <div className="w-1/3 min-w-[320px] max-w-sm border-r border-slate-700 flex flex-col bg-[#1e1e1e] p-6 space-y-6 overflow-y-auto">
                <div>
                    <h2 className="text-lg font-bold text-white mb-4">Settings</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-slate-400">Width</label>
                                <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400">Height</label>
                                <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Target Size (KB)</label>
                            <input type="number" value={maxSize} onChange={e => setMaxSize(Number(e.target.value))} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400">Format</label>
                            <select value={format} onChange={e => setFormat(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm">
                                <option value="image/jpeg">JPG (JPEG)</option>
                                <option value="image/png">PNG</option>
                            </select>
                        </div>
                         
                        <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Complexity</span>
                                <span>Lvl {complexity}</span>
                            </div>
                            <input type="range" min="1" max="5" value={complexity} onChange={e => setComplexity(Number(e.target.value))} className="w-full accent-cyan-400" />
                        </div>

                         <div>
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>JPG Quality</span>
                                <span>{quality}%</span>
                            </div>
                            <input type="range" min="40" max="98" value={quality} onChange={e => setQuality(Number(e.target.value))} className="w-full accent-cyan-400" />
                        </div>

                        <div className="pt-2 flex gap-2">
                            <button onClick={handleGenerate} disabled={busy} className="flex-1 bg-sky-500 hover:bg-sky-400 text-slate-900 font-semibold py-2 rounded-lg disabled:opacity-50 transition-colors">
                                {busy ? 'Generating...' : 'Generate'}
                            </button>
                            <button onClick={handleReset} className="px-3 py-2 border border-slate-600 rounded-lg hover:bg-slate-800 transition-colors">
                                <Icons.ArrowClockwise />
                            </button>
                        </div>
                    </div>
                </div>
             </div>

             {/* Preview */}
             <div className="flex-1 bg-[#0f172a] p-8 flex flex-col items-center justify-center relative overflow-y-auto">
                <div className="w-full max-w-2xl space-y-6">
                    <div className="bg-[#1e1e1e] border border-slate-700 rounded-2xl p-2 min-h-[300px] flex items-center justify-center relative shadow-2xl">
                        {previewUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={previewUrl} alt="Preview" className="max-h-[500px] max-w-full object-contain rounded-lg" />
                        ) : (
                            <div className="text-slate-500 flex flex-col items-center">
                                <Icons.ImageSquare size={48} weight="duotone" />
                                <p className="mt-2 text-sm">No preview generated</p>
                            </div>
                        )}
                        {busy && <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl"><div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div></div>}
                    </div>

                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                <p className="text-xs text-slate-400">Actual Size</p>
                                <p className="font-mono text-emerald-300 font-semibold">{formatBytes(stats.finalSize)}</p>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                <p className="text-xs text-slate-400">Target</p>
                                <p className="font-mono text-slate-300 font-semibold">{formatBytes(stats.targetBytes)}</p>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                <p className="text-xs text-slate-400">Padding</p>
                                <p className="font-mono text-sky-300 font-semibold">{formatBytes(stats.paddedBytes)}</p>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center justify-center">
                                <a href={previewUrl!} download={`image-${stats.width}x${stats.height}.${stats.ext}`} className="flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300">
                                    <Icons.DownloadSimple weight="bold" /> Download
                                </a>
                            </div>
                        </div>
                    )}
                </div>
             </div>

          </main>
        </div>
    );
}
