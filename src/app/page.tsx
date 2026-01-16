import { ToolGrid } from '@/components/ToolGrid';
import { Lightning } from '@phosphor-icons/react/dist/ssr';

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-20">
        <div className="glass flex items-center justify-between px-6 py-4 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 grid place-items-center rounded-xl bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 text-white shadow-lg shadow-indigo-500/25">
              <Lightning className="text-xl" weight="bold" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">devtools index</p>
              <h1 className="text-2xl font-bold text-white leading-tight">
                DEV <span className="text-sky-300">HERO</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-300 font-mono">
            <span className="hidden sm:inline">quick launch for your daily build flow</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 relative z-10">
        <ToolGrid />
      </main>
    </>
  );
}
