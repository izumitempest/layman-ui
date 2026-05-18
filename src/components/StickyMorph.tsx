import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useReducedMotion, useMotionValueEvent } from "motion/react";
import { cn } from "../lib/utils";

const states = [
  // State 0: Messy Python
  [
    { id: "import_sys", text: "import sys", indent: 0 },
    { id: "import_thread", text: "import threading", indent: 0 },
    { id: "blank_1", text: "", indent: 0 },
    { id: "func_def", text: "def process_data(data):", indent: 0 },
    { id: "results_init", text: "results = []", indent: 1 },
    { id: "lock_init", text: "lock = threading.Lock()", indent: 1 },
    { id: "worker_def", text: "def worker(d):", indent: 1 },
    { id: "with_lock", text: "with lock:", indent: 2 },
    { id: "append", text: "results.append(d * 2)", indent: 3 },
    { id: "threads_init", text: "threads = []", indent: 1 },
    { id: "for_item", text: "for item in data:", indent: 1 },
    { id: "thread_create", text: "t = threading.Thread(target=worker, args=(item,))", indent: 2 },
    { id: "thread_append", text: "threads.append(t)", indent: 2 },
    { id: "thread_start", text: "t.start()", indent: 2 },
    { id: "for_threads", text: "for t in threads:", indent: 1 },
    { id: "thread_join", text: "t.join()", indent: 2 },
    { id: "return", text: "return results", indent: 1 },
  ],
  // State 1: Layman
  [
    { id: "import_sys", text: "use sys", indent: 0 },
    { id: "import_thread", text: "use thread", indent: 0 },
    { id: "blank_1", text: "", indent: 0 },
    { id: "func_def", text: "function process data:", indent: 0 },
    { id: "results_init", text: "let results be empty list", indent: 1 },
    { id: "for_item", text: "for each item in data:", indent: 1 },
    { id: "with_lock", text: "in background:", indent: 2 }, // Re-using ID for morph
    { id: "append", text: "add item * 2 to results", indent: 3 },
    { id: "for_threads", text: "wait for background", indent: 1 }, // Morphing join
    { id: "return", text: "give results", indent: 1 },
  ],
  // State 2: Binary
  [
    { id: "bin_1", text: "01010101 01101110 01100101 01111000", indent: 0 },
    { id: "bin_2", text: "01110000 01100101 01100011 01110100", indent: 0 },
    { id: "bin_3", text: "01100101 01100100 00100000 01000010", indent: 0 },
    { id: "bin_4", text: "01101111 01101111 01101100 01100101", indent: 0 },
    { id: "bin_5", text: "01100001 01101110 00100000 01101001", indent: 0 },
    { id: "bin_6", text: "01101110 00100000 01100010 01100001", indent: 0 },
    { id: "bin_7", text: "01100111 01100111 01100001 01100111", indent: 0 },
    { id: "bin_8", text: "01100101 00100000 01100001 01110010", indent: 0 },
    { id: "bin_9", text: "01100101 01100001 00100001 00100001", indent: 0 },
  ],
];

export default function StickyMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  // We map scroll progress to a discrete state integer: 0, 1, or 2.
  const [activeState, setActiveState] = useState(0);

  // Update state without causing React warnings in render, using useMotionValueEvent
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) {
      if (activeState !== 0) setActiveState(0);
    } else if (latest >= 0.33 && latest < 0.66) {
      if (activeState !== 1) setActiveState(1);
    } else {
      if (activeState !== 2) setActiveState(2);
    }
  });

  const currentLines = states[activeState];

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full bg-slate-50 text-slate-900">
      {/* Background Parallax */}
      <motion.div 
        className="absolute inset-0 z-0 flex items-center justify-center opacity-10 pointer-events-none"
        style={shouldReduceMotion ? {} : { y: parallaxY }}
      >
        <div className="w-[800px] h-[800px] rounded-full blur-3xl bg-slate-300" />
      </motion.div>

      <div className="sticky top-0 h-screen w-full flex items-center max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full pt-20">
          
          {/* Left Column: Morphing Code Block */}
          <div className="flex flex-col justify-center relative z-10 w-full">
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tighter mb-6 text-slate-900 leading-tight">
              {activeState === 0 && "From messy syntax..."}
              {activeState === 1 && "To plain English..."}
              {activeState === 2 && "To bare metal."}
            </h2>

            <div className="relative rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-xl overflow-hidden p-6 md:p-8 font-mono text-sm sm:text-base leading-relaxed text-slate-800 min-h-[450px]">
              {/* Optional macOS-style dots inside the glass container */}
              <div className="flex space-x-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>

              <div className="relative flex flex-col w-full">
                <AnimatePresence mode="popLayout">
                  {currentLines.map((line) => (
                    <motion.div
                      key={line.id}
                      layoutId={line.id}
                      initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 150, 
                        damping: 20, 
                        mass: 0.8 
                      }}
                      className="whitespace-pre flex"
                      style={{ paddingLeft: `${line.indent * 1.5}rem` }}
                    >
                      {/* Give empty lines a min height so they layout properly */}
                      {line.text === "" ? <span className="inline-block h-6" /> : line.text}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Scroll descriptions */}
          <div className="hidden lg:flex flex-col justify-center text-lg text-slate-600 space-y-4 max-w-md relative z-10">
            <AnimatePresence mode="wait">
              {activeState === 0 && (
                <motion.div
                  key="desc-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="mb-4">
                    Traditional languages force you to act as a human compiler. You manage locks, map threads, and fight with syntactic noise.
                  </p>
                  <p>
                    Scroll down to see the Layman difference.
                  </p>
                </motion.div>
              )}
              {activeState === 1 && (
                <motion.div
                  key="desc-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="mb-4">
                    Layman handles the complexity for you. Concurrency, memory management, and data structures are expressed in intent-driven English.
                  </p>
                  <p>
                    No more boilerplate. Just logic.
                  </p>
                </motion.div>
              )}
              {activeState === 2 && (
                <motion.div
                  key="desc-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <p className="mb-4">
                    Yet, it doesn't run on a slow VM. Layman uses an intense LLVM backend optimization pass to compile your intent directly to blazingly fast machine code.
                  </p>
                  <p>
                    Zero overhead. Maximum performance.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
