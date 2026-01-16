'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import * as Icons from '@phosphor-icons/react';
import clsx from 'clsx';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function JsonPage() {
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [status, setStatus] = useState<string>('Ready');
  const [statusColor, setStatusColor] = useState('text-emerald-400');
  const [isTyping, setIsTyping] = useState(false);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (value: string | undefined) => {
    const val = value || '';
    setInputCode(val);
    
    // Auto-format debounce
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (!val.trim()) return;

    setIsTyping(true);
    setStatus('Typing...');
    setStatusColor('text-yellow-400');

    debounceTimer.current = setTimeout(() => {
        formatJSON(val, true); // Silent format check
        setIsTyping(false);
    }, 500);
  };

  const formatJSON = (jsonStr: string, isSilent = false) => {
    try {
        if (!jsonStr.trim()) return;
        const parsed = JSON.parse(jsonStr);
        const formatted = JSON.stringify(parsed, null, 4);
        setOutputCode(formatted);
        
        if (!isSilent) {
            setStatus('Valid JSON Formatted');
            setStatusColor('text-emerald-400');
        } else {
             // If silent (auto-type), revert to Ready if valid
             setStatus('Ready');
             setStatusColor('text-emerald-400');
        }
    } catch (e) {
        const error = e as Error;
        if (!isSilent) {
            setStatus(`Invalid JSON: ${error.message}`);
            setStatusColor('text-red-400');
        } else {
            // Keep silent about typing errors until explicit action or user stops
        }
    }
  };

  const beautify = () => formatJSON(inputCode);

  const minify = () => {
    try {
        if (!inputCode.trim()) return;
        const parsed = JSON.parse(inputCode);
        const minified = JSON.stringify(parsed);
        setOutputCode(minified);
        setStatus('JSON Minified');
        setStatusColor('text-blue-400');
    } catch (e) {
        const error = e as Error;
        setStatus(`Invalid JSON: ${error.message}`);
        setStatusColor('text-red-400');
        setOutputCode(`// Error: ${error.message}`);
    }
  };

  const copyOutput = async () => {
    if (!outputCode) return;
    await navigator.clipboard.writeText(outputCode);
    setStatus('Copied to Clipboard!');
    setStatusColor('text-purple-400');
    setTimeout(() => {
        setStatus('Ready');
        setStatusColor('text-emerald-400');
    }, 2000);
  };

  const downloadOutput = () => {
    if (!outputCode || outputCode.trim().startsWith('//')) {
        setStatus('Nothing to download');
        setStatusColor('text-yellow-400');
        return;
    }
    const blob = new Blob([outputCode], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatus('Download started!');
    setStatusColor('text-sky-400');
  };

  const clearAll = () => {
    setInputCode('');
    setOutputCode('');
    setStatus('Cleared');
    setStatusColor('text-slate-400');
  };

  const loadSample = () => {
    const sample = {
        "project": "God-Tier JSON",
        "features": ["Monaco Editor", "Tailwind CSS", "Error Handling"],
        "developer": {
            "name": "You",
            "skills": "Infinite"
        },
        "isActive": true,
        "score": 100
    };
    const str = JSON.stringify(sample);
    setInputCode(str);
    formatJSON(str);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-slate-200 font-sans">
      <header className="glass h-[70px] flex-shrink-0 flex items-center justify-between px-6 shadow-lg relative z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-blue-500/20 shadow-lg">
                <Icons.BracketsCurly className="text-white text-xl" weight="fill" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-white tracking-wide">JSON <span className="text-blue-400">HERO</span></h1>
                <p className="text-xs text-slate-400">Advanced Formatter & Validator</p>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button 
                onClick={beautify}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-all shadow-lg hover:shadow-blue-500/25"
            >
                <Icons.MagicWand weight="bold" /> Beautify
            </button>
            <button 
                onClick={minify}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-all"
            >
                <Icons.ArrowsInLineHorizontal weight="bold" /> Minify
            </button>
            <div className="w-px h-6 bg-slate-600 mx-1"></div>
            <button 
                onClick={copyOutput}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-all"
            >
                <Icons.Copy weight="bold" /> Copy
            </button>
            <button 
                onClick={downloadOutput}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-400 hover:bg-sky-500/10 rounded-md transition-all"
            >
                <Icons.DownloadSimple weight="bold" /> Download
            </button>
            <button 
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-md transition-all"
            >
                <Icons.Trash weight="bold" /> Clear
            </button>
        </div>

        <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 font-mono">
            <Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-800/60 border border-slate-700 text-slate-200 hover:bg-slate-700 transition">
                <Icons.House weight="bold" /> Index
            </Link>
            <span className={clsx("flex items-center gap-1.5 transition-colors", statusColor)}>
                <span className={clsx("w-2 h-2 rounded-full current-color bg-current", isTyping && 'animate-pulse')}></span> {status}
            </span>
        </div>
      </header>

      <main className="flex flex-1 relative overflow-hidden">
        <div className="w-1/2 border-r border-slate-700 flex flex-col relative bg-[#1e1e1e]">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-slate-400 font-mono uppercase tracking-wider flex justify-between items-center border-b border-[#2d2d2d] shrink-0">
                <span>Input (Raw JSON)</span>
                <button onClick={loadSample} className="hover:text-blue-400 transition-colors">Load Sample</button>
            </div>
            <div className="flex-1 relative">
                <Editor 
                    height="100%" 
                    defaultLanguage="json" 
                    theme="vs-dark"
                    value={inputCode}
                    onChange={handleInputChange}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono',
                        padding: { top: 20 },
                        formatOnPaste: true,
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                    }}
                />
            </div>
        </div>

        <div className="w-1/2 flex flex-col bg-[#1e1e1e]">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-slate-400 font-mono uppercase tracking-wider border-b border-[#2d2d2d] shrink-0">
                <span>Output (Formatted)</span>
            </div>
            <div className="flex-1 relative">
                <Editor 
                    height="100%" 
                    defaultLanguage="json" 
                    theme="vs-dark"
                    value={outputCode}
                    options={{
                        readOnly: true,
                        minimap: { enabled: true },
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono',
                        padding: { top: 20 },
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                    }}
                />
            </div>
        </div>
      </main>
    </div>
  );
}
