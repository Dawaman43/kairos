"use client";

import { useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "@tanstack/react-router";

export default function WelcomePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Properly typed Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const lightX = useSpring(mouseX, springConfig);
  const lightY = useSpring(mouseY, springConfig);

  // 2. Create the radial gradient string dynamically
  const background = useTransform(
    [lightX, lightY],
    ([x, y]: number[]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 80%)`
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top } = containerRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center min-h-screen w-full bg-[#050505] text-zinc-100 overflow-hidden"
    >
      {/* Dynamic Spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-60"
        style={{ background }}
      />

      <div className="relative z-10 flex flex-col items-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center"
        >
          {/* Main Title with staggered letter spacing */}
          <h1 className="font-Atomic-Age text-[clamp(4rem,16vw,12rem)] font-bold tracking-[-0.07em] leading-none text-zinc-200">
            KAiROS
          </h1>

          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="h-[1px] w-12 bg-zinc-800" />
            <p className="font-Silkscreen text-[9px] md:text-xs uppercase tracking-[0.5em] text-zinc-500 whitespace-nowrap">
              Every moment carries a mood
            </p>
            <div className="h-[1px] w-12 bg-zinc-800" />
          </div>
        </motion.div>

        {/* Improved Button UI */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20"
        >
          <Button
            variant="outline"
            className="group relative font-Atomic-Age px-14 py-8 bg-transparent border-zinc-800 hover:border-zinc-200 text-zinc-400 hover:text-zinc-100 transition-all duration-700 rounded-none overflow-hidden"
          >
            <Link to="/begin" className="relative z-10 flex items-center justify-center">
              <span className="relative z-10 tracking-[0.2em] text-sm">BEGIN HERE</span>

              {/* Minimalist "scanning" light effect on hover */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-zinc-100/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Decorative corners for a "natural" technical feel */}
      <div className="absolute top-12 left-12 opacity-30">
        <div className="w-4 h-4 border-t border-l border-zinc-500" />
      </div>
      <div className="absolute bottom-12 right-12 opacity-30">
        <div className="w-4 h-4 border-b border-r border-zinc-500" />
      </div>

      <div className="absolute bottom-12 left-12 overflow-hidden h-4">
        <motion.span
          animate={{ y: [20, 0] }}
          transition={{ delay: 1.5 }}
          className="font-Silkscreen text-[8px] text-zinc-600 block uppercase"
        >
          Lat: 40.7128° N | Lon: 74.0060° W
        </motion.span>
      </div>
    </div>
  );
}
