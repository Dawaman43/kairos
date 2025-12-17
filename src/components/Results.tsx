import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  ChevronLeft,
  Dna,
  Settings2,
  ShieldAlert,
  Radio,
  Eye,
  Binary,
  Cpu,
  Badge
} from "lucide-react";

const MOVIE_DATABASE = [
  { id: 1, title: "STALKER", year: "1979", match: 98.4, tags: ["Philosophical", "Zone"], freq: [0.4, 0.8, 0.2, 0.9], status: "STABLE" },
  { id: 2, title: "BLADE RUNNER", year: "1982", match: 94.1, tags: ["Cyberpunk", "Noir"], freq: [0.9, 0.2, 0.7, 0.5], status: "DECRYPTED" },
  { id: 3, title: "MELANCHOLIA", year: "2011", match: 89.8, tags: ["Cosmic", "Grand"], freq: [0.3, 0.4, 0.9, 0.2], status: "STABLE" },
  { id: 4, title: "ARRIVAL", year: "2016", match: 87.2, tags: ["Linguistic", "Time"], freq: [0.6, 0.6, 0.6, 0.9], status: "STABLE" },
  { id: 5, title: "THE LOBSTER", year: "2015", match: 82.5, tags: ["Absurdist", "Satire"], freq: [0.2, 0.9, 0.4, 0.4], status: "STABLE" },
  { id: 6, title: "PRIMER", year: "2004", match: 78.9, tags: ["Complex", "Indie"], freq: [1.0, 0.1, 0.8, 0.3], status: "CACHED" },
];

export default function ResultsPage() {
  const [hoveredId, setHoveredId] = useState<number | null>(1);
  const [mounted, setMounted] = useState(false);
  const [log, setLog] = useState<string[]>(["Initializing Neural Interface...", "Fetching Void Data..."]);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      const logs = ["Syncing...", "Adjusting Frequency...", "Reading Pulse...", "Tracing Vectors..."];
      setLog(prev => [logs[Math.floor(Math.random() * logs.length)], ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const activeMovie = useMemo(() =>
    MOVIE_DATABASE.find(m => m.id === hoveredId) || MOVIE_DATABASE[0],
    [hoveredId]
  );

  if (!mounted) return null;

  return (
    <div className="relative flex flex-col w-full h-svh bg-[#010101] text-zinc-100 overflow-hidden font-mono text-[11px]">

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:30px_30px] [transform:perspective(500px)_rotateX(60deg)_translateY(-100px)] opacity-30 origin-top" />
      </div>

      <header className="relative z-30 flex justify-between items-center px-4 py-3 border-b border-white/10 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.history.back()}>
            <div className="w-6 h-6 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-500 transition-colors">
              <ChevronLeft size={12} />
            </div>
            <h1 className="font-Atomic-Age text-sm tracking-[0.2em]">KAIROS_LABS</h1>
          </div>

          <div className="hidden md:flex gap-6 text-zinc-600 tracking-widest uppercase text-[9px]">
            <span className="flex items-center gap-2"><Radio size={10} className="text-emerald-500" /> Stream: 144.2 mbps</span>
            <span className="flex items-center gap-2"><Settings2 size={10} /> Latency: 4ms</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right leading-none">
            <div className="text-zinc-500 text-[8px]">ENCRYPTION_LAYER</div>
            <div className="text-white text-[10px] tracking-tighter">AES_256_ACTIVE</div>
          </div>
          <div className="w-8 h-8 bg-white flex items-center justify-center">
            <Eye size={16} className="text-black" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative z-10">

        <section className="w-80 border-r border-white/10 flex flex-col bg-black/40 backdrop-blur-sm">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <span className="tracking-[0.3em] font-bold text-zinc-400">LOG_STREAM</span>
            <Binary size={12} className="text-zinc-800" />
          </div>

          <div className="h-28 p-4 overflow-hidden border-b border-white/10 flex flex-col-reverse gap-1">
            <AnimatePresence mode="popLayout">
              {log.map((l, i) => (
                <motion.div
                  key={l + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[8px] text-zinc-600 font-mono"
                >
                  {`> ${l}`}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y divide-white/5">
              {MOVIE_DATABASE.map((movie) => (
                <motion.div
                  key={movie.id}
                  onMouseEnter={() => setHoveredId(movie.id)}
                  className={`p-5 cursor-pointer transition-all duration-300 relative ${hoveredId === movie.id ? 'bg-white text-black' : 'hover:bg-white/5 text-zinc-400'
                    }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] opacity-60">ID: {movie.id * 1234}</span>
                    <span className={`text-[8px] font-bold ${hoveredId === movie.id ? 'text-black' : 'text-emerald-500'}`}>
                      {movie.match}%
                    </span>
                  </div>
                  <h3 className="text-sm font-Atomic-Age uppercase tracking-tight">{movie.title}</h3>
                  {hoveredId === movie.id && (
                    <motion.div layoutId="activeBar" className="absolute left-0 top-0 bottom-0 w-1 bg-black" />
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </section>


        <section className="flex-1 flex flex-col bg-zinc-950/10">

          <div className="flex-1 flex items-center justify-center relative group">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-[400px] h-[400px] border border-white rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-[500px] h-[500px] border border-zinc-800 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
            </div>

            <div className="flex gap-4 items-end h-64 relative z-10">
              {activeMovie.freq.map((f, i) => (
                <motion.div
                  key={i}
                  animate={{ height: `${f * 100}%` }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="w-16 bg-gradient-to-t from-white to-transparent opacity-80 relative"
                >
                  <div className="absolute -top-6 left-0 right-0 text-center text-[8px] text-zinc-500">
                    VAL_{i + 1}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="h-64 border-t border-white/10 bg-black/80 p-8 flex gap-12 relative overflow-hidden">

            <div className="absolute right-[-20px] bottom-[-40px] text-[15rem] font-Atomic-Age text-white/[0.03] select-none pointer-events-none">
              0{activeMovie.id}
            </div>

            <div className="w-40 aspect-square border border-white/20 flex flex-col items-center justify-center relative group overflow-hidden">
              <Dna size={40} className="text-zinc-500 group-hover:text-white transition-colors" />
              <span className="mt-4 text-[7px] tracking-[0.5em] text-zinc-700 uppercase">Neural_Scan</span>
              <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute left-0 right-0 h-[1px] bg-emerald-500/50"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-emerald-900/30 text-emerald-500 border-emerald-500/50 rounded-none text-[8px] h-4">
                    {activeMovie.status}
                  </Badge>
                  <span className="text-zinc-600 text-[10px] tracking-widest uppercase">{activeMovie.year} ARCHIVE</span>
                </div>
                <h2 className="text-5xl font-Atomic-Age tracking-tighter italic uppercase">{activeMovie.title}</h2>
                <div className="flex gap-2 mt-4">
                  {activeMovie.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 border border-zinc-800 text-zinc-500 text-[8px] uppercase tracking-widest">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-white text-black hover:bg-zinc-200 rounded-none h-10 font-bold tracking-[0.3em]">
                  OPEN_SESSION
                </Button>
                <Button variant="outline" className="w-12 h-10 border-zinc-800 rounded-none p-0 hover:bg-zinc-900">
                  <Cpu size={14} />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <aside className="w-12 border-l border-white/10 flex flex-col items-center py-6 gap-8 text-zinc-700">
          <div className="rotate-90 origin-center whitespace-nowrap text-[8px] tracking-[1em] font-bold">
            SYS_CONST_v9.2
          </div>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-full ${i === activeMovie.id - 1 ? 'bg-white' : 'bg-zinc-800'}`} />
            ))}
          </div>
          <ShieldAlert size={14} />
        </aside>
      </main>

      <footer className="relative z-30 px-4 py-2 border-t border-white/10 bg-black flex justify-between items-center text-[8px] text-zinc-600 tracking-[0.4em] uppercase">
        <div className="flex gap-10">
          <span className="flex items-center gap-2 italic">Seed: 0x921FA...02</span>
          <span>Buffer_Health: 100%</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="animate-pulse">System_Live</span>
          <div className="h-2 w-20 bg-zinc-900 relative">
            <motion.div
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="h-full bg-zinc-700"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
