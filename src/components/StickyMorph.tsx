import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";

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
    { id: "with_lock", text: "in background:", indent: 2 }, 
    { id: "append", text: "add item * 2 to results", indent: 3 },
    { id: "for_threads", text: "wait for background", indent: 1 }, 
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

// Custom Scramble Hook strictly managed in React
function useScrambleText(text: string, isScrambling: boolean) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!isScrambling) {
      setDisplayText(text);
      return;
    }

    let timeoutId: NodeJS.Timeout;
    const scramble = () => {
      let scrambled = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " " || text[i] === "\n") {
           scrambled += text[i];
        } else {
           scrambled += Math.random() > 0.5 ? "0" : "1";
        }
      }
      setDisplayText(scrambled);
      timeoutId = setTimeout(scramble, 30);
    };
    
    scramble();
    return () => clearTimeout(timeoutId);
  }, [text, isScrambling]);

  return displayText;
}

// Line component applying Scramble and unified Layout
function AnimatedLine({ line, isScrambling }: { line: any, isScrambling: boolean }) {
  const text = useScrambleText(line.text, isScrambling);
  
  return (
    <motion.div
      layoutId={line.id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.3 }}
      className="whitespace-pre flex code-line overflow-hidden"
      style={{ paddingLeft: `${line.indent * 1.5}rem` }}
    >
      {text === "" ? <span className="inline-block h-6" /> : <span>{text}</span>}
    </motion.div>
  );
}

export default function StickyMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. Fixing the scroll threshold lag by offloading to Framer Motion's hardware-accelerated event mapping
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [scrollState, setScrollState] = useState(0);
  const [displayState, setDisplayState] = useState(0);
  const [isScrambling, setIsScrambling] = useState(false);
  const [showPathIndex, setShowPathIndex] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let nextState = 0;
    if (latest >= 0.66) nextState = 2;
    else if (latest >= 0.33) nextState = 1;
    
    if (nextState !== scrollState) {
        setScrollState(nextState);
    }
  });

  useEffect(() => {
    if (scrollState === displayState) return;

    // Orchestrate SVG line drawing -> Scramble -> Change State purely via React logic
    const forward = scrollState > displayState;
    const pathIdx = forward ? scrollState : displayState; 
    
    setShowPathIndex(pathIdx);
    
    // Give time for SVG path to visually draw
    const t1 = setTimeout(() => {
        setIsScrambling(true);
        // Scramble execution
        const t2 = setTimeout(() => {
            setDisplayState(scrollState);
            setIsScrambling(false);
            setShowPathIndex(-1);
        }, 200);
        return () => clearTimeout(t2);
    }, 500);

    return () => clearTimeout(t1);
  }, [scrollState, displayState]);

  const currentLines = states[displayState];

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full bg-slate-50 text-slate-900 pointer-events-auto">
      {/* Intricate SVG Compiler Pipeline orchestrated smoothly via Framer Motion without hacking the DOM */}
      <div className="absolute inset-0 pointer-events-none flex justify-center items-center z-20 sticky top-0 h-screen max-w-7xl mx-auto">
          <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet">
             <motion.path 
                d="M 100 200 C 300 200, 400 400, 600 400" 
                stroke="#3b82f6" strokeWidth="4" fill="none"
                style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                    pathLength: showPathIndex === 1 ? 1 : 0, 
                    opacity: showPathIndex === 1 ? 1 : 0 
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
             />
             <motion.path 
                d="M 100 500 C 300 500, 400 300, 600 300" 
                stroke="#10b981" strokeWidth="4" fill="none"
                style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))' }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ 
                    pathLength: showPathIndex === 2 ? 1 : 0, 
                    opacity: showPathIndex === 2 ? 1 : 0 
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
             />
          </svg>
      </div>

      <div className="sticky top-0 h-screen w-full flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full pt-10 lg:pt-20 items-center">
          
          {/* Left Column: Morphing Code Block */}
          <div className="flex flex-col justify-center relative z-10 w-full mb-8 lg:mb-0">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter mb-4 lg:mb-6 text-slate-900 leading-tight lg:h-24">
              {displayState === 0 && "From messy syntax..."}
              {displayState === 1 && "To plain English..."}
              {displayState === 2 && "To bare metal."}
            </h2>

            <div className="relative rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-xl overflow-hidden p-6 md:p-8 font-mono text-sm sm:text-base leading-relaxed text-slate-800 min-h-[400px] lg:min-h-[450px]">
              <div className="flex space-x-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              </div>

              <div className="relative flex flex-col w-full">
                 <AnimatePresence mode="popLayout">
                    {currentLines.map((line) => (
                      <AnimatedLine key={line.id} line={line} isScrambling={isScrambling} />
                    ))}
                 </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Column: Scroll descriptions (Fix Mobile UX Blackhole) */}
          {/* Always display on mobile, flex col underneath safely cross-fading */}
          <div className="flex flex-col justify-start lg:justify-center text-base lg:text-lg text-slate-600 space-y-4 max-w-md relative z-10 w-full lg:h-[200px]">
            <AnimatePresence mode="wait">
              {displayState === 0 && (
                <motion.div
                  key="desc-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mb-4">
                    Traditional languages force you to act as a human compiler. You manage locks, map threads, and fight with syntactic noise.
                  </p>
                  <p>
                    Scroll down to see the Layman difference.
                  </p>
                </motion.div>
              )}
              {displayState === 1 && (
                <motion.div
                  key="desc-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="mb-4">
                    Layman handles the complexity for you. Concurrency, memory management, and data structures are expressed in intent-driven English.
                  </p>
                  <p>
                    No more boilerplate. Just logic.
                  </p>
                </motion.div>
              )}
              {displayState === 2 && (
                <motion.div
                  key="desc-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
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
