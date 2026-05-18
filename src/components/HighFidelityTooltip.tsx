import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function HighFidelityTooltip() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const spanRef = useRef<HTMLSpanElement>(null);
  const [spanWidth, setSpanWidth] = useState(0);

  useEffect(() => {
    if (spanRef.current) {
      setSpanWidth(spanRef.current.offsetWidth);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!spanRef.current) return;
    const rect = spanRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="w-full bg-white relative z-20 py-32 border-b border-slate-100">
      <div className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center">
        <h3 className="font-display text-4xl lg:text-6xl font-black mb-16 tracking-tighter text-slate-900 leading-none">
          Batteries Included Library
        </h3>
        
        <div className="text-2xl md:text-4xl font-mono bg-slate-50 shadow-sm border border-slate-200 rounded-2xl p-12 md:p-20 w-full text-center relative">
          <span 
            ref={spanRef}
            className="relative inline-block text-blue-600 cursor-help font-medium border-b border-dashed border-blue-300 pb-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
          >
            fetch from
            <AnimatePresence>
              {isHovered && (
                <>
                  <motion.div
                    // The tooltip container is absolutely positioned centered above the text
                    className="absolute z-20 bottom-full mb-10 left-1/2 w-[280px] p-5 rounded-2xl bg-white/90 backdrop-blur-md shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 text-sm font-sans text-slate-700 text-left pointer-events-none"
                    // Spring upward from the cursor's exact coordinates
                    style={{ 
                      // Move the transform origin dynamically based on cursor X
                      transformOrigin: `${mousePos.x - spanWidth/2 + 140}px 100%`, 
                      x: "-50%" 
                    }}
                    initial={{ opacity: 0, scale: 0.8, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: -5, transition: { type: "spring", mass: 0.5 } }}
                    exit={{ opacity: 0, scale: 0.8, y: 10, transition: { duration: 0.15 } }}
                  >
                    <p>
                      <strong className="text-slate-900 block mb-2 text-base font-semibold">Standard I/O</strong>
                      Automatically handles retries, caching, and background threading without async/await pollution.
                    </p>
                  </motion.div>
                  
                  {/* Visual connecting bezier line from hovering cursor spot to tooltip bottom-center */}
                  <motion.svg
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    className="absolute pointer-events-none z-10 w-full h-[60px] top-[-60px] left-0 overflow-visible"
                  >
                    <motion.path
                      // Curve starts at center bottom of tooltip, ends at cursor X on the word
                      d={`M ${spanWidth / 2} -10 C ${spanWidth / 2} 15, ${mousePos.x} 15, ${mousePos.x} 40`}
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1, transition: { duration: 0.3 } }}
                    />
                    
                    {/* Tiny dot at the cursor connection point */}
                    <motion.circle
                       cx={mousePos.x}
                       cy={40}
                       r="3"
                       fill="#3b82f6"
                       initial={{ scale: 0 }}
                       animate={{ scale: 1, transition: { delay: 0.1 } }}
                    />
                  </motion.svg>
                </>
              )}
            </AnimatePresence>
          </span>
          {" "}
          <span className="text-orange-500">"api"</span>
          {" "}
          <span className="text-slate-400">into</span>
          {" "}
          <span className="text-teal-600">data</span>
        </div>
      </div>
    </section>
  );
}
