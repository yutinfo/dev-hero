'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import * as Icons from '@phosphor-icons/react';
import clsx from 'clsx';

export default function JWTPage() {
    const [token, setToken] = useState('');
    const [header, setHeader] = useState<string | null>(null);
    const [payload, setPayload] = useState<string | null>(null);
    const [signature, setSignature] = useState<string | null>(null);
    const [status, setStatus] = useState('Ready');
    const [statusColor, setStatusColor] = useState('text-emerald-400');
    const [error, setError] = useState<string | null>(null);

    const base64UrlDecode = (str: string) => {
        try {
            // Replace Base64Url characters to standard Base64
            const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
            // Decode with Unicode support
            return decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        } catch {
            return null;
        }
    };

    const decodeJWT = useCallback((jwt: string) => {
        setError(null);
        if (!jwt.trim()) {
            setHeader(null);
            setPayload(null);
            setSignature(null);
            setStatus('Ready');
            setStatusColor('text-emerald-400');
            return;
        }

        const segments = jwt.split('.');
        if (segments.length !== 3) {
            setError('Invalid JWT structure. A JWT must have 3 segments separated by dots.');
            setStatus('Invalid Format');
            setStatusColor('text-red-400');
            return;
        }

        const decodedHeader = base64UrlDecode(segments[0]);
        const decodedPayload = base64UrlDecode(segments[1]);
        const signaturePart = segments[2];

        if (decodedHeader === null || decodedPayload === null) {
            setError('Failed to decode JWT segments. Ensure the token is valid Base64Url.');
            setStatus('Decode Error');
            setStatusColor('text-red-400');
            return;
        }

        try {
            const parsedHeader = JSON.parse(decodedHeader);
            const parsedPayload = JSON.parse(decodedPayload);
            
            setHeader(JSON.stringify(parsedHeader, null, 4));
            setPayload(JSON.stringify(parsedPayload, null, 4));
            setSignature(signaturePart);
            
            setStatus('Decoded Successfully');
            setStatusColor('text-emerald-400');
        } catch {
            setError('Content is not valid JSON.');
            setStatus('JSON Error');
            setStatusColor('text-red-400');
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            decodeJWT(token);
        }, 300);
        return () => clearTimeout(timer);
    }, [token, decodeJWT]);

    const handleCopy = async (content: string, type: string) => {
        if (!content) return;
        await navigator.clipboard.writeText(content);
        const oldStatus = status;
        const oldColor = statusColor;
        setStatus(`Copied ${type}!`);
        setStatusColor('text-cyan-400');
        setTimeout(() => {
            setStatus(oldStatus);
            setStatusColor(oldColor);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-slate-200 font-sans">
            <header className="glass h-[70px] flex-shrink-0 flex items-center justify-between px-6 shadow-lg relative z-10 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="bg-purple-500 p-2 rounded-lg shadow-purple-500/20 shadow-lg">
                        <Icons.Key className="text-white text-xl" weight="fill" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-wide">JWT <span className="text-purple-400">HERO</span></h1>
                        <p className="text-xs text-slate-400">Secure JWT Decoder & Inspector</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-800/60 border border-slate-700 text-slate-200 hover:bg-slate-700 transition">
                        <Icons.House weight="bold" /> Index
                    </Link>
                    <div className={clsx("flex items-center gap-2 font-semibold", statusColor)}>
                        <div className={clsx("w-2 h-2 rounded-full bg-current shadow-[0_0_8px_currentColor]")}></div>
                        <span>{status.toUpperCase()}</span>
                    </div>
                </div>
            </header>

            <main className="flex flex-1 overflow-hidden">
                {/* Input Section */}
                <div className="w-1/2 border-r border-white/10 flex flex-col bg-slate-900/10">
                    <div className="px-6 py-4 border-b border-white/5 bg-slate-800/20 flex items-center justify-between shrink-0">
                        <span className="text-sm font-bold text-slate-400 tracking-widest uppercase">Encoded Token</span>
                        <button 
                            onClick={() => setToken('')}
                            className="text-xs text-slate-500 hover:text-white transition-colors flex items-center gap-1"
                        >
                            <Icons.Trash /> Clear
                        </button>
                    </div>
                    <div className="flex-1 p-6 flex flex-col space-y-4 overflow-hidden">
                        <textarea
                            className="flex-1 w-full bg-slate-800/40 border border-white/10 rounded-xl p-6 text-sm font-mono text-purple-300 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none overflow-y-auto"
                            placeholder="Paste your JWT here..."
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <Icons.WarningCircle className="text-red-400 mt-0.5 shrink-0" weight="fill" />
                                <span className="text-xs text-red-300 font-medium leading-relaxed">{error}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Output Section */}
                <div className="w-1/2 flex flex-col bg-slate-900/20">
                    <div className="px-6 py-4 border-b border-white/5 bg-slate-800/20 shrink-0">
                        <span className="text-sm font-bold text-slate-400 tracking-widest uppercase">Decoded Result</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Header */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-red-400/80 uppercase tracking-tighter">Header</span>
                                <button 
                                    onClick={() => handleCopy(header || '', 'Header')}
                                    className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded transition-all"
                                >
                                    <Icons.Copy weight="bold" size={14} />
                                </button>
                            </div>
                            <pre className="p-4 bg-slate-900/50 border border-white/5 rounded-xl text-xs font-mono text-red-300/90 leading-relaxed overflow-x-auto">
                                {header || '// Your JWT Header will appear here'}
                            </pre>
                        </div>

                        {/* Payload */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-purple-400/80 uppercase tracking-tighter">Payload</span>
                                <button 
                                    onClick={() => handleCopy(payload || '', 'Payload')}
                                    className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded transition-all"
                                >
                                    <Icons.Copy weight="bold" size={14} />
                                </button>
                            </div>
                            <pre className="p-4 bg-slate-900/50 border border-white/5 rounded-xl text-xs font-mono text-purple-200/90 leading-relaxed overflow-x-auto min-h-[100px]">
                                {payload || '// Your JWT Payload will appear here'}
                            </pre>
                        </div>

                        {/* Signature */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-sky-400/80 uppercase tracking-tighter">Signature</span>
                                <button 
                                    onClick={() => handleCopy(signature || '', 'Signature')}
                                    className="p-1.5 text-slate-500 hover:text-white hover:bg-white/5 rounded transition-all"
                                >
                                    <Icons.Copy weight="bold" size={14} />
                                </button>
                            </div>
                            <div className="p-4 bg-slate-900/50 border border-white/5 rounded-xl text-xs font-mono text-sky-200/80 leading-relaxed break-all">
                                {signature || '// Your JWT Signature will appear here'}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
