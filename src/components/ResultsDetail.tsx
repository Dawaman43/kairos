import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, Terminal, Share2, Download,
  Play, Layers, Info, Scan, Zap,
  Activity, Cpu, Eye,
  Network, Workflow, Fingerprint, Bookmark, AlertTriangle, Send, X
} from "lucide-react";
import { AudioEngine } from "../lib/audio";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import InitializeView from './InitializeView';
import { fetchMovieData } from '../services/movieApi';

interface ResultsDetailProps {
  movieId: string | number;
}

export default function ResultsDetail({ movieId }: ResultsDetailProps) {
  const [movie, setMovie] = useState<any>(null);
  const [isDecrypting, setIsDecrypting] = useState(true);
  const [showInitView, setShowInitView] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'structure'>('overview');
  const [statusMsg, setStatusMsg] = useState("ESTABLISHING_UPLINK");
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);


  useEffect(() => {
    let mounted = true;
    setIsDecrypting(true);
    (async () => {
      try {
        const data = await fetchMovieData(movieId as any);
        if (!mounted) return;
        setMovie(data);
        setTimeout(() => {
          setIsDecrypting(false);
          setStatusMsg("UPLINK_SECURE // ID_VERIFIED");
        }, 1200);
      } catch (e) {
        if (!mounted) return;
        setMovie(null);
        setIsDecrypting(false);
      }
    })();
    const storedWatchlist = localStorage.getItem('kairos_watchlist');
    if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));

    return () => { mounted = false };
  }, [movieId]);

  useEffect(() => {
    localStorage.setItem('kairos_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const handleAction = useCallback((type: string) => {
    AudioEngine.playClick();
    setStatusMsg(`EXECUTING_PROTOCOL: ${type}...`);
    setTimeout(() => setStatusMsg("SYSTEM_IDLE // AWAITING_INPUT"), 2000);

    if (type === 'DOWNLOAD') {
      AudioEngine.playSuccess();
      const reportDate = new Date().toLocaleString();
      const reportMarkdown = `
# KAIROS_OS // INTELLIGENCE_REPORT
## TARGET_ID: ${movieId}
## TARGET_NAME: ${movie?.title || "UNKNOWN"}
## TIMESTAMP: ${reportDate}

---

### [BRIEFING]
**SYNOPSIS**: ${movie?.overview || "No synopsis available in secure logs."}
**METRICS**:
- Pacing: ${Math.floor(Math.random() * 20) + 80}%
- Atmosphere: ${Math.floor(Math.random() * 20) + 80}%
- Decryption_Level: HIGH

### [NARRATIVE_STRUCTURE]
The subject exhibits a complex multi-layered narrative architecture with primary focus on ${movie?.genres?.[0] || 'Drama'} and secondary nodes of ${movie?.genres?.[1] || 'Romance'}. 

### [LEGAL]
This data is for KAIROS authorized personnel only. Unauthorized distribution is a breach of Protocol 9.

---
// END_OF_LOG
      `;
      const element = document.createElement("a");
      const file = new Blob([reportMarkdown], { type: 'text/markdown' });
      element.href = URL.createObjectURL(file);
      element.download = `INTELLIGENCE_REPORT_${movieId}.md`;
      document.body.appendChild(element);
      element.click();
    }

    if (type === 'SHARE') {
      AudioEngine.playSuccess();
      navigator.clipboard.writeText(window.location.href);
    }

    if (type === 'WATCHLIST') {
      setWatchlist(prev => prev.includes(Number(movieId)) ? prev.filter(i => i !== Number(movieId)) : [...prev, Number(movieId)]);
    }
  }, [movie, movieId, watchlist]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showInitView) return;
      switch (e.key.toLowerCase()) {
        case 'escape': AudioEngine.playClick(); window.history.back(); break;
        case ' ':
        case 'enter': AudioEngine.playSuccess(); setShowInitView(true); break;
        case '1': AudioEngine.playHover(); setActiveTab('overview'); break;
        case '2': AudioEngine.playHover(); setActiveTab('metrics'); break;
        case '3': AudioEngine.playHover(); setActiveTab('structure'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showInitView]);

  return (
    <div className="relative flex flex-col w-full min-h-svh lg:h-svh bg-[#030303] text-zinc-100 lg:overflow-hidden font-mono text-[11px] selection:bg-emerald-500/30">

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.05),transparent_40%)]" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 z-50 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,4px_100%]" />
      </div>

      <AnimatePresence>
        {isDecrypting && (
          <motion.div
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse" />
              <Cpu className="text-emerald-500 relative z-10" size={48} />
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-emerald-500 text-[10px] tracking-[0.6em] uppercase font-bold animate-pulse">
                Decrypting_Secure_Stream
              </span>
              <div className="w-64 h-1 bg-emerald-900/30 mt-4 overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
            <div className="absolute bottom-12 font-mono text-[9px] text-zinc-600 flex flex-col items-center gap-1">
              <span>HANDSHAKE_INIT... OK</span>
              <span>CIPHER_GLYPH... OK</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      <header className="relative z-30 flex justify-between items-center px-6 py-4 border-b border-white/5 bg-black/80 backdrop-blur-md">
        <button
          onClick={() => window.history.back()}
          className="group flex items-center gap-3 text-zinc-500 hover:text-emerald-400 transition-colors"
        >
          <div className="p-1 border border-white/10 group-hover:border-emerald-500/50 rounded-sm transition-colors">
            <ChevronLeft size={14} />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Abort Mission</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end px-4 border-r border-white/10">
            <span className="text-[7px] text-zinc-600 uppercase tracking-widest">Current Protocol</span>
            <span className="text-emerald-500 text-[9px] font-bold tracking-wider">{statusMsg}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleAction('WATCHLIST')} variant="ghost" className={`h-8 w-8 transition-colors ${watchlist.includes(Number(movieId)) ? 'text-emerald-400 bg-emerald-500/10' : 'text-zinc-500 hover:text-emerald-400'}`}>
              <Bookmark size={14} fill={watchlist.includes(Number(movieId)) ? "currentColor" : "none"} />
            </Button>
            <Button onClick={() => { AudioEngine.playClick(); setReportModalOpen(true); }} variant="ghost" className="h-8 w-8 text-zinc-500 hover:text-red-400">
              <AlertTriangle size={14} />
            </Button>
            <Button onClick={() => handleAction('SHARE')} variant="ghost" className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-400"><Share2 size={14} /></Button>
            <Button onClick={() => handleAction('DOWNLOAD')} variant="ghost" className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-400"><Download size={14} /></Button>
          </div>
        </div>
      </header>

      <main className="flex-1 lg:overflow-hidden flex flex-col lg:flex-row relative z-20">


        <section className="w-full lg:w-[450px] relative border-r border-white/5 bg-black/40 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">

            <div className="absolute inset-8 border border-white/5">
              <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-emerald-500/50" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-emerald-500/50" />
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative group z-10 w-[280px] aspect-[2/3]"
            >

              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-sm z-20">
                <motion.div
                  animate={{ top: ["-10%", "110%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                />
              </div>

              {movie?.poster ? (
                <img
                  src={movie.poster}
                  className="w-full h-full object-cover border border-white/10 grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                  alt="Asset"
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center border border-white/10">
                  <Eye className="text-zinc-700" />
                </div>
              )}

              <div className="absolute -bottom-10 left-0 flex items-center gap-2 text-[8px] text-emerald-500 font-mono">
                <Scan size={12} className="animate-spin-slow" />
                <span>VISUAL_HASH_MATCHED</span>
              </div>
            </motion.div>
          </div>


          <div className="p-6 border-t border-white/5 bg-zinc-950">
            <Button
              onClick={() => setShowInitView(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-black h-14 rounded-sm font-black tracking-[0.3em] uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <Play size={16} className="mr-3 fill-current" /> Initialize
            </Button>
          </div>
        </section>


        <section className="flex-1 flex flex-col bg-[#050505] min-h-[500px] lg:min-h-0">


          <div className="flex border-b border-white/5 bg-black/40 px-6">
            {[
              { id: 'overview', label: 'Briefing', icon: Terminal },
              { id: 'metrics', label: 'Neural Metrics', icon: Activity },
              { id: 'structure', label: 'Narrative Arch', icon: Workflow }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 text-[9px] uppercase tracking-widest font-bold border-b-2 transition-all ${activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                <tab.icon size={12} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 lg:overflow-y-auto">
            <div className="p-10 max-w-4xl">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 rounded-none text-[8px] py-0 h-5">CLASS_A_MEDIA</Badge>
                  <span className="text-zinc-600 text-[8px]">DB_REF: #{movieId}</span>
                </div>
                <h1 className="text-5xl font-black text-white uppercase tracking-tight leading-none mb-4 italic">
                  {movie?.title || "Unknown_Entity"}
                </h1>
                <div className="flex flex-wrap gap-2">
                  {(movie?.moods || ["Thriller", "Cyberpunk", "Noir"]).map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-zinc-900 border border-white/10 text-zinc-400 text-[8px] uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {activeTab === 'overview' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800 border border-zinc-800">
                    {[
                      { label: "Year", value: movie?.year },
                      { label: "Runtime", value: `${movie?.runtime || 124}m` },
                      { label: "Director", value: "Archive_Redacted" },
                      { label: "Rating", value: "R-Restricted" }
                    ].map((item, i) => (
                      <div key={i} className="bg-[#080808] p-4 group hover:bg-[#0a0a0a] transition-colors">
                        <div className="text-[7px] text-zinc-500 uppercase font-bold mb-1 group-hover:text-emerald-500 transition-colors">{item.label}</div>
                        <div className="text-zinc-200">{item.value || "N/A"}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 border-l-2 border-emerald-500 bg-zinc-900/20">
                    <h3 className="text-emerald-500 font-bold uppercase tracking-widest text-[9px] mb-3 flex items-center gap-2">
                      <Info size={12} /> Synopsis Log
                    </h3>
                    <p className="text-[13px] leading-7 text-zinc-300 font-light">
                      {movie?.overview || "Intelligence gathering complete. Subject demonstrates high complexity narrative structures intertwined with deep emotional resonance vectors. Recommended for immediate viewing protocol."}
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'metrics' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900/20 border border-white/5 p-6">
                      <h3 className="flex items-center gap-2 text-emerald-500 font-bold uppercase tracking-widest text-[9px] mb-6">
                        <Fingerprint size={12} /> Biometric Resonance
                      </h3>
                      <div className="space-y-4">
                        {['Pacing', 'Atmosphere', 'Complexity', 'Action'].map(stat => (
                          <div key={stat}>
                            <div className="flex justify-between text-[9px] text-zinc-400 uppercase mb-1">
                              <span>{stat}</span>
                              <span>{Math.floor(Math.random() * 30) + 70}%</span>
                            </div>
                            <div className="h-1 bg-zinc-800 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-emerald-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-900/20 border border-white/5 p-6 flex flex-col items-center justify-center relative">
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.2),transparent_70%)]" />
                      <Zap size={48} className="text-emerald-500 animate-pulse mb-4" />
                      <div className="text-center">
                        <div className="text-4xl font-black text-white">98.4%</div>
                        <div className="text-[8px] text-emerald-500 uppercase tracking-[0.3em]">System Compatibility</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'structure' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                  <div className="border border-zinc-800 bg-black p-1">
                    <div className="bg-zinc-900/50 p-2 flex justify-between items-center border-b border-zinc-800 mb-4">
                      <span className="text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Layers size={12} /> Narrative Architecture
                      </span>
                      <Badge variant="outline" className="text-[7px] border-emerald-500/30 text-emerald-500">GENERATED</Badge>
                    </div>

                    <div className="p-8 flex flex-col items-center justify-center min-h-[200px] gap-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-90">
                      <div className="flex flex-col gap-4 w-full">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="flex items-center gap-4">
                            <div className="text-[8px] text-zinc-600">NODE_{i}00</div>
                            <div className="flex-1 h-px bg-zinc-800 relative">
                              <motion.div
                                animate={{ left: ["0%", "100%", "0%"] }}
                                transition={{ duration: 3 + i, repeat: Infinity }}
                                className="absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-emerald-500 rounded-full"
                              />
                            </div>
                            <div className="text-[8px] text-emerald-500 font-bold">STABLE</div>
                          </div>
                        ))}
                      </div>
                      <p className="text-zinc-500 text-[10px] uppercase tracking-widest animate-pulse">Deep_Script_Scan_Active</p>
                    </div>
                  </div>


                  <div className="border border-zinc-800 bg-black p-1">
                    <div className="bg-zinc-900/50 p-2 flex justify-between items-center border-b border-zinc-800 mb-4">
                      <span className="text-[9px] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Network size={12} /> Entity Relation Map
                      </span>
                      <Badge variant="outline" className="text-[7px] border-emerald-500/30 text-emerald-500">LIVE_RENDER</Badge>
                    </div>

                    <div className="p-8 flex flex-col items-center justify-center min-h-[220px] gap-6 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.2),transparent_70%)]" />
                      <div className="relative w-full max-w-[300px] aspect-square">

                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-emerald-500 rounded-full z-10 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                        />

                        {[0, 1, 2, 3, 4].map(i => (
                          <motion.div
                            key={i}
                            animate={{
                              rotate: 360,
                            }}
                            transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                          >
                            <div
                              className={`absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full border border-emerald-500/50 ${i % 2 === 0 ? 'bg-blue-500/30' : 'bg-red-500/30'}`}
                              style={{ transform: `translateY(${20 + i * 15}px)` }}
                            />
                          </motion.div>
                        ))}
                      </div>
                      <div className="flex gap-4 text-[8px] text-zinc-600 uppercase z-10">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /> Protagonist</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Antagonist</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      </main>


      <footer className="relative z-30 h-8 border-t border-white/5 bg-black flex justify-between items-center px-4 text-[8px] uppercase tracking-widest text-zinc-600">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${movie ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
            SERVER_NY_09
          </span>
          <span>UPTIME: 4923h 12m</span>
        </div>
        <span className="font-bold text-zinc-500">KAIROS_OS v2.4.1 // RESTRICTED ACCESS</span>
      </footer>


      <AnimatePresence>
        {reportModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md bg-zinc-950 border border-white/10 p-8 space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-red-500" size={20} />
                  <div>
                    <h2 className="text-white font-bold uppercase tracking-widest text-sm">Report Anomaly</h2>
                    <p className="text-zinc-500 text-[8px] uppercase tracking-tighter mt-1">SIM_ERROR_DETECTED // SUBMIT_LOGS</p>
                  </div>
                </div>
                <Button onClick={() => setReportModalOpen(false)} variant="ghost" className="h-8 w-8 p-0 hover:bg-white/5"><X size={16} /></Button>
              </div>

              {reportSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-12 w-12 rounded-full border border-emerald-500 flex items-center justify-center">
                    <Send size={18} className="text-emerald-500" />
                  </motion.div>
                  <p className="text-emerald-500 text-[9px] uppercase tracking-widest font-bold">Log_Extracted_Successfully</p>
                  <Button onClick={() => { setReportModalOpen(false); setReportSuccess(false); }} className="mt-4 bg-emerald-500 text-black text-[9px] uppercase font-bold h-8 px-8 rounded-none">Close</Button>
                </div>
              ) : (
                <>
                  <textarea
                    value={reportContent}
                    onChange={(e) => setReportContent(e.target.value)}
                    placeholder="DESCRIBE_ANOMALY_LOGS..."
                    className="w-full h-32 bg-black border border-white/5 p-4 text-[10px] text-zinc-300 placeholder:text-zinc-700 focus:border-red-500/50 outline-none transition-colors uppercase tracking-widest"
                  />

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setReportModalOpen(false)}
                      variant="outline"
                      className="flex-1 h-10 border-white/10 text-white text-[9px] uppercase font-bold rounded-none hover:bg-white/5"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        AudioEngine.playSuccess();
                        setReportSuccess(true);
                        setReportContent("");
                      }}
                      disabled={!reportContent}
                      className="flex-1 h-10 bg-red-600 hover:bg-red-500 text-white text-[9px] uppercase font-bold rounded-none shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
                    >
                      Submit Report
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showInitView && movie && (
          <InitializeView
            movie={{ title: movie.title, id: movie.id, youtubeId: movie.youtubeId }}
            onClose={() => setShowInitView(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}