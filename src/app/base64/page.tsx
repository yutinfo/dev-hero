'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import * as Icons from '@phosphor-icons/react';
import clsx from 'clsx';

export default function Base64Page() {
  const [text, setText] = useState('');
  const [base64, setBase64] = useState('');
  const [status, setStatus] = useState<string>('Ready');
  const [statusColor, setStatusColor] = useState('text-emerald-400');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const isUpdating = useRef(false);

  // Core Functions (Unicode Safe)
  function safeEncode(str: string) {
    try {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
              return String.fromCharCode(parseInt('0x' + p1));
      }));
    } catch {
      return '';
    }
  }

  function safeDecode(base64Str: string) {
    try {
      return decodeURIComponent(atob(base64Str).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch {
      return null; // Return null on failure
    }
  }

  function normalizeBase64(input: string) {
    const trimmed = (input || '').trim();
    if (!trimmed) return { raw: '', isDataUri: false, mime: '' };
    
    // Check for Data URI format
    const match = trimmed.match(/^data:([^;]+);base64,(.*)$/i);
    if (match) {
        return { raw: match[2].replace(/\s/g, ''), isDataUri: true, mime: match[1] };
    }
    return { raw: trimmed.replace(/\s/g, ''), isDataUri: false, mime: '' };
  }

  const handleTextChange = (val: string) => {
    if (isUpdating.current) return;
    isUpdating.current = true;
    
    setText(val);
    if (val) {
      setBase64(safeEncode(val));
      setStatus('Encoded to Base64');
      setStatusColor('text-sky-400');
    } else {
      setBase64('');
      setImagePreview(null);
      setStatus('Ready');
      setStatusColor('text-emerald-400');
    }
    
    isUpdating.current = false;
  };

  const handleBase64Change = (val: string) => {
    if (isUpdating.current) return;
    isUpdating.current = true;
    
    setBase64(val);
    
    const { raw, isDataUri, mime } = normalizeBase64(val);
    
    if (!raw) {
        setImagePreview(null);
        setText('');
        setStatus('Ready');
        setStatusColor('text-emerald-400');
        isUpdating.current = false;
        return;
    }

    if (isDataUri && mime.startsWith('image/')) {
        setImagePreview(val.trim());
        setStatus('Image Preview');
        setStatusColor('text-teal-400');
        // We still try to decode the valid raw part if possible, 
        // though typically image binary decoded to text is garbage.
        // The original code didn't update text input if image specific?
        // Let's check original logic: "showImagePreview... textInput.classList.add('hidden')"
        // We will just clear text or show decoded binary if needed, but original hid text.
        setText(''); 
    } else {
        setImagePreview(null);
        const decoded = safeDecode(raw);
        if (decoded !== null) {
          setText(decoded);
          setStatus('Decoded to Text');
          setStatusColor('text-emerald-400');
        } else {
          setText(''); // Failed to decode
          setStatus('Invalid Base64 String');
          setStatusColor('text-red-400');
        }
    }

    isUpdating.current = false;
  };

  const copyToClipboard = async (content: string, type: string) => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setStatus(`Copied ${type} to Clipboard!`);
    setStatusColor('text-purple-400');
    setTimeout(() => {
        setStatus('Ready');
        setStatusColor('text-emerald-400');
    }, 2000);
  };

  const clearAll = () => {
    isUpdating.current = true;
    setText('');
    setBase64('');
    setImagePreview(null);
    setStatus('Cleared');
    setStatusColor('text-slate-400');
    isUpdating.current = false;
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-slate-200 font-sans">
      <header className="glass h-[70px] flex-shrink-0 flex items-center justify-between px-6 shadow-lg relative z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-lg shadow-purple-500/20 shadow-lg">
                <Icons.TextAa className="text-white text-xl" weight="fill" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-white tracking-wide">BASE64 <span className="text-purple-400">HERO</span></h1>
                <p className="text-xs text-slate-400">Real-time Encoder & Decoder</p>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button 
                onClick={() => copyToClipboard(text, 'Text')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-400 hover:bg-sky-500/10 rounded-md transition-all"
            >
                <Icons.Copy weight="bold" /> Copy Text
            </button>
            <button 
                onClick={() => copyToClipboard(base64, 'Base64')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-all"
            >
                <Icons.CopySimple weight="bold" /> Copy Base64
            </button>
            <div className="w-px h-6 bg-slate-600 mx-1"></div>
            <button 
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-md transition-all"
            >
                <Icons.Trash weight="bold" /> Clear
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
        <div className="w-1/2 border-r border-slate-700 flex flex-col relative bg-[#0f172a]">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-slate-400 font-mono uppercase tracking-wider flex justify-between items-center border-b border-[#2d2d2d]">
                <span>Plain Text</span>
            </div>
            
            {imagePreview ? (
                <div className="absolute inset-0 top-[33px] flex items-center justify-center bg-[#1e1e1e] p-5 z-20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Base64 Preview" className="max-w-full max-h-full object-contain" />
                </div>
            ) : (
                <textarea 
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="flex-1 w-full p-5 font-mono text-sm bg-transparent border-none outline-none resize-none placeholder:text-slate-600 text-slate-300" 
                    placeholder="Type or paste your text here..."
                    spellCheck={false}
                />
            )}
        </div>

        <div className="w-1/2 flex flex-col bg-[#0f172a]">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-slate-400 font-mono uppercase tracking-wider border-b border-[#2d2d2d]">
                <span>Base64</span>
            </div>
            <textarea 
                value={base64}
                onChange={(e) => handleBase64Change(e.target.value)}
                className="flex-1 w-full p-5 font-mono text-sm bg-transparent border-none outline-none resize-none placeholder:text-slate-600 text-slate-300" 
                placeholder="Type or paste your Base64 here..."
                spellCheck={false}
            />
        </div>
      </main>
    </div>
  );
}
