import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ShieldCheck, Activity, Terminal as TerminalIcon,
  Maximize2, Cpu, Zap, Lock, Unlock, Waves, 
  BarChart3, Target, Crosshair, AlertCircle
} from "lucide-react";
import { Button } from "./ui/button";

interface InitializeViewProps {
  movie: {
    title: string;
    id: string | number;
    youtubeId?: string;
  };
  onClose: () => void;
}

export default function InitializeView({ movie, onClose }: InitializeViewProps) {
  const [bootSequence, setBootSequence] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const [playbackTime, setPlaybackTime] = useState("00:00:00");
  const videoId = movie.youtubeId; // pure: must be provided by caller

  useEffect(() => {
    const bootLogs = [
      "SYNCHRONIZING_KAIROS_UPLINK...",
      "BYPASSING_DRM_ENCRYPTION_LAYERS...",
      "YT_V3_STREAM_BUFFER_INITIALIZED",
      "NEURAL_LINK: STABLE [98.4%]",
      "DECRYPTING_PRIMARY_FEED...",
      "AUTHORIZATION_COMPLETE"
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < bootLogs.length) {
        setLogs(prev => [...prev, `> ${bootLogs[current]}`]);
        current++;
      } else {
        setTimeout(() => setBootSequence(false), 800);
        clearInterval(interval);
      }
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] bg-[#010101] flex flex-col font-mono text-zinc-100 overflow-hidden"
    >
      {/* GLOBAL HUD OVERLAY (Fixed scanlines and vignette) */}
      <div className="absolute inset-0 pointer-events-none z-[550] bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-[550] opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* TOP STATUS BAR */}
      <header className="relative z-[560] p-4 bg-black/90 border-b border-emerald-500/20 flex justify-between items-center backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-emerald-500 animate-pulse" />
             <div className="flex flex-col">
               <span className="text-[9px] text-emerald-500 font-black tracking-[0.3em]">SECURE_FEED_STABLE</span>
               <span className="text-sm font-Atomic-Age uppercase italic tracking-widest">{movie.title}</span>
             </div>
          </div>
          <div className="h-8 w-[1px] bg-zinc-800" />
          <div className="hidden lg:flex items-center gap-4 text-[10px] text-zinc-500">
             <span className="flex items-center gap-1"><Target size={12}/> LAT: 45° 12' N</span>
             <span className="flex items-center gap-1"><Crosshair size={12}/> LONG: 122° 40' W</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
             <span className="text-[8px] text-zinc-600 uppercase">Archive_ID</span>
             <span className="text-[10px] text-zinc-400">#KRS-{movie.id}-YT</span>
          </div>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="h-10 w-10 p-0 border-zinc-800 hover:bg-red-500 transition-colors"
          >
            <X size={18} />
          </Button>
        </div>
      </header>

      <main className="flex-1 relative flex overflow-hidden">
        
        {/* BOOT / DECRYPTION LAYER */}
        <AnimatePresence>
          {bootSequence && (
            <motion.div 
              exit={{ scale: 1.1, opacity: 0, filter: "brightness(2) blur(10px)" }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 z-[580] bg-black flex flex-col items-center justify-center"
            >
              <div className="w-full max-w-lg p-10 space-y-4">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                   <span className="text-xl font-Atomic-Age italic uppercase tracking-tighter">Initializing_Link</span>
                </div>
                {logs.map((log, i) => (
                  <motion.p 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={i} 
                    className="text-[10px] text-emerald-500/80 tracking-widest"
                  >
                    {log}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LEFT HUD: BIOMETRIC READOUT */}
        <aside className="hidden lg:flex w-20 border-r border-white/5 flex-col items-center py-10 gap-12 bg-black/40">
           <div className="flex flex-col gap-1 items-center">
              <span className="text-[8px] [writing-mode:vertical-lr] text-zinc-600 uppercase tracking-[0.5em]">Neural_Sync</span>
              <div className="h-32 w-1 bg-zinc-900 relative">
                 <motion.div 
                   animate={{ height: ["20%", "80%", "40%"] }} 
                   transition={{ repeat: Infinity, duration: 4 }}
                   className="absolute bottom-0 w-full bg-emerald-500" 
                 />
              </div>
           </div>
           <Activity className="text-emerald-500/30" size={20} />
           <Waves className="text-emerald-500/30" size={20} />
        </aside>

        {/* CENTER: PRIMARY PLAYER CORE */}
        <section className="flex-1 relative bg-black group">
          {videoId ? (
            <iframe
              className="w-full h-full opacity-60 pointer-events-auto"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=0&modestbranding=1&rel=0&iv_load_policy=3`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-red-500">
                <AlertCircle size={48} />
                <div className="text-xl font-black tracking-widest uppercase">No_Video_Uplink_Found</div>
              </div>
            </div>
          )}

           {/* OVER-VIDEO HUD ELEMENTS */}
           <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-red-500 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> LIVE_RECORDING
                    </span>
                    <span className="text-[8px] text-zinc-500 pl-4">ISO_3200 // F.2.8 // 24FPS</span>
                 </div>
                 <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1">
                    <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Uplink_Optimal</span>
                 </div>
              </div>

              {/* CENTER CROSSHAIR */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
                 <div className="w-20 h-20 border border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-[1px] h-4 bg-white" />
                    <div className="w-4 h-[1px] bg-white absolute" />
                 </div>
              </div>
           </div>
        </section>

        {/* RIGHT HUD: ARCHIVE DATA */}
        <aside className="hidden xl:flex w-64 border-l border-white/5 flex-col p-6 gap-8 bg-black/40">
           <div className="space-y-4">
              <span className="text-[9px] text-zinc-500 uppercase flex items-center gap-2">
                 <BarChart3 size={12}/> Visual_Spectrum
              </span>
              <div className="flex gap-1 h-12 items-end">
                 {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [`${Math.random()*100}%`, `${Math.random()*100}%`] }}
                      className="flex-1 bg-emerald-500/20" 
                    />
                 ))}
              </div>
           </div>
           
           <div className="space-y-4">
              <span className="text-[9px] text-zinc-500 uppercase">Stream_Manifest</span>
              <div className="text-[8px] text-zinc-600 space-y-2 leading-tight">
                 <p>HASH: 0x82...F21</p>
                 <p>SOURCE: YT_GDATA_V3</p>
                 <p>CODEC: VP9_LINEAR</p>
                 <p>BUFFER: 4500MS</p>
              </div>
           </div>
        </aside>
      </main>

      {/* FOOTER CONTROLS */}
      <footer className="relative z-[560] p-6 bg-black border-t border-white/5 flex flex-col gap-4">
        <div className="flex items-center gap-6">
           <span className="text-[10px] text-emerald-500 font-bold w-16">LIVE</span>
           <div className="flex-1 h-1.5 bg-zinc-900 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                className="absolute inset-y-0 left-0 bg-emerald-500"
              />
           </div>
           <span className="text-[10px] text-zinc-500">T-MINUS 00:04:12</span>
        </div>

        <div className="flex justify-between items-center">
           <div className="flex gap-2">
              <Button variant="outline" className="h-10 px-4 rounded-none border-zinc-900 bg-zinc-950 text-[10px] uppercase tracking-widest font-black">
                <TerminalIcon size={14} className="mr-2" /> Show_Console
              </Button>
              <Button variant="outline" className="h-10 px-4 rounded-none border-zinc-900 bg-zinc-950 text-[10px] uppercase tracking-widest font-black">
                <Zap size={14} className="mr-2" /> Boost_Buffer
              </Button>
           </div>
           <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                 <span className="text-[8px] text-zinc-600 uppercase">System_Load</span>
                 <span className="text-[10px] text-emerald-500">OPTIMAL_READY</span>
              </div>
              <Maximize2 className="text-zinc-500 hover:text-white cursor-pointer" size={18} />
           </div>
        </div>
      </footer>
    </motion.div>
  );
}