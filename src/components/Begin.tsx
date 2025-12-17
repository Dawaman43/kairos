import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { TooltipProvider } from "./ui/tooltip";

export default function BeginPage() {
  const [moodText, setMoodText] = useState("");
  const [intensity, setIntensity] = useState([50]);
  const [mounted, setMounted] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => setMounted(true), []);

  const bars = useMemo(() => Array.from({ length: 40 }, () => Math.random()), []);

  const handleGenerate = async () => {
    setIsSyncing(true);
    setTimeout(() => {
      navigate({ to: "/results" });
    }, 1200);
  };

  if (!mounted) return null;

  return (
    <TooltipProvider>
      <div className="relative flex flex-col w-full h-svh bg-[#010101] text-zinc-100 overflow-hidden font-mono selection:bg-zinc-100 selection:text-black">

        <AnimatePresence>
          {isSyncing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, delay: i * 0.1 }}
                      className="w-2 h-2 bg-white"
                    />
                  ))}
                </div>
                <span className="text-[10px] tracking-[0.5em] text-white">SYNCING_CORE</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>

        <header className="relative z-20 flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/50">
          <div className="flex items-center gap-4">
            <h1 className="font-Atomic-Age text-lg tracking-widest">KAiROS</h1>
            <span className="text-[9px] text-zinc-600 border border-zinc-800 px-2 py-0.5">V.01_SYS</span>
          </div>
          <div className="flex gap-6 text-[9px] text-zinc-500 uppercase tracking-widest">
            <span>Lat: 37.7749°</span>
            <span>Lng: -122.4194°</span>
            <span className="text-emerald-500 animate-pulse">● Signal_Stable</span>
          </div>
        </header>

        <main className="flex-1 relative z-10 grid grid-cols-12 h-full overflow-hidden">


          <aside className="col-span-3 border-r border-white/5 p-6 space-y-8 bg-zinc-950/20">
            <div className="space-y-4">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest">01_Intensity</span>
              <div className="px-2">
                <div className="flex justify-between mb-4">
                  <span className="text-[14px] text-white font-Atomic-Age italic">{intensity}%</span>
                  <span className="text-[8px] text-zinc-700 uppercase self-end">Level_Cap</span>
                </div>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={100}
                  className="[&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:rounded-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest">02_Presets</span>
              <div className="grid grid-cols-1 gap-1">
                {['SOLITUDE', 'EUPHORIA', 'DYSTOPIA', 'NOSTALGIA'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setMoodText(tag)}
                    className="text-left text-[10px] p-2 border border-zinc-900 hover:border-zinc-500 hover:bg-zinc-100 hover:text-black transition-all duration-300 uppercase tracking-tighter"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button
                disabled={moodText.length < 3}
                onClick={handleGenerate}
                className="w-full h-10 text-[9px] tracking-[0.3em] bg-zinc-100 text-black hover:bg-white rounded-none disabled:opacity-10"
              >
                EXECUTE_SYNC
              </Button>
            </div>
          </aside>

          <section className="col-span-6 p-8 flex flex-col relative bg-black/40">
            <div className="mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-zinc-100 rounded-full" />
              <span className="text-[9px] text-zinc-400 tracking-[0.3em] uppercase">The_Emotional_Void</span>
            </div>

            <Textarea
              value={moodText}
              onChange={(e) => setMoodText(e.target.value)}
              placeholder="INPUT_THOUGHTS_PROMPT_..."
              className="flex-1 bg-transparent border-none text-zinc-200 text-lg md:text-xl tracking-wide resize-none focus-visible:ring-0 placeholder:text-zinc-900 p-0 leading-relaxed scrollbar-hide"
            />

            <div className="h-6 flex items-end gap-[1px] mt-4 opacity-40">
              {bars.map((v, i) => (
                <motion.div
                  key={i}
                  animate={{ height: moodText.length > 0 ? [`${v * 100}%`, `${(1 - v) * 100}%`] : "4px" }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.02 }}
                  className="flex-1 bg-zinc-500"
                />
              ))}
            </div>
          </section>

          <aside className="col-span-3 border-l border-white/5 p-6 flex flex-col justify-between bg-zinc-950/20">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[8px] text-zinc-600 block">ENCRYPTION_KEY</span>
                <div className="text-[10px] text-zinc-400 break-all border border-zinc-900 p-2 leading-tight">
                  SHA-256: 4f1a2b...{moodText.length > 0 ? "8x9z0L" : "------"}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[8px] text-zinc-600 block">MEMORY_CONSUMPTION</span>
                <div className="h-1 w-full bg-zinc-900 overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min(moodText.length * 2, 100)}%` }}
                    className="h-full bg-white"
                  />
                </div>
              </div>
            </div>

            <Button
              disabled={moodText.length < 3}
              onClick={handleGenerate}
              variant="outline"
              className="w-full h-16 border-zinc-800 text-[10px] tracking-[0.4em] font-Atomic-Age rounded-none hover:bg-zinc-900 disabled:opacity-5"
            >
              GENERATE_CINEMA
            </Button>
          </aside>
        </main>

        <footer className="relative z-20 flex justify-between items-center px-6 py-3 border-t border-white/5 bg-black/50 text-[8px] text-zinc-700 tracking-[0.2em] uppercase">
          <div className="flex gap-8">
            <span>Packet_ID: #892-X</span>
            <span>Entropy: 0.9412</span>
          </div>
          <div className="flex gap-4">
            <span className={moodText.length > 5 ? "text-emerald-900" : ""}>READY_FOR_INJECTION</span>
            <span>© 2025 KAIROS</span>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}
