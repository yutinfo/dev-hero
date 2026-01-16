'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as Icons from '@phosphor-icons/react';
import clsx from 'clsx';

export default function HtmlPage() {
  const [code, setCode] = useState('<h1>Hello World</h1>\n<p>Start typing to see magic happen.</p>');
  const [previewUrl, setPreviewUrl] = useState('');
  const [status, setStatus] = useState('Ready');
  const [statusColor, setStatusColor] = useState('text-emerald-400');

  useEffect(() => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [code]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setStatus('Copied HTML!');
    setStatusColor('text-purple-400');
    setTimeout(() => {
        setStatus('Ready');
        setStatusColor('text-emerald-400');
    }, 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus('Download started!');
    setStatusColor('text-sky-400');
  };

  const openInNewTab = () => {
    const tab = window.open();
    if (tab) {
        tab.document.write(code);
        tab.document.close();
        setStatus('Opened in new tab');
        setStatusColor('text-blue-400');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-slate-200 font-sans">
      <header className="glass h-[70px] flex-shrink-0 flex items-center justify-between px-6 shadow-lg relative z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-indigo-500/20 shadow-lg">
                <Icons.Code className="text-white text-xl" weight="fill" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-white tracking-wide">HTML <span className="text-indigo-400">HERO</span></h1>
                <p className="text-xs text-slate-400">Live Editor & Preview</p>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
             <button 
                onClick={openInNewTab}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md transition-all shadow-lg hover:shadow-indigo-500/25"
            >
                <Icons.ArrowSquareOut weight="bold" /> Open Tab
            </button>
            <div className="w-px h-6 bg-slate-600 mx-1"></div>
            <button 
                onClick={copyCode}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-all"
            >
                <Icons.Copy weight="bold" /> Copy
            </button>
            <button 
                onClick={downloadCode}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-400 hover:bg-sky-500/10 rounded-md transition-all"
            >
                <Icons.DownloadSimple weight="bold" /> Download
            </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-800/60 border border-slate-700 text-slate-200 hover:bg-slate-700 transition">
                <Icons.House weight="bold" /> Index
            </Link>
            <span className={clsx("flex items-center gap-1.5 transition-colors", statusColor)}>
                <span className={clsx("w-2 h-2 rounded-full current-color bg-current", status !== 'Ready' && 'animate-pulse')}></span> {status}
            </span>
        </div>
      </header>

      <main className="flex flex-1 relative overflow-hidden">
        <div className="w-1/2 border-r border-slate-700 flex flex-col relative bg-[#1e1e1e]">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-slate-400 font-mono uppercase tracking-wider flex justify-between items-center border-b border-[#2d2d2d]">
                <span>Source Code</span>
            </div>
             <textarea 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 w-full p-5 font-mono text-sm bg-transparent border-none outline-none resize-none placeholder:text-slate-600 text-slate-300" 
                placeholder="Type HTML here..."
                spellCheck={false}
            />
        </div>

        <div className="w-1/2 flex flex-col bg-white">
             <div className="bg-slate-100 px-4 py-2 text-xs text-slate-500 font-mono uppercase tracking-wider border-b border-slate-200">
                <span>Preview</span>
            </div>
            <iframe 
                src={previewUrl} 
                className="flex-1 w-full border-none bg-white" 
                title="Preview"
            />
        </div>
      </main>
    </div>
  );
}
