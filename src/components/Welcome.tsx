import { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "@tanstack/react-router";

export default function WelcomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const bgX = useTransform(springX, [0, 2000], ["-2%", "2%"]);
  const bgY = useTransform(springY, [0, 2000], ["-2%", "2%"]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col w-full h-svh bg-[#030303] text-zinc-100 overflow-hidden select-none font-sans"
    >
      <div className="absolute inset-0 z-40 pointer-events-none p-6 md:p-12">
        <div className="relative w-full h-full">
          <div className="absolute top-0 left-0 w-12 h-px bg-white/20" />
          <div className="absolute top-0 left-0 w-px h-12 bg-white/20" />

          <div className="absolute bottom-0 right-0 w-12 h-px bg-white/20" />
          <div className="absolute bottom-0 right-0 w-px h-12 bg-white/20" />

          <div className="absolute top-0 right-0 font-Silkscreen text-[8px] tracking-[0.3em] text-zinc-600 flex flex-col items-end gap-1">
            <span>REF_ID: K-2025</span>
            <span className="text-zinc-800">STREAMING_STABLE</span>
          </div>
        </div>
      </div>

      <motion.div
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 z-0 scale-110"
      >
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <motion.div
          animate={{ opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-white rounded-full blur-[160px] opacity-10"
        />
      </motion.div>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, letterSpacing: "-0.05em", filter: "blur(10px)" }}
            animate={{ opacity: 1, letterSpacing: "-0.02em", filter: "blur(0px)" }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="font-Atomic-Age text-[clamp(4.5rem,24vw,16rem)] font-bold leading-none tracking-tighter text-zinc-100"
          >
            KAiROS
          </motion.h1>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="flex items-center gap-4 mt-4"
          >
            <div className="h-px flex-1 -bg-linear-0-to-r from-transparent via-zinc-800 to-transparent" />
            <p className="font-Silkscreen text-[10px] md:text-xs tracking-[0.6em] uppercase text-zinc-500 whitespace-nowrap">
              Every moment carries a mood
            </p>
            <div className="h-px flex-1 -bg-linear-0-to-r from-transparent via-zinc-800 to-transparent" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-20"
        >
          <Button
            variant="ghost"
            className="group relative font-Atomic-Age px-16 py-10 text-xl tracking-[0.4em] border border-zinc-900 hover:border-zinc-200 transition-all duration-1000 ease-in-out rounded-none overflow-hidden"
          >
            <Link to="/begin">
              <span className="relative z-10 text-zinc-400 group-hover:text-white transition-colors duration-500">
                BEGIN HERE
              </span>
              <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />

            </Link>
          </Button>
        </motion.div>
      </main>

      <footer className="relative z-20 w-full p-8 md:p-12 flex justify-between items-end">
        <div className="font-Silkscreen text-[9px] text-zinc-700 tracking-widest uppercase flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-zinc-600 rounded-full animate-ping" />
            <span>System_Ready</span>
          </div>
          <span>Temporal Engine // ACTIVE</span>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="font-Silkscreen text-[8px] text-zinc-800 uppercase tracking-tighter">Current_Frequency</span>
          <div className="flex gap-1 h-4 items-end">
            {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8].map((val, i) => (
              <motion.div
                key={i}
                animate={{ height: [`${val * 100}%`, `${(1 - val) * 100}%`, `${val * 100}%`] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
                className="w-0.5 bg-zinc-800"
              />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
