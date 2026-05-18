import { motion, useReducedMotion } from "motion/react";
import HeroCanvas from "./components/HeroCanvas";
import StickyMorph from "./components/StickyMorph";
import HighFidelityTooltip from "./components/HighFidelityTooltip";
import Terminal from "./components/Terminal";

const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

const childVariant = {
  hidden: { y: 50, opacity: 0, rotateX: -90 },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { type: "spring", damping: 20, stiffness: 100 },
  },
};

const words = "The programming language for everyone else.".split(" ");

export default function App() {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <main>
        {/* Full Viewport Hero Section */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          <HeroCanvas />
          
          <div className="relative z-10 flex flex-col items-center text-center px-6 pointer-events-none">
             <motion.h1 
                variants={containerVariant}
                initial="hidden"
                animate="visible"
                className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter max-w-5xl leading-[0.85] text-slate-900"
                style={{ perspective: "1000px" }}
             >
                {words.map((word, i) => (
                  <motion.span 
                     key={i} 
                     variants={shouldReduceMotion ? {} : childVariant}
                     className="inline-block mr-[0.25em]"
                     style={{ transformOrigin: "bottom center" }}
                  >
                    {word}
                  </motion.span>
                ))}
             </motion.h1>
             
             <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-8 text-xl md:text-3xl text-slate-600 font-medium tracking-tight max-w-3xl leading-snug"
             >
               Turing-complete. Compiles to standalone executables. Reads like plain English.
             </motion.p>
             
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="mt-12 flex space-x-4 pointer-events-auto"
             >
               <a href="#" className="px-8 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-lg">
                 Read the Docs
               </a>
               <a href="#" className="px-8 py-3 rounded-full bg-white text-slate-900 font-medium border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                 GitHub
               </a>
             </motion.div>
          </div>
          
          {/* Scroll Down Indicator */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 2, duration: 1 }}
             className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400"
          >
            <div className="w-[1px] h-16 bg-gradient-to-b from-slate-300 to-transparent mx-auto mb-2 animate-pulse" />
          </motion.div>
        </section>

        {/* Morphing Sticky Code Section */}
        <StickyMorph />
        
        {/* Hover Kinematics Tooltip Section */}
        <HighFidelityTooltip />
        
        {/* Terminal Micro-interactions Section */}
        <section className="w-full bg-slate-50 relative z-20 py-24 border-b border-slate-200 flex flex-col items-center">
            <div className="text-center px-6 mb-8 max-w-2xl">
              <h3 className="font-display text-4xl sm:text-5xl font-extrabold mb-4 tracking-tighter text-slate-900 leading-tight">
                 Run everywhere.
              </h3>
              <p className="text-lg text-slate-600">
                 Compile once, execute seamlessly on macOS, Linux, and Windows. 
                 Get started in seconds.
              </p>
            </div>
            <Terminal />
        </section>
        
        {/* Simple Footer */}
        <footer className="w-full bg-slate-50 py-12 text-center text-slate-500 relative z-20">
          <p>&copy; {new Date().getFullYear()} Layman Systems. "The programming language for everyone else."</p>
        </footer>
      </main>
    </div>
  );
}
