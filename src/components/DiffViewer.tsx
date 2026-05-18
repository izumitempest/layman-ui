import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export default function DiffViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  
  // Damped scroll for mechanical feel
  const springProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  // Map progress to drawing the SVG line (0 to 1) 
  const pathDraw = useTransform(springProgress, [0.2, 0.6], [0, 1]);
  
  // The glowing pulse that travels along the path (0 to 1)
  const pulsePos = useTransform(springProgress, [0.6, 0.8], [0, 1]);

  // When pulse reaches the end (near 1.0), Layman side highlights
  const rightOpacity = useTransform(springProgress, [0.75, 0.8], [0.3, 1]);
  const rightColor = useTransform(springProgress, [0.75, 0.8], ["#555555", "#ffffff"]);
  const optScale = useTransform(springProgress, [0.75, 0.85], [0, 1]);
  const optOpacity = useTransform(springProgress, [0.75, 0.85], [0, 1]);

  return (
    <section ref={containerRef} className="relative h-[250vh] w-full bg-black border-t border-[#333333]">
       <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-8">
           
           <h2 className="text-3xl font-mono font-bold text-white mb-16 tracking-tighter">
             The Pre-Compilation Pipeline
           </h2>

           <div className="flex w-full max-w-6xl items-center relative">
              {/* Left Pane: Messy Scripting */}
              <div className="w-2/5 border border-[#333333] bg-[#050505] p-6 font-mono text-sm leading-8 shadow-2xl z-10">
                 <div className="text-[#a3a3a3] border-b border-[#333333] pb-2 mb-4 text-xs">legacy_script.py</div>
                 <div className="text-[#d4d4d4]">
                    <div><span className="text-[#569cd6]">import</span> asyncio</div>
                    <div><span className="text-[#569cd6]">async def</span> <span className="text-[#dcdcaa]">process</span>(data):</div>
                    <div>&nbsp;&nbsp;loop = asyncio.get_event_loop()</div>
                    <div className="border border-[#ffb000] p-1 bg-[#ffb000]/10">
                       &nbsp;&nbsp;<span className="text-[#569cd6]">await</span> loop.run_in_executor(<span className="text-[#569cd6]">None</span>, work)
                    </div>
                 </div>
              </div>

              {/* Middle Connection SVG Pane */}
              <div className="w-1/5 h-[300px] relative z-0 flex items-center justify-center">
                 <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Background faint path */}
                    <path 
                      d="M 0 50 L 50 50 L 50 50 L 100 50" 
                      fill="none" 
                      stroke="#333333" 
                      strokeWidth="2" 
                    />
                    {/* Animating main connection path */}
                    <motion.path 
                      d="M 0 50 L 50 50 L 50 50 L 100 50" 
                      fill="none" 
                      stroke="#ffb000" 
                      strokeWidth="2" 
                      style={{ pathLength: pathDraw }}
                    />
                    {/* The glowing pulse (a small thick dash) */}
                    <motion.path 
                      d="M 0 50 L 50 50 L 50 50 L 100 50" 
                      fill="none" 
                      stroke="#00f0ff" 
                      strokeWidth="4"
                      strokeLinecap="round" 
                      style={{ 
                          pathLength: 0.1, 
                          pathOffset: pulsePos,
                          filter: 'drop-shadow(0 0 8px #00f0ff)',
                          opacity: useTransform(pulsePos, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
                      }}
                    />
                 </svg>
              </div>

              {/* Right Pane: Layman */}
              <motion.div 
                 className="w-2/5 border border-[#333333] bg-[#050505] p-6 font-mono text-sm leading-8 shadow-2xl z-10 relative overflow-hidden"
              >
                 <div className="text-[#a3a3a3] border-b border-[#333333] pb-2 mb-4 text-xs">optimized.dvn</div>
                 <motion.div style={{ color: rightColor, opacity: rightOpacity }}>
                    <div><span className="text-[#569cd6]">fn</span> <span className="text-[#dcdcaa]">process</span>(data) {'{'}</div>
                    <div className="relative border border-transparent p-1">
                       &nbsp;&nbsp;<span className="text-[#c586c0]">in background</span> {'{'} work() {'}'}
                       {/* The OPTIMIZED badge */}
                       <motion.div 
                          style={{ scale: optScale, opacity: optOpacity }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff] text-[10px] px-2 py-0.5 uppercase tracking-widest font-bold"
                       >
                         [Optimized]
                       </motion.div>
                    </div>
                    <div>{'}'}</div>
                 </motion.div>
              </motion.div>
           </div>
           
       </div>
    </section>
  );
}
