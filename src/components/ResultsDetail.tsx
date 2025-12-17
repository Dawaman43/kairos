import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Terminal, Share2, Download,
  Play, Database, Layers, Info, Scan, Zap, ShieldCheck
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

interface ResultsDetailProps {
  id: string;
}

export default function ResultsDetail({ id }: ResultsDetailProps) {
  const [isDecrypting, setIsDecrypting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsDecrypting(false), 800);
    return () => clearTimeout(timer);
  }, [id]);


  const neuralPath = useMemo(() =>
    Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
    [id]);

  const movie = {
    title: "STALKER",
    year: "1979",
    director: "Andrei Tarkovsky",
    matchScore: 98.4,
    runtime: "162m",
    origin: "Soviet Union",
    synopsis: `Neural Record [REF:${id}]: A guide leads two men into a mysterious "Zone"—a place where the laws of physics are distorted—to find a room that fulfills innermost desires. Analysis detects high levels of existential dread and transcendental visual structure.`,
    tags: ["Transcendental", "Atmospheric", "Philosophical", "Hyper-Stasis"],
    metadata: [
      { key: "Visual_Grain", value: "8mm_Analog" },
      { key: "Chroma_Index", value: "Sepia_Shift" },
      { key: "Audio_Profile", value: "Low_Freq_Drone" },
    ]
  };

  return (
    <div className="relative flex flex-col w-full h-svh bg-[#010101] text-zinc-100 overflow-hidden font-mono text-[11px] selection:bg-emerald-500 selection:text-black">

      <AnimatePresence>
        {isDecrypting && (
          <motion.div
            exit={{ opacity: 0, x: 20 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center border-l-4 border-emerald-500"
          >
            <div className="flex flex-col gap-2 w-64">
              <span className="text-[10px] text-emerald-500 tracking-[0.5em] animate-pulse font-bold">DECRYPTING_RECORD_{id}</span>
              <div className="h-1 w-full bg-zinc-900 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="relative z-30 flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button onClick={() => window.history.back()} className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-all">
            <div className="p-1 border border-zinc-800 group-hover:border-zinc-500 group-hover:bg-white group-hover:text-black transition-all">
              <ChevronLeft size={14} />
            </div>
            <span className="uppercase tracking-[0.3em] text-[9px] font-bold">Close_Dossier</span>
          </button>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div className="flex items-center gap-3">
            <Terminal size={12} className="text-emerald-500" />
            <span className="uppercase tracking-[0.2em] text-[9px] text-zinc-400">Secure_Path: //ROOT/INF_RESULT_{id}</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end leading-none gap-1">
            <span className="text-[8px] text-zinc-600">ENCRYPTION_STATUS</span>
            <span className="text-emerald-500 text-[9px] flex items-center gap-1 font-bold">
              <ShieldCheck size={10} /> VERIFIED_LEVEL_A
            </span>
          </div>
          <div className="flex gap-1">
            <Button variant="outline" className="h-8 w-8 p-0 border-zinc-900 rounded-none hover:bg-zinc-800 transition-colors"><Share2 size={12} /></Button>
            <Button variant="outline" className="h-8 w-8 p-0 border-zinc-900 rounded-none hover:bg-zinc-800 transition-colors"><Download size={12} /></Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex">


        <section className="w-1/2 relative border-r border-white/5 bg-[#030303]">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
            <div className="w-full aspect-video bg-zinc-950 border border-white/5 relative group overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />


              <motion.div
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1px] bg-white/10 z-10 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/40">
                <Scan className="text-white/10" size={80} />
              </div>


              <div className="absolute top-4 left-4 flex flex-col gap-1 text-[8px] text-white/40">
                <span>RECON_TYPE: SPECTRAL</span>
                <span>COORD_LAT: 56.43</span>
                <span>COORD_LNG: 12.01</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end bg-black/60 backdrop-blur-md p-4 border-t border-white/10 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                <div className="space-y-1">
                  <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Capture_Ref: {id}</span>
                  <h4 className="text-xs font-bold tracking-[0.2em] font-Atomic-Age">RECONSTRUCTION_ARRAY</h4>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-[8px] border-white/20 rounded-none hover:bg-white hover:text-black">
                  EXPAND_VIEW
                </Button>
              </div>
            </div>


            <div className="mt-12 w-full h-24 flex flex-col gap-2">
              <span className="text-[8px] text-zinc-600 tracking-widest uppercase">Neural_Frequency_Signal</span>
              <svg className="w-full h-full border border-white/5 bg-zinc-950/50" viewBox="0 0 400 100">
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1"
                  points={neuralPath.map((y, x) => `${(x * 40)},${y}`).join(' ')}
                  className="opacity-50"
                />
              </svg>
            </div>
          </div>


          <div className="absolute bottom-6 left-10 pointer-events-none">
            <h1 className="text-[12rem] font-Atomic-Age leading-none text-white/[0.02] select-none uppercase tracking-tighter">
              {id.slice(0, 4)}
            </h1>
          </div>
        </section>

        <section className="w-1/2 flex flex-col bg-black">
          <ScrollArea className="flex-1">
            <div className="p-16 space-y-12 max-w-2xl mx-auto">

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500" />
                  <span className="text-zinc-600 tracking-[0.4em] uppercase text-[9px]">Dossier_Status: Active</span>
                </div>

                <h1 className="text-8xl font-Atomic-Age italic tracking-tighter uppercase leading-[0.85] text-white">
                  {movie.title}
                </h1>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase">Director</span>
                    <span className="text-lg text-zinc-200 tracking-tight font-light">{movie.director}</span>
                  </div>
                  <div className="w-[1px] h-8 bg-zinc-900" />
                  <div className="flex flex-col">
                    <span className="text-[8px] text-zinc-600 uppercase">Archive_Date</span>
                    <span className="text-lg text-zinc-200 tracking-tight font-light">{movie.year}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {movie.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[8px] border-zinc-900 text-zinc-500 rounded-none px-3 py-1 uppercase tracking-widest hover:border-zinc-500 hover:text-white transition-colors">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>


              <div className="space-y-4">
                <span className="text-[9px] text-zinc-600 uppercase tracking-widest flex items-center gap-2">
                  <Info size={10} /> Technical_Metadata
                </span>
                <div className="grid grid-cols-3 gap-px bg-zinc-900 border border-zinc-900">
                  {movie.metadata.map(item => (
                    <div key={item.key} className="bg-black p-4 group hover:bg-zinc-950 transition-colors">
                      <span className="text-[7px] text-zinc-700 uppercase block mb-1">{item.key}</span>
                      <span className="text-[10px] text-zinc-300 font-bold tracking-tight">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 p-6 border border-zinc-900 bg-zinc-950/20 relative">
                <Database size={14} className="text-zinc-800 absolute top-4 right-4" />
                <span className="text-[9px] text-zinc-600 uppercase tracking-[0.3em] block">Subject_Narrative_Analysis</span>
                <p className="text-sm leading-relaxed text-zinc-400 font-sans tracking-wide">
                  {movie.synopsis}
                </p>
              </div>

              <div className="pt-8 space-y-4">
                <Button className="w-full bg-white text-black hover:bg-zinc-200 h-16 rounded-none font-Atomic-Age tracking-[0.4em] text-xl italic uppercase group overflow-hidden relative">
                  <span className="relative z-10 flex items-center justify-center gap-4">
                    <Play size={20} className="fill-current" /> INITIATE_PLAYBACK
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  />
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="border-zinc-900 rounded-none h-12 text-[9px] tracking-[0.3em] uppercase hover:bg-zinc-900">
                    <Zap size={14} className="mr-2" /> Sync_Pulse
                  </Button>
                  <Button variant="outline" className="border-zinc-900 rounded-none h-12 text-[9px] tracking-[0.3em] uppercase hover:bg-zinc-900">
                    <Layers size={14} className="mr-2" /> View_Layers
                  </Button>
                </div>
              </div>

            </div>
          </ScrollArea>
        </section>
      </main>


      <footer className="relative z-30 flex justify-between items-center px-6 py-3 border-t border-white/5 bg-black text-[8px] text-zinc-700 tracking-[0.4em] uppercase font-bold">
        <div className="flex gap-12">
          <span className="flex items-center gap-2">LOAD_BAL: OPTIMAL</span>
          <span className="flex items-center gap-2">ARCHIVE_VER: RT_X92</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-emerald-900 animate-pulse">STREAMING_CORE_DATA_{id}</span>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-3 bg-zinc-900" />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
