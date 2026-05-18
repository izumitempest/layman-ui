import { useEffect } from "react";
import anime from "animejs";
import LexerGrid from "./components/LexerGrid";
import HeroText from "./components/HeroText";
import StickyMorph from "./components/StickyMorph";
import HighFidelityTooltip from "./components/HighFidelityTooltip";
import Terminal from "./components/Terminal";

export default function App() {
  useEffect(() => {
    anime.timeline()
      .add({
        targets: '.hero-fade-in',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: anime.stagger(200, { start: 1000 })
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <main>
        {/* Full Viewport Hero Section */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          <LexerGrid />
          
          <div className="relative z-10 flex flex-col items-center text-center px-6 pointer-events-none">
             <HeroText />
             
             <p className="hero-fade-in mt-8 text-xl md:text-3xl text-slate-600 font-medium tracking-tight max-w-3xl leading-snug opacity-0">
               Turing-complete. Compiles to standalone executables. Reads like plain English.
             </p>
             
             <div className="hero-fade-in mt-12 flex space-x-4 pointer-events-auto opacity-0">
               <a href="#" className="px-8 py-3 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors shadow-lg">
                 Read the Docs
               </a>
               <a href="#" className="px-8 py-3 rounded-full bg-white text-slate-900 font-medium border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                 GitHub
               </a>
             </div>
          </div>
          
          {/* Scroll Down Indicator */}
          <div className="hero-fade-in absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400 pointer-events-none opacity-0">
            <div className="w-[1px] h-16 bg-gradient-to-b from-slate-300 to-transparent mx-auto mb-2 animate-pulse" />
          </div>
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
