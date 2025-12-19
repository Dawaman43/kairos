import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { allMoods } from "../data/movies";
import { useQueryClient } from '@tanstack/react-query'
import { discoverMoviesByEmotion } from '../services/tmdb'
import {
  Cpu, Activity, Command, Hash, Terminal, Layers, BarChart3, History as TimerHistory
} from "lucide-react";
import { AudioEngine } from "../lib/audio";

export default function BeginPage() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeModule, setActiveModule] = useState<'input' | 'moods' | 'telemetry'>('input');
  const [moodHistory, setMoodHistory] = useState<string[][]>([]);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    setMounted(true);
    const history = localStorage.getItem('kairos_mood_history');
    if (history) setMoodHistory(JSON.parse(history));
  }, []);

  const bars = useMemo(() => Array.from({ length: 25 }, () => Math.random()), []);

  const handleGenerate = async () => {
    if (selectedEmotions.length === 0 && freeText.length < 3) {
      AudioEngine.playError();
      return;
    }

    AudioEngine.playSuccess();
    setIsSyncing(true);
    const textEmotions = freeText.split(',').map((s: string) => s.trim().toLowerCase()).filter((s: string) => s.length > 0);
    const allEmotions = [...new Set([...selectedEmotions, ...textEmotions])];
    localStorage.setItem('selectedEmotions', JSON.stringify(allEmotions));


    const newHistory = [allEmotions, ...moodHistory.filter((h: string[]) => JSON.stringify(h) !== JSON.stringify(allEmotions))].slice(0, 5);
    setMoodHistory(newHistory);
    localStorage.setItem('kairos_mood_history', JSON.stringify(newHistory));

    try {
      await queryClient.prefetchQuery({
        queryKey: ['movies', allEmotions],
        queryFn: () => discoverMoviesByEmotion(allEmotions)
      });
    } catch (e) { console.warn(e); }
    setTimeout(() => navigate({ to: "/results" }), 1500);
  };

  if (!mounted) return null;

  return (
    <div className="relative flex flex-col w-full h-svh bg-[#020202] text-zinc-100 overflow-hidden font-mono selection:bg-emerald-500/30">

      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%] opacity-5" />

      <motion.div
        animate={{ top: ["-100%", "200%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-1 bg-emerald-500/10 blur-sm z-[5] pointer-events-none"
      />

      <header className="relative z-50 flex justify-between items-center px-4 md:px-8 py-3 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-1 bg-emerald-500/10 border border-emerald-500/40">
            <Command size={14} className="text-emerald-500" />
          </div>
          <h1 className="font-bold text-xs md:text-sm tracking-[0.4em] text-white uppercase">KAIROS_V1</h1>
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[7px] text-zinc-500 uppercase tracking-widest">Neural_Sync</span>
            <span className="text-[9px] text-emerald-500 flex items-center gap-1">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" /> ACTIVE
            </span>
          </div>
          <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
          <span className="text-[9px] text-zinc-400 font-bold uppercase">{new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      <main className="flex-1 relative z-10 flex flex-col lg:flex-row overflow-hidden">

        <section className={`
          absolute lg:relative inset-0 lg:inset-auto z-40 lg:z-10
          w-full lg:w-[320px] xl:w-[380px] bg-black border-r border-white/5
          flex flex-col transition-all duration-500 ease-in-out
          ${activeModule === 'moods' ? 'translate-y-0 opacity-100' : 'translate-y-full lg:translate-y-0 opacity-0 lg:opacity-100'}
        `}>
          <div className="p-4 border-b border-white/5 bg-zinc-950/50 flex justify-between items-center">
            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <Hash size={12} /> Emotion_Memory_Grid
            </span>
            <Button variant="ghost" className="lg:hidden h-8 text-[9px]" onClick={() => setActiveModule('input')}>CLOSE_SCAN</Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 lg:grid-cols-1 gap-1.5 scrollbar-hide">
            {allMoods.map((tag: string) => (
              <button
                key={tag}
                onClick={() => {
                  AudioEngine.playHover();
                  setSelectedEmotions((prev: string[]) => prev.includes(tag) ? prev.filter((t: string) => t !== tag) : [...prev, tag]);
                }}
                className={`group flex items-center justify-between px-3 py-3 border text-[10px] uppercase font-bold tracking-tighter transition-all ${selectedEmotions.includes(tag)
                  ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-transparent border-white/5 text-zinc-500 hover:border-emerald-500/50'
                  }`}
              >
                <span>{tag}</span>
                <div className={`w-1 h-1 rounded-full ${selectedEmotions.includes(tag) ? 'bg-black' : 'bg-zinc-800'}`} />
              </button>
            ))}
          </div>
        </section>

        <section className="flex-1 flex flex-col p-4 md:p-8 relative bg-black/40">
          <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full gap-6">

            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[8px] text-zinc-600 uppercase tracking-[0.4em]">Node_Status</span>
                <div className="flex items-center gap-2 text-[10px] text-white uppercase font-bold tracking-widest">
                  <Terminal size={12} className="text-emerald-500" /> Free_Text_Override
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <span className="text-[8px] text-zinc-600 uppercase tracking-[0.4em]">System_Integrity</span>
                <div className="text-[10px] text-emerald-900 font-black tracking-widest uppercase">Stable</div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-0.5 bg-emerald-500/20 opacity-0 group-focus-within:opacity-100 blur transition duration-500" />
              <div className="relative bg-zinc-950 border border-white/10 group-focus-within:border-emerald-500/50 transition-all">
                <Textarea
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder="INPUT_NEURAL_STIMULUS..."
                  className="w-full h-48 md:h-64 bg-transparent border-none text-xl md:text-3xl text-white placeholder:text-zinc-900 font-light tracking-tight resize-none focus-visible:ring-0 p-6 md:p-8"
                />
                <div className="absolute bottom-4 left-6 flex items-center gap-3">
                  <div className="flex gap-[2px]">
                    {bars.map((v, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: freeText.length > 0 ? v * 20 : 2 }}
                        className="w-0.5 bg-emerald-500/40"
                      />
                    ))}
                  </div>
                  <span className="text-[7px] text-zinc-700 uppercase">Input_Visualizer_V1.0</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={selectedEmotions.length === 0 && freeText.length < 3}
              className="w-full h-16 md:h-20 bg-white text-black hover:bg-emerald-500 hover:text-black rounded-none font-black text-xs md:text-sm tracking-[0.6em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.05)] disabled:opacity-5"
            >
              EXECUTE_EXTRACTION
            </Button>
          </div>
        </section>

        <section className={`
          absolute lg:relative inset-0 lg:inset-auto z-40 lg:z-10
          w-full lg:w-[280px] bg-black border-l border-white/5
          flex flex-col transition-all duration-500 ease-in-out
          ${activeModule === 'telemetry' ? 'translate-y-0 opacity-100' : 'translate-y-full lg:translate-y-0 opacity-0 lg:opacity-100'}
        `}>
          <div className="p-4 border-b border-white/5 bg-zinc-950/50 flex justify-between items-center">
            <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-2">
              <BarChart3 size={12} /> System_Telemetry
            </span>
            <Button variant="ghost" className="lg:hidden h-8 text-[9px]" onClick={() => setActiveModule('input')}>CLOSE_DATA</Button>
          </div>
          <div className="p-6 space-y-10">
            <div className="space-y-4">
              <span className="text-[8px] text-zinc-600 block uppercase tracking-widest">Active_Emotion_Vector</span>
              <div className="flex flex-wrap gap-1.5">
                {[...selectedEmotions, ...(freeText ? ['STIMULUS_DETECTED'] : [])].map((tag: string, i: number) => (
                  <span key={i} className="text-[8px] border border-emerald-500/30 px-2 py-1 text-emerald-400 bg-emerald-500/5 uppercase tracking-widest animate-in fade-in zoom-in">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {moodHistory.length > 0 && (
              <div className="space-y-4">
                <span className="text-[8px] text-zinc-600 block uppercase tracking-widest flex items-center gap-2">
                  <TimerHistory size={10} /> Sync_History
                </span>
                <div className="space-y-2">
                  {moodHistory.map((h: string[], i: number) => (
                    <button
                      key={i}
                      onClick={() => { AudioEngine.playClick(); setSelectedEmotions(h); }}
                      className="w-full text-left p-2 border border-white/5 hover:border-emerald-500/30 bg-zinc-950/50 transition-colors group"
                    >
                      <div className="text-[7px] text-zinc-500 group-hover:text-emerald-500 transition-colors uppercase">Legacy_Link_{i}</div>
                      <div className="text-[9px] text-zinc-400 truncate uppercase tracking-tighter">{h.join(' + ')}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between text-[8px] text-zinc-600 uppercase">
                <span>Signal_Density</span>
                <span>{Math.min(selectedEmotions.length * 20 + freeText.length, 100)}%</span>
              </div>
              <div className="h-[2px] w-full bg-zinc-900 overflow-hidden">
                <motion.div
                  animate={{ width: `${Math.min(selectedEmotions.length * 20 + freeText.length, 100)}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>

            <div className="p-4 border border-zinc-900 bg-zinc-950/50 flex flex-col items-center justify-center gap-4 py-8">
              <div className="relative">
                <Activity size={32} className="text-emerald-900" />
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0"
                >
                  <Activity size={32} className="text-emerald-500" />
                </motion.div>
              </div>
              <span className="text-[7px] text-zinc-600 uppercase text-center leading-relaxed">
                Subject_Response_Analysis:<br />
                PENDING_EXTRACTION
              </span>
            </div>
          </div>
        </section>
      </main>

      <nav className="lg:hidden relative z-[60] grid grid-cols-3 bg-black border-t border-white/10 h-16">
        <button
          onClick={() => setActiveModule('moods')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeModule === 'moods' ? 'text-emerald-500 bg-emerald-500/5' : 'text-zinc-500'}`}
        >
          <Layers size={18} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Moods</span>
        </button>
        <button
          onClick={() => setActiveModule('input')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeModule === 'input' ? 'text-emerald-500 bg-emerald-500/5' : 'text-zinc-500'}`}
        >
          <Terminal size={18} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Input</span>
        </button>
        <button
          onClick={() => setActiveModule('telemetry')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${activeModule === 'telemetry' ? 'text-emerald-500 bg-emerald-500/5' : 'text-zinc-500'}`}
        >
          <BarChart3 size={18} />
          <span className="text-[8px] font-bold uppercase tracking-widest">Data</span>
        </button>
      </nav>

      {/* SYNCING STATE */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 gap-6"
          >
            <Cpu size={48} className="text-emerald-500 animate-spin-slow" />
            <div className="flex flex-col items-center gap-2">
              <span className="text-white font-black text-xl tracking-[0.5em] uppercase">Processing</span>
              <span className="text-emerald-950 font-bold text-[9px] tracking-[0.3em] uppercase animate-pulse">Establishing_Neural_Link</span>
            </div>
            <div className="w-full max-w-xs h-0.5 bg-zinc-900 relative overflow-hidden">
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="absolute inset-0 w-1/2 bg-emerald-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}