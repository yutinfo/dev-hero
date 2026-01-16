'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Icons from '@phosphor-icons/react';
import clsx from 'clsx';
import CryptoJS from 'crypto-js';

export default function HashPage() {
  const [input, setInput] = useState('');
  const [hmacMode, setHmacMode] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [status, setStatus] = useState('Ready');
  const [statusColor, setStatusColor] = useState('text-emerald-300');

  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });

  useEffect(() => {
    if (!input) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      return;
    }

    if (hmacMode && secretKey) {
      setHashes({
        md5: CryptoJS.HmacMD5(input, secretKey).toString(),
        sha1: CryptoJS.HmacSHA1(input, secretKey).toString(),
        sha256: CryptoJS.HmacSHA256(input, secretKey).toString(),
        sha512: CryptoJS.HmacSHA512(input, secretKey).toString()
      });
    } else {
      setHashes({
        md5: CryptoJS.MD5(input).toString(),
        sha1: CryptoJS.SHA1(input).toString(),
        sha256: CryptoJS.SHA256(input).toString(),
        sha512: CryptoJS.SHA512(input).toString()
      });
    }
  }, [input, hmacMode, secretKey]);

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

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-slate-200 font-sans">
      <header className="glass h-[70px] flex-shrink-0 flex items-center justify-between px-6 shadow-lg relative z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
            <div className="bg-rose-500 p-2 rounded-lg shadow-rose-500/20 shadow-lg">
                <Icons.Fingerprint className="text-white text-xl" weight="fill" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-white tracking-wide uppercase font-jetbrains">HASH <span className="text-rose-400">HERO</span></h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Client-side Secure Hashing</p>
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

      <main className="flex-1 overflow-y-auto p-6 lg:p-12 bg-[#0d0a15]">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Input */}
            <section className="lg:col-span-5 space-y-6">
              <div className="card glass p-6 border-slate-800/50 h-full flex flex-col">
                <h2 className="text-sm font-black text-white mb-6 flex items-center gap-2 uppercase tracking-widest opacity-80">
                  <Icons.TextAa weight="fill" className="text-rose-400" />
                  Source Text
                </h2>

                <div className="flex-1 space-y-6 flex flex-col">
                  <div className="flex-1 relative group min-h-[200px]">
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full h-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all resize-none leading-relaxed" 
                      placeholder="Enter text to hash..."
                    />
                  </div>

                  {/* HMAC Controls */}
                  <div className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 space-y-4">
                     <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer group">
                             <div className={clsx(
                                 "w-10 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out relative",
                                 hmacMode ? "bg-rose-500" : "bg-slate-700"
                             )}>
                                 <div className={clsx(
                                     "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300",
                                     hmacMode ? "translate-x-4" : "translate-x-0"
                                 )} />
                             </div>
                             <input type="checkbox" className="hidden" checked={hmacMode} onChange={e => setHmacMode(e.target.checked)} />
                             <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">Enable HMAC</span>
                        </label>
                     </div>

                     <div className={clsx(
                         "transition-all duration-500 ease-in-out overflow-hidden",
                         hmacMode ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                     )}>
                         <div className="relative">
                            <Icons.Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" weight="bold" />
                            <input 
                                type="text" 
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-lg py-2.5 pl-10 pr-4 text-sm text-rose-300 font-mono focus:border-rose-500 outline-none placeholder:text-slate-600"
                                placeholder="Enter secret key..."
                            />
                         </div>
                     </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Right Column: Hashes */}
            <section className="lg:col-span-7 space-y-4">
               {/* MD5 */}
               <HashCard 
                 algo="MD5" 
                 hash={hashes.md5} 
                 color="text-amber-400" 
                 bg="bg-amber-500/10" 
                 border="border-amber-500/20"
                 onCopy={() => copyToClipboard(hashes.md5)}
               />

               {/* SHA-1 */}
               <HashCard 
                 algo="SHA-1" 
                 hash={hashes.sha1} 
                 color="text-sky-400" 
                 bg="bg-sky-500/10" 
                 border="border-sky-500/20"
                 onCopy={() => copyToClipboard(hashes.sha1)} 
               />

               {/* SHA-256 */}
               <HashCard 
                 algo="SHA-256" 
                 hash={hashes.sha256} 
                 color="text-emerald-400" 
                 bg="bg-emerald-500/10" 
                 border="border-emerald-500/20"
                 onCopy={() => copyToClipboard(hashes.sha256)} 
               />

               {/* SHA-512 */}
               <HashCard 
                 algo="SHA-512" 
                 hash={hashes.sha512} 
                 color="text-violet-400" 
                 bg="bg-violet-500/10" 
                 border="border-violet-500/20"
                 onCopy={() => copyToClipboard(hashes.sha512)} 
               />
            </section>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest opacity-60">
             <Icons.ShieldCheck weight="fill" />
             <span>Secure Client-Side Hashing • Your data never leaves this browser</span>
          </div>

        </div>
      </main>
    </div>
  );
}

function HashCard({ algo, hash, color, bg, border, onCopy }: { algo: string, hash: string, color: string, bg: string, border: string, onCopy: () => void }) {
    return (
        <div className={clsx("card glass p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all hover:bg-white/[0.02]", border)}>
            <div className={clsx("p-3 rounded-xl shrink-0", bg)}>
                <Icons.Hash weight="bold" className={clsx("text-lg", color)} />
            </div>
            <div className="flex-1 min-w-0 w-full">
                <div className="flex items-center justify-between mb-1">
                    <span className={clsx("text-[10px] font-black uppercase tracking-widest", color)}>{algo}</span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase hidden sm:block">
                        {hash ? `${hash.length * 4} bits` : 'Ready'}
                    </span>
                </div>
                <div className="font-mono text-sm text-slate-300 break-all leading-tight">
                    {hash || <span className="text-slate-600 italic opacity-50">Waiting for input...</span>}
                </div>
            </div>
            <button 
                onClick={onCopy}
                disabled={!hash}
                className="shrink-0 p-2 text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
                title="Copy Hash"
            >
                <Icons.Copy weight="bold" size={20} />
            </button>
        </div>
    );
}
