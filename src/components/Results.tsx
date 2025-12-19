import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  ChevronLeft, RefreshCw, Activity, Play, Share2, Lock,
  Globe, Grid3x3, List, X, Volume2, VolumeX,
  Search, Bookmark, Star, Calendar, Clock, BarChart3,
  Maximize2
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { discoverMoviesByEmotion } from '../services/tmdb';
import { useNavigate } from '@tanstack/react-router';
import { AudioEngine } from '../lib/audio';

export default function ResultsPage() {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isTrailerMode, setIsTrailerMode] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [muted, setMuted] = useState(true);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('selectedEmotions');
    if (stored) setSelectedEmotions(JSON.parse(stored));

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsTrailerMode(false);
      if (e.key === 'r' || e.key === 'R') {
        AudioEngine.playClick();
        refetch();
      }
      if (e.key === 'ArrowLeft') window.history.back();
    };

    const storedWatchlist = localStorage.getItem('kairos_watchlist');
    if (storedWatchlist) setWatchlist(JSON.parse(storedWatchlist));

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    localStorage.setItem('kairos_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const { data: movies = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ['movies', selectedEmotions],
    queryFn: () => discoverMoviesByEmotion(selectedEmotions),
    enabled: selectedEmotions.length > 0
  });

  const filteredMovies = useMemo(() => {
    return movies.filter((m: any) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.genres && m.genres.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [movies, searchQuery]);

  const activeMovie = useMemo(() => {
    if (!filteredMovies.length) return null;
    const targetId = hoveredId || selectedId || filteredMovies[0]?.id;
    return filteredMovies.find((m: any) => m.id === targetId) || filteredMovies[0];
  }, [filteredMovies, hoveredId, selectedId]);

  const toggleWatchlist = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    AudioEngine.playClick();
    setWatchlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const trailerUrl = activeMovie?.trailer
    ? `https://www.youtube.com/embed/${activeMovie.trailer}?autoplay=1&mute=${muted ? 1 : 0}&controls=1&modestbranding=1&rel=0`
    : null;

  if (!mounted || (isLoading && !movies.length)) return (
    <div className="h-svh bg-black flex items-center justify-center font-mono overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      <motion.div className="flex flex-col items-center gap-8 relative z-10">
        <div className="relative">
          <motion.div
            className="absolute inset-0 bg-emerald-500 blur-xl opacity-20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <Activity className="text-emerald-400 w-16 h-16" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <motion.div
            className="h-1 w-48 bg-emerald-900/30 overflow-hidden rounded-full"
          >
            <motion.div
              className="h-full bg-emerald-500"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
          <span className="text-emerald-500/70 text-[10px] tracking-[0.5em] uppercase font-bold">Initializing Kairos Core</span>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="relative flex flex-col w-full min-h-svh lg:h-svh bg-[#050505] text-zinc-100 lg:overflow-hidden font-mono selection:bg-emerald-500/30 selection:text-emerald-200">

      {activeMovie?.backdrop && (
        <motion.div
          key={activeMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent z-10" />
          <img
            src={activeMovie.backdrop}
            className="w-full h-full object-cover blur-sm scale-105"
            alt="atmosphere"
          />
        </motion.div>
      )}

      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="pointer-events-none fixed inset-0 z-[2] bg-[linear-gradient(rgba(18,18,18,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat" />

      <header className="relative z-50 flex justify-between items-center px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="flex items-center gap-12">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-all"
          >
            <div className="p-2 border border-white/10 rounded group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all">
              <ChevronLeft size={16} />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold hidden md:block">Return</span>
          </button>

          <div className="flex items-center gap-4">
            <Activity className="text-emerald-500 w-5 h-5" />
            <h1 className="text-2xl font-bold tracking-tighter text-white">
              KAIROS<span className="text-emerald-500">_OS</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-zinc-400">
              <Globe size={12} className="text-emerald-500" />
              <span>Net_Status: <span className="text-white">Online</span></span>
            </div>
            <div className="w-px h-3 bg-white/20" />
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-zinc-400">
              <Lock size={12} className="text-emerald-500" />
              <span>Protocol: <span className="text-white">Secure</span></span>
            </div>
          </div>

          <Button
            onClick={() => {
              AudioEngine.playClick();
              refetch();
            }}
            variant="ghost"
            className="h-10 w-10 p-0 rounded-full border border-white/10 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all"
          >
            <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
          </Button>

          <Button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            variant="ghost"
            className="lg:hidden h-10 w-10 p-0 rounded-full border border-white/10"
          >
            <List size={16} />
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden z-10 relative">
        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-[60] lg:z-auto
          w-full sm:w-[450px] flex flex-col border-r border-white/5 bg-black/90 lg:bg-black/50 backdrop-blur-3xl lg:backdrop-blur-md transition-all duration-500 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 border-b border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Detected Entries: {filteredMovies.length}</span>
              <div className="flex items-center gap-4">
                <Button variant="ghost" className="lg:hidden h-8 w-8 p-0" onClick={() => setIsSidebarOpen(false)}>
                  <X size={16} />
                </Button>
                <div className="flex gap-1 bg-white/5 p-1 rounded-lg">
                  <button
                    onClick={() => { AudioEngine.playHover(); setViewMode('list'); }}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                  >
                    <List size={14} />
                  </button>
                  <button
                    onClick={() => { AudioEngine.playHover(); setViewMode('grid'); }}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-zinc-700 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                  >
                    <Grid3x3 size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="FILTER_DATABASE..."
                className="w-full bg-black/40 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-[11px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-all uppercase tracking-wider"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className={viewMode === 'grid' ? "grid grid-cols-2 gap-3 p-4" : "flex flex-col"}>
              {filteredMovies.map((movie: any, idx: number) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    AudioEngine.playClick();
                    setSelectedId(movie.id);
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  onMouseEnter={() => {
                    AudioEngine.playHover();
                    setHoveredId(movie.id);
                  }}
                  className={`group relative cursor-pointer border border-transparent transition-all duration-300 ${viewMode === 'list'
                    ? 'p-5 border-b border-white/5 hover:bg-white/[0.03]'
                    : 'aspect-[2/3] rounded-xl overflow-hidden'
                    } ${activeMovie?.id === movie.id ? 'bg-white/[0.06] border-l-emerald-500' : ''}`}
                >
                  {viewMode === 'list' ? (
                    <div className="flex gap-4">
                      <div className="relative w-16 h-24 shrink-0 rounded overflow-hidden border border-white/10 group-hover:border-emerald-500/50 transition-colors">
                        <img src={movie.poster} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className={`text-sm font-bold uppercase truncate transition-colors ${activeMovie?.id === movie.id ? 'text-emerald-400' : 'text-white group-hover:text-emerald-200'}`}>
                              {movie.title}
                            </h3>
                            <span className="text-emerald-500 font-black text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded">
                              {Math.round(movie.match)}%
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500">
                            <span>{movie.year}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            <span className="truncate max-w-[120px]">{movie.genres?.[0]}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex gap-1">
                            {movie.emotionTags?.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="text-[9px] text-zinc-400 border border-white/10 px-1.5 py-0.5 rounded uppercase">{tag}</span>
                            ))}
                          </div>
                          <button
                            onClick={(e) => toggleWatchlist(e, movie.id)}
                            className="text-zinc-600 hover:text-emerald-400 transition-colors"
                          >
                            <Bookmark size={14} fill={watchlist.includes(movie.id) ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-full">
                      <img src={movie.poster} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <div className="absolute bottom-0 inset-x-0 p-3">
                        <div className="text-emerald-400 text-[10px] font-bold">{movie.match}%</div>
                        <div className="text-white text-[11px] font-bold truncate uppercase">{movie.title}</div>
                      </div>
                      {activeMovie?.id === movie.id && (
                        <div className="absolute inset-0 border-2 border-emerald-500/50 rounded-xl" />
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        <section className="flex-1 relative flex flex-col lg:flex-row lg:overflow-hidden bg-[#030303]">
          <div className="flex-1 relative flex flex-col items-center justify-center p-6 md:p-12 min-h-[400px] lg:min-h-0">
            <div className="absolute top-8 left-8 flex gap-2">
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              />
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              />
              <motion.div
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                className="h-2 w-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              />
            </div>

            <motion.div
              key={activeMovie?.id}
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.5 }}
              className="relative z-10 max-w-md w-full aspect-[2/3] group"
            >
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/30 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-duration-700" />
              <div className="relative h-full w-full rounded-lg overflow-hidden border border-white/10 shadow-2xl">
                <img src={activeMovie?.poster} className="w-full h-full object-cover" />

                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                  <Button
                    onClick={() => { AudioEngine.playSuccess(); setIsTrailerMode(true); }}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold tracking-widest uppercase rounded-full px-8 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                  >
                    <Play size={16} className="mr-2 fill-current" /> Watch Trailer
                  </Button>
                </div>
              </div>

              <div className="absolute -right-16 top-10 flex flex-col gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <div className="flex items-center gap-2 -rotate-90 origin-left translate-x-full">
                  <div className="w-8 h-px bg-zinc-700" />
                  <span>ID_{activeMovie?.id}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-[450px] bg-black/80 lg:bg-black/60 backdrop-blur-2xl border-t lg:border-t-0 lg:border-l border-white/5 p-6 md:p-10 flex flex-col shrink-0 lg:shrink lg:overflow-y-auto">
            <div className="space-y-8">
              <div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '40px' }}
                  className="h-1 bg-emerald-500 mb-6"
                />
                <h1 className="text-4xl lg:text-5xl font-black text-white uppercase leading-[0.9] tracking-tight mb-4">
                  {activeMovie?.title}
                </h1>
                <div className="flex flex-wrap gap-3 text-[11px] font-medium tracking-wide">
                  <span className="bg-white/10 px-3 py-1 rounded text-white flex items-center gap-2">
                    <Calendar size={12} /> {activeMovie?.year}
                  </span>
                  <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded flex items-center gap-2">
                    <BarChart3 size={12} /> {activeMovie?.match}% Match
                  </span>
                  <span className="bg-transparent border border-white/20 text-zinc-400 px-3 py-1 rounded flex items-center gap-2">
                    <Clock size={12} /> 2h 14m
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <Activity size={14} /> Synopsis Data
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed font-light border-l-2 border-emerald-500/30 pl-4">
                  {activeMovie?.overview || "No synopsis data available in the archives."}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <Star size={14} /> Emotional Metrics
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Intensity', 'Atmosphere', 'Narrative', 'Visuals'].map((stat, i) => (
                    <div key={stat} className="bg-white/5 p-3 rounded border border-white/5 hover:border-emerald-500/30 transition-colors">
                      <div className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">{stat}</div>
                      <div className="flex items-end gap-2">
                        <span className="text-xl font-bold text-white">8.{i + 4}</span>
                        <div className="flex-1 h-1 bg-zinc-800 rounded-full mb-1.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${80 + i * 5}%` }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="h-full bg-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8 mt-auto flex gap-4">
                <Button
                  onClick={() => { AudioEngine.playSuccess(); navigate({ to: `/results/${activeMovie.id}` }); }}
                  className="flex-1 bg-white text-black hover:bg-emerald-500 hover:text-black h-12 rounded-none font-bold tracking-widest uppercase transition-all"
                >
                  Start Session
                </Button>
                <Button variant="outline" className="h-12 w-12 border-white/20 hover:bg-white/10 rounded-none transition-all">
                  <Share2 size={18} />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {isTrailerMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8"
          >
            <button
              onClick={() => setIsTrailerMode(false)}
              className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <div className="w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(16,185,129,0.1)] relative group">
              {trailerUrl ? (
                <iframe
                  src={trailerUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-500 uppercase tracking-widest">
                  Signal Lost // Trailer Unavailable
                </div>
              )}

              <button
                onClick={() => setMuted(!muted)}
                className="absolute bottom-8 right-8 p-3 bg-black/50 backdrop-blur border border-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}