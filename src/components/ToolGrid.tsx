'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ImageSquare, 
  TextT, 
  Database, 
  Code, 
  TextAa, 
  BracketsCurly, 
  MagnifyingGlass, 
  ArrowUpRight,
  Key,
  type IconProps
} from '@phosphor-icons/react';
import { tools } from '@/data/tools';
import clsx from 'clsx';

type IconComponent = React.ComponentType<IconProps>;

const iconMap: Record<string, IconComponent> = {
  ImageSquare,
  TextT,
  Database,
  Code,
  TextAa,
  BracketsCurly,
  Key
};

export function ToolGrid() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTools = tools.filter((tool) => {
    const query = searchTerm.toLowerCase();
    return (
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <section className="glass rounded-2xl p-6 md:p-8 card mb-8">
        <div className="accent-ring rounded-2xl"></div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">launchpad</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white">Tools crafted for shipping faster.</h2>
            <p className="text-slate-300 leading-relaxed">
              Everything lives under one roof. Jump straight into a hero, or search to find exactly what you need.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
              <span className="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700">fast launch</span>
              <span className="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700">no sign-in</span>
              <span className="px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700">keyboard friendly</span>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <label className="relative block group">
              <input
                id="search"
                type="search"
                placeholder="Search heroes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-72 lg:w-80 rounded-xl bg-slate-900/80 border border-slate-700 px-4 py-3 pl-11 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 transition-all outline-none"
              />
              <MagnifyingGlass className="text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-sky-300 text-lg" weight="bold" />
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => {
          const IconComponent = iconMap[tool.icon];
          return (
            <Link
              key={tool.id}
              href={tool.href}
              className="group card glass rounded-2xl border border-slate-800/70 p-5 flex flex-col gap-4 transition-transform duration-300 min-h-[220px] hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={clsx(
                      "h-11 w-11 rounded-xl bg-gradient-to-br text-slate-900 grid place-items-center shadow-lg shadow-slate-900/30",
                      tool.accent
                    )}
                  >
                    {IconComponent && <IconComponent className="text-lg" weight="bold" />}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">hero tool</p>
                    <h3 className="text-xl font-semibold text-white">{tool.name}</h3>
                  </div>
                </div>
                <ArrowUpRight className="text-slate-400 group-hover:text-white" weight="bold" />
              </div>
              <p className="text-slate-300 leading-relaxed flex-1">{tool.description}</p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-400">
                {tool.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-800">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          );
        })}
      </section>
      
      <div className="mt-6 text-center text-slate-500 text-sm">
        {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''} found
      </div>
    </>
  );
}
