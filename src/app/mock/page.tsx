'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import * as Icons from '@phosphor-icons/react';
import clsx from 'clsx';
import { DATASETS, DEFAULT_FIELDS, FIELD_LABELS, type Dataset, type Province } from '@/data/mockData';

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface MockRecord {
  firstName: string;
  lastName: string;
  fullName: string;
  nickname: string;
  gender: string;
  dob: string;
  age: number;
  email: string;
  nationalId: string;
  province: string;
  region: string;
  district: string;
  postalCode: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  [key: string]: string | number | undefined;
}

export default function MockPage() {
  const [rowCount, setRowCount] = useState(10);
  const [language, setLanguage] = useState<'th' | 'en'>('th');
  const [selectedFields, setSelectedFields] = useState<string[]>([...DEFAULT_FIELDS]);
  const [jitter, setJitter] = useState(true);
  const [withPhone, setWithPhone] = useState(true);
  const [format, setFormat] = useState<'json' | 'csv'>('json');
  
  const [data, setData] = useState<MockRecord[]>([]);
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState('Ready');
  const [statusColor, setStatusColor] = useState('text-emerald-300');

  // --- Helper Functions ---
  const randInt = useCallback((min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min, []);
  const pick = useCallback(<T,>(arr: T[]): T => arr && arr.length ? arr[Math.floor(Math.random() * arr.length)] : arr[0], []);
  const jitterVal = useCallback(() => (Math.random() * 0.3 - 0.15), []);
  const slugify = useCallback((text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase(), []);

  const buildThaiId = useCallback(() => {
    const digits: number[] = [];
    for (let i = 0; i < 12; i++) digits.push(randInt(0, 9));
    const sum = digits.reduce((acc, digit, idx) => acc + digit * (13 - idx), 0);
    const check = (11 - (sum % 11)) % 10;
    digits.push(check);
    return digits.join('');
  }, [randInt]);

  const buildDOB = useCallback(() => {
    const start = new Date(1985, 0, 1).getTime();
    const end = new Date(2005, 11, 31).getTime();
    const date = new Date(randInt(start, end));
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) age--;
    return { dob: date.toISOString().slice(0, 10), age };
  }, [randInt]);

  const buildPhone = useCallback((dataset: Dataset) => {
    const prefix = pick(dataset.phonePrefixes);
    let digits = '';
    for (let i = 0; i < (dataset.phoneDigits || 8); i++) digits += randInt(0, 9);
    const raw = prefix + digits;
    return dataset.formatPhone ? dataset.formatPhone(raw) : raw;
  }, [pick, randInt]);

  const buildAddress = useCallback((dataset: Dataset, province: Province, district: string) => {
    const houseNo = `${randInt(1, 199)}/${randInt(1, 20)}`;
    const road = pick(dataset.streetNames);
    const soi = pick(dataset.soiNames);
    const postal = String(province.postalBase + randInt(0, 99)).padStart(5, '0');
    return {
        full: dataset.addressTemplate({ houseNo, road, soi, district, provinceName: province.name, postal }),
        postal
    };
  }, [randInt, pick]);

  const buildRecord = useCallback((): MockRecord => {
    const dataset = DATASETS[language];
    const province = pick(dataset.provinces);
    const district = pick(province.districts);
    const address = buildAddress(dataset, province, district);
    const { dob, age } = buildDOB();
    const firstName = pick(dataset.firstNames);
    const lastName = pick(dataset.lastNames);
    const nickname = pick(dataset.nicknames || dataset.firstNames);
    const gender = pick(dataset.genders);
    const baseLat = province.lat + (jitter ? jitterVal() : 0);
    const baseLon = province.lon + (jitter ? jitterVal() : 0);

    const record: MockRecord = {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        nickname,
        gender,
        dob,
        age,
        email: `${slugify(`${firstName}${lastName}`)}@example.com`,
        nationalId: buildThaiId(),
        province: province.name,
        region: province.region,
        district,
        postalCode: address.postal,
        address: address.full,
        latitude: Number(baseLat.toFixed(6)),
        longitude: Number(baseLon.toFixed(6))
    };
    if (withPhone) record.phone = buildPhone(dataset);
    return record;
  }, [language, jitter, withPhone, pick, buildAddress, buildDOB, slugify, jitterVal, buildThaiId, buildPhone]);

  const generateData = useCallback(() => {
    const count = Math.min(Math.max(rowCount, 1), 200);
    const newData = Array.from({ length: count }, buildRecord);
    setData(newData);
    setStatus(`Generated ${count} records`);
    setStatusColor('text-emerald-300');
  }, [rowCount, buildRecord]);

  // Initial generation
  useEffect(() => {
    generateData();
  }, [generateData]);

  // Update output when data or format changes
  useEffect(() => {
    if (!data.length) return;
    
    // Project selected fields
    const projectedData = data.map(row => {
        const obj: Record<string, string | number | undefined> = {};
        selectedFields.forEach(key => {
            if (row[key] !== undefined) obj[key] = row[key];
        });
        return obj;
    });

    if (format === 'json') {
        setOutput(JSON.stringify(projectedData, null, 2));
    } else {
        // CSV
        if (!projectedData.length) {
            setOutput('');
            return;
        }
        const headers = selectedFields;
        const csvRows = projectedData.map(row => headers.map(key => {
            const val = row[key] == null ? '' : String(row[key]);
            const escaped = val.replace(/"/g, '""');
            return `"${escaped}"`;
        }).join(','));
        setOutput([headers.join(','), ...csvRows].join('\n'));
    }
  }, [data, format, selectedFields]);

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setStatus(`Copied ${format.toUpperCase()}!`);
    setStatusColor('text-cyan-300');
    setTimeout(() => {
        setStatus('Ready');
        setStatusColor('text-emerald-300');
    }, 2000);
  };

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
        setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
        setSelectedFields([...selectedFields, field]);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[var(--bg)] text-slate-200 font-sans">
      <header className="glass h-[70px] flex-shrink-0 flex items-center justify-between px-6 shadow-lg relative z-10 border-b border-white/10">
        <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-lg shadow-emerald-500/20 shadow-lg">
                <Icons.Database className="text-white text-xl" weight="fill" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-white tracking-wide">MOCK <span className="text-emerald-400">HERO</span></h1>
                <p className="text-xs text-slate-400">Synthetic Data Generator</p>
            </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
             <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-all"
            >
                <Icons.Copy weight="bold" /> Copy Result
            </button>
            <button 
                onClick={() => generateData()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-all"
            >
                <Icons.ArrowClockwise weight="bold" /> Regenerate
            </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
            <Link href="/" className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-800/60 border border-slate-700 text-slate-200 hover:bg-slate-700 transition">
                <Icons.House weight="bold" /> Index
            </Link>
            <div className={clsx("flex items-center gap-2", statusColor)}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>{status}</span>
            </div>
        </div>
      </header>

      <main className="flex flex-1 relative overflow-hidden">
         {/* Controls */}
         <div className="w-1/3 min-w-[320px] max-w-sm border-r border-slate-700 flex flex-col bg-[#1e1e1e] p-6 space-y-6 overflow-y-auto">
             <div className="space-y-4">
                 <div>
                    <label className="text-xs text-slate-400">Row Count</label>
                    <input 
                        type="number" 
                        min={1} 
                        max={200} 
                        value={rowCount} 
                        onChange={(e) => setRowCount(Number(e.target.value))}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm" 
                    />
                 </div>

                 <div>
                    <label className="text-xs text-slate-400">Language</label>
                    <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value as 'th' | 'en')}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm"
                    >
                        <option value="th">ไทย (Thai)</option>
                        <option value="en">English</option>
                    </select>
                 </div>

                 <div>
                    <label className="text-xs text-slate-400 mb-2 block">Fields</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(FIELD_LABELS[language]).map(key => (
                            <button
                                key={key}
                                onClick={() => toggleField(key)}
                                className={clsx(
                                    "text-xs px-2 py-1.5 rounded-md border text-left truncate transition-colors",
                                    selectedFields.includes(key) 
                                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-200" 
                                        : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600"
                                )}
                            >
                                {FIELD_LABELS[language][key]}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="flex items-center justify-between text-sm text-slate-300">
                        <span>Format</span>
                        <div className="flex bg-slate-800 rounded-lg p-1">
                            {(['json', 'csv'] as const).map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFormat(f)}
                                    className={clsx(
                                        "px-3 py-1 text-xs rounded-md capitalize transition-colors",
                                        format === f ? "bg-slate-600 text-white" : "text-slate-400 hover:text-white"
                                    )}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </label>

                     <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={jitter} onChange={e => setJitter(e.target.checked)} className="rounded border-slate-600 bg-slate-700 text-emerald-400" />
                        <span>Add GPS Jitter</span>
                    </label>

                    <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={withPhone} onChange={e => setWithPhone(e.target.checked)} className="rounded border-slate-600 bg-slate-700 text-emerald-400" />
                        <span>Include Phone</span>
                    </label>
                 </div>
             </div>
         </div>

         {/* Preview / Output */}
             {/* Split View: Table Top, Code Bottom */}
             <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden bg-[#0f172a]">
                 
                 {/* Table Section */}
                 <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden border-b border-slate-700 bg-[#1e1e1e]">
                    <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-slate-400 font-mono uppercase tracking-wider flex justify-between items-center border-b border-[#2d2d2d] shrink-0">
                        <span>Preview Table</span>
                        <span className="text-slate-500">{data.length} rows</span>
                    </div>
                     <div className="flex-1 overflow-x-auto overflow-y-auto bg-[#1e1e1e]">
                         <table className="min-w-full text-left border-collapse table-auto whitespace-nowrap">
                             <thead className="bg-[#18181b] text-slate-400 sticky top-0 z-10 shadow-md">
                                 <tr>
                                     {selectedFields.map(key => (
                                         <th key={key} className="px-6 py-3 text-xs font-semibold tracking-wider uppercase border-b border-slate-700/50 bg-[#18181b]">{FIELD_LABELS[language][key]}</th>
                                     ))}
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-800/50 text-slate-300 text-sm font-mono">
                                 {data.map((row, i) => (
                                     <tr key={i} className="hover:bg-slate-800/40 transition-colors odd:bg-white/[0.02]">
                                         {selectedFields.map(key => (
                                             <td key={key} className="px-6 py-3 border-b border-slate-800/50">{row[key] ?? '-'}</td>
                                         ))}
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 </div>

                 {/* Editor Section */}
                 <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
                     <div className="bg-[#1e1e1e] px-4 py-2 text-xs text-slate-400 font-mono uppercase tracking-wider flex justify-between items-center border-b border-[#2d2d2d] shrink-0">
                         <span>Output ({format.toUpperCase()})</span>
                     </div>
                     <div className="flex-1 relative">
                        <Editor 
                            height="100%" 
                            defaultLanguage="json"
                            language={format === 'json' ? 'json' : 'plaintext'}
                            theme="vs-dark"
                            value={output}
                            options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                fontSize: 13,
                                fontFamily: 'JetBrains Mono',
                                padding: { top: 16 },
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                wordWrap: 'on'
                            }}
                        />
                     </div>
                 </div>
             </div>
      </main>
    </div>
  );
}
