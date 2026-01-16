'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import * as Icons from '@phosphor-icons/react';
import clsx from 'clsx';

const VOCAB = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'a', 'ac', 'aliquam', 'aliquet', 'ante', 'aptent', 'arcu', 'at', 'auctor', 'augue', 'bibendum', 'blandit', 'class', 'commodo', 'condimentum', 'congue', 'consequat', 'conubia', 'convallis', 'cras', 'cubilia', 'curabitur', 'curae', 'dapibus', 'diam', 'dictum', 'dictumst', 'dignissim', 'dis', 'donec', 'dui', 'duis', 'efficitur', 'egestas', 'eget', 'eleifend', 'elementum', 'enim', 'erat', 'eros', 'est', 'et', 'etiam', 'eu', 'euismod', 'ex', 'facilisi', 'facilisis', 'fames', 'faucibus', 'felis', 'fermentum', 'feugiat', 'finibus', 'fringilla', 'fusce', 'gravida', 'habitant', 'habitasse', 'hac', 'hendrerit', 'himenaeos', 'iaculis', 'id', 'imperdiet', 'in', 'inceptos', 'integer', 'interdum', 'justo', 'lacinia', 'lacus', 'laoreet', 'lectus', 'leo', 'libero', 'ligula', 'litora', 'lobortis', 'luctus', 'maecenas', 'magna', 'magnis', 'malesuada', 'massa', 'mattis', 'mauris', 'maximus', 'metus', 'mi', 'mollis', 'mollit', 'montes', 'morbi', 'mus', 'nam', 'nascetur', 'natoque', 'nec', 'neque', 'netus', 'nibh', 'nisi', 'nisl', 'non', 'nostra', 'nulla', 'nullam', 'nunc', 'odio', 'orci', 'ornare', 'parturient', 'pede', 'pellentesque', 'penatibus', 'per', 'pharetra', 'phasellus', 'placerat', 'platea', 'porta', 'porttitor', 'posuere', 'potenti', 'praesent', 'pretium', 'primis', 'proin', 'pulvinar', 'purus', 'quam', 'quis', 'quisque', 'rhoncus', 'ridiculus', 'risus', 'rutrum', 'sagittis', 'sapien', 'scelerisque', 'sed', 'sem', 'semper', 'senectus', 'sociosqu', 'sodales', 'sollicitudin', 'suscipit', 'suspendisse', 'taciti', 'tellus', 'tempor', 'tempus', 'tincidunt', 'torquent', 'tortor', 'tristique', 'turpis', 'ullamcorper', 'ultrices', 'ultricies', 'urna', 'ut', 'varius', 'vehicula', 'vel', 'velit', 'venenatis', 'vestibulum', 'vitae', 'vivamus', 'viverra', 'volutpat', 'vulputate'];
const LOREM_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function LoremPage() {
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState('0 Words');
  const [status, setStatus] = useState('Ready');
  const [statusColor, setStatusColor] = useState('text-emerald-400');
  
  // Config State
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [amount, setAmount] = useState(5);
  const [wrapPTags, setWrapPTags] = useState(false);
  const [startWithLorem, setStartWithLorem] = useState(true);

  // Logic
  const generate = useCallback(() => {
    const getWords = (count: number) => Array.from({ length: count }, () => VOCAB[random(0, VOCAB.length - 1)]).join(' ');
    const getSentence = () => capitalize(getWords(random(8, 15))) + '.';
    const getSentences = (count: number) => Array.from({ length: count }, getSentence).join(' ');
    const getParagraph = () => Array.from({ length: random(4, 8) }, getSentence).join(' ');

    let result = '';
    
    switch (type) {
        case 'paragraphs': {
            const paragraphs: string[] = [];
            let count = amount;
            if (startWithLorem) {
                paragraphs.push(LOREM_START + ' ' + getParagraph().slice(LOREM_START.length));
                count--;
            }
            for (let i = 0; i < count; i++) {
                paragraphs.push(getParagraph());
            }
            if (wrapPTags) {
                result = paragraphs.map(p => `<p>${p}</p>`).join('\n\n');
            } else {
                result = paragraphs.join('\n\n');
            }
            break;
        }
        case 'sentences': {
            const sentences: string[] = startWithLorem ? [LOREM_START] : [];
            const sentencesNeeded = startWithLorem ? amount - 1 : amount;
            if (sentencesNeeded > 0) {
                sentences.push(getSentences(sentencesNeeded));
            }
            result = sentences.join(' ');
            break;
        }
        case 'words': {
            result = getWords(amount);
            break;
        }
    }
    
    setOutput(result);
    const wordCount = result.trim().length === 0 ? 0 : result.trim().split(/\s+/).length;
    setStats(`${wordCount} Words`);
    setStatus('Generated!');
    setStatusColor('text-amber-400');
    setTimeout(() => {
         setStatus('Ready');
         setStatusColor('text-emerald-400');
    }, 1500);
  }, [type, amount, wrapPTags, startWithLorem]);

  // Generate on load and config change
  useEffect(() => {
    generate();
  }, [generate]);

  const copyToClipboard = async (copyHtml = false) => {
    let content = output;
    if (!content) return;

    if (!copyHtml && wrapPTags && type === 'paragraphs') {
        // Strip HTML if copying clean text but tags are visible
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        content = tempDiv.textContent || tempDiv.innerText || "";
    }

    await navigator.clipboard.writeText(content);
    setStatus(`Copied ${copyHtml ? 'HTML' : 'TEXT'}!`);
    setStatusColor('text-purple-400');
    setTimeout(() => {
        setStatus('Ready');
        setStatusColor('text-emerald-400');
    }, 2000);
  };

  const clearAll = () => {
    setAmount(5);
    setWrapPTags(false);
    setStartWithLorem(true);
    setType('paragraphs');
    // Generate will trigger via effect, or we can force empty?
    // User expects clear, but usually "lorem generator" regenerates or resets. 
    // Original cleared output. But useEffect handles state change. 
    // We will let effect run, but if we want truly empty we'd need another state.
    // Let's reset to defaults which generates default lorem.
    setStatus('Reset');
    setStatusColor('text-slate-400');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-slate-200 font-sans">
      <header className="glass h-[70px] flex-shrink-0 flex items-center justify-between px-6 shadow-lg relative z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg shadow-amber-500/20 shadow-lg">
                <Icons.TextT className="text-white text-xl" weight="fill" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-white tracking-wide">LOREM <span className="text-amber-400">HERO</span></h1>
                <p className="text-xs text-slate-400">Real-time Text Generator</p>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            <button 
                onClick={() => copyToClipboard(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sky-400 hover:bg-sky-500/10 rounded-md transition-all"
            >
                <Icons.Copy weight="bold" /> Copy Text
            </button>
            <button 
                onClick={() => copyToClipboard(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 rounded-md transition-all"
            >
                <Icons.Code weight="bold" /> Copy HTML
            </button>
            <div className="w-px h-6 bg-slate-600 mx-1"></div>
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
                <span className={clsx("w-2 h-2 rounded-full current-color bg-current", status !== 'Ready' && 'animate-pulse')}></span> {status}
            </span>
        </div>
      </header>

      <main className="flex flex-1 relative overflow-hidden">
        {/* Controls */}
        <div className="w-1/3 max-w-sm border-r border-slate-700 flex flex-col bg-[#1e1e1e] p-6 space-y-6 overflow-y-auto">
            <h2 className="text-lg font-bold text-white">Controls</h2>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Type</label>
                <div className="flex gap-2">
                    {['paragraphs', 'sentences', 'words'].map((t) => (
                        <button 
                            key={t}
                            onClick={() => setType(t as 'paragraphs' | 'sentences' | 'words')}
                            className={clsx(
                                "flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all border border-slate-700",
                                type === t ? "bg-amber-500 text-white border-amber-500" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            )}
                        >
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Amount</label>
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min={1} 
                    max={100} 
                    className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-center font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none text-white"
                />
            </div>

            <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-300">Options</label>
                
                <div className={clsx("flex items-center justify-between transition-opacity", type !== 'paragraphs' && "opacity-50 pointer-events-none")}>
                    <span className="text-slate-400 text-sm">Wrap with &lt;p&gt; tags</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={wrapPTags} onChange={(e) => setWrapPTags(e.target.checked)} className="sr-only peer" disabled={type !== 'paragraphs'} />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Start with &quot;Lorem...&quot;</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                </div>
            </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e]">
            <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-slate-400 font-mono uppercase tracking-wider flex justify-between items-center border-b border-[#2d2d2d] shrink-0">
                <span>Generated Output</span>
                <span>{stats}</span>
            </div>
            <textarea 
                value={output}
                readOnly
                className="flex-1 w-full p-5 font-mono text-sm leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-slate-600 text-slate-300"
                placeholder="Generated text will appear here..."
            />
        </div>
      </main>
    </div>
  );
}
