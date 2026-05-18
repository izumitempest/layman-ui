import { useRef, useState, useEffect } from "react";
import anime from "animejs";

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
  const codeBlockRef = useRef<HTMLDivElement>(null);
  
  const [activeState, setActiveState] = useState(0);
  const isAnimating = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isAnimating.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Calculate progress 0 to 1 based on section being scrolled
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      
      let nextState = 0;
      if (progress >= 0.66) nextState = 2;
      else if (progress >= 0.33) nextState = 1;

      if (nextState !== activeState) {
         isAnimating.current = true;
         triggerTransition(nextState);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeState]);

  const triggerTransition = (nextState: number) => {
     // Pipeline animation
     const pathClass = nextState === 1 ? '.pipeline-path-1' : '.pipeline-path-2';
     const particleClass = nextState === 1 ? '.pipeline-particle-1' : '.pipeline-particle-2';
     
     const pathEl = document.querySelector(pathClass) as SVGPathElement;
     if (!pathEl) {
        // Fallback if SVG not rendered
        setActiveState(nextState);
        isAnimating.current = false;
        return;
     }

     const path = anime.path(pathEl);

     anime.timeline({
         complete: () => {
             // Scramble effect on the text block
             scrambleAndSwitch(nextState);
         }
     })
     .add({
         targets: pathClass,
         strokeDashoffset: [anime.setDashoffset, 0],
         duration: 800,
         easing: 'easeInOutSine',
         begin: () => {
            (document.querySelector(pathClass) as SVGPathElement).style.opacity = '1';
         }
     })
     .add({
         targets: particleClass,
         translateX: path('x'),
         translateY: path('y'),
         opacity: [0, 1, 1, 0], // fade in, stay, fade out at end
         duration: 800,
         easing: 'linear'
     }, '-=800'); // Run simultaneously with path draw
  };

  const scrambleAndSwitch = (nextState: number) => {
      const codeBlock = codeBlockRef.current;
      if (!codeBlock) {
          setActiveState(nextState);
          isAnimating.current = false;
          return;
      }

      const textNodes = Array.from(codeBlock.querySelectorAll('.code-line span'));
      
      // Fake scramble before switching content
      const scrambleDuration = 200;
      const scrambleInterval = 30; // update every 30ms
      let elapsed = 0;

      const interval = setInterval(() => {
          textNodes.forEach(node => {
              const originalLength = node.textContent?.length || 10;
              let scrambled = '';
              for (let i = 0; i < originalLength; i++) {
                  scrambled += Math.random() > 0.5 ? '0' : '1';
              }
              node.textContent = scrambled;
          });
          
          elapsed += scrambleInterval;
          if (elapsed >= scrambleDuration) {
              clearInterval(interval);
              setActiveState(nextState);
              // Wait a tiny bit for React to render new state, then clear animation flag
              setTimeout(() => {
                  isAnimating.current = false;
                  // Reset SVG paths for scrolling back up
                  document.querySelectorAll('.pipeline-path-1, .pipeline-path-2').forEach(el => {
                      (el as SVGPathElement).style.opacity = '0';
                  });
              }, 50);
          }
      }, scrambleInterval);
  };

  const currentLines = states[activeState];

  return (
    <section ref={containerRef} className="relative h-[300vh] w-full bg-slate-50 text-slate-900 pointer-events-auto">
      {/* Intricate SVG Compiler Pipeline */}
      <div className="absolute inset-x-0 inset-y-0 pointer-events-none flex justify-center items-center z-20" style={{position: 'fixed'}}>
          <svg className="w-full h-full" style={{ maxWidth: '1200px' }} preserveAspectRatio="xMidYMid meet">
             {/* Path 1: Python to Layman */}
             <path 
                className="pipeline-path-1" 
                d="M 100 200 C 300 200, 400 400, 600 400" 
                stroke="#3b82f6" strokeWidth="4" fill="none" opacity="0" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' }}
             />
             <circle className="pipeline-particle-1" r="6" fill="#60a5fa" opacity="0" style={{ filter: 'drop-shadow(0 0 10px #60a5fa)' }} />

             {/* Path 2: Layman to Binary */}
             <path 
                className="pipeline-path-2" 
                d="M 100 500 C 300 500, 400 300, 600 300" 
                stroke="#10b981" strokeWidth="4" fill="none" opacity="0" 
                style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))' }}
             />
             <circle className="pipeline-particle-2" r="6" fill="#34d399" opacity="0" style={{ filter: 'drop-shadow(0 0 10px #34d399)' }} />
          </svg>
      </div>

      <div className="sticky top-0 h-screen w-full flex items-center max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full pt-20">
          
          {/* Left Column: Morphing Code Block */}
          <div className="flex flex-col justify-center relative z-10 w-full">
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tighter mb-6 text-slate-900 leading-tight h-24">
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

              <div className="relative flex flex-col w-full" ref={codeBlockRef}>
                  {currentLines.map((line) => (
                    <div
                      key={line.id}
                      className="whitespace-pre flex code-line overflow-hidden"
                      style={{ paddingLeft: `${line.indent * 1.5}rem` }}
                    >
                      {/* Give empty lines a min height so they layout properly */}
                      {line.text === "" ? <span className="inline-block h-6" /> : <span>{line.text}</span>}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Right Column: Scroll descriptions */}
          <div className="hidden lg:flex flex-col justify-center text-lg text-slate-600 space-y-4 max-w-md relative z-10 h-[200px]">
              {activeState === 0 && (
                <div>
                  <p className="mb-4">
                    Traditional languages force you to act as a human compiler. You manage locks, map threads, and fight with syntactic noise.
                  </p>
                  <p>
                    Scroll down to see the Layman difference.
                  </p>
                </div>
              )}
              {activeState === 1 && (
                <div>
                  <p className="mb-4">
                    Layman handles the complexity for you. Concurrency, memory management, and data structures are expressed in intent-driven English.
                  </p>
                  <p>
                    No more boilerplate. Just logic.
                  </p>
                </div>
              )}
              {activeState === 2 && (
                <div>
                  <p className="mb-4">
                    Yet, it doesn't run on a slow VM. Layman uses an intense LLVM backend optimization pass to compile your intent directly to blazingly fast machine code.
                  </p>
                  <p>
                    Zero overhead. Maximum performance.
                  </p>
                </div>
              )}
          </div>

        </div>
      </div>
    </section>
  );
}
