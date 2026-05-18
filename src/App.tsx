import HeroShader from "./components/HeroShader";
import ExecutionTerminal from "./components/ExecutionTerminal";
import ASTInspector from "./components/ASTInspector";
import DiffViewer from "./components/DiffViewer";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#ffb000] selection:text-black">
      <main>
        {/* Full Viewport Hero Section */}
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
          <HeroShader />
          
          <div className="relative z-10 flex flex-col items-center text-center px-6 pointer-events-none w-full mt-24">
             <h1 className="font-mono text-5xl sm:text-7xl font-bold tracking-tighter mb-12 text-white">
               LAYMAN<span className="text-[#00f0ff] animate-pulse">_</span>
             </h1>
             
             <div className="pointer-events-auto w-full">
               <ExecutionTerminal />
             </div>
             
             <p className="mt-12 text-lg md:text-xl text-[#a3a3a3] font-mono tracking-tight max-w-2xl leading-relaxed">
               The intent-driven, bare-metal compiled language. Build safe, highly concurrent systems without the manual overhead.
             </p>
          </div>
        </section>

        {/* AST Inspector Section */}
        <section className="py-32 w-full bg-[#050505] border-t border-[#333333]">
           <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col items-center text-center mb-16">
                 <div className="text-[#ffb000] text-sm font-bold uppercase tracking-widest mb-4">Static Analysis</div>
                 <h2 className="text-3xl sm:text-5xl font-mono font-bold tracking-tighter text-white max-w-3xl">
                   Deterministic by default.
                 </h2>
                 <p className="mt-6 text-[#a3a3a3] text-lg max-w-2xl mx-auto font-mono">
                   Hover over the tokens below. The compiler understands exactly what memory is allocated and how the CPU executes the intent.
                 </p>
              </div>
              <ASTInspector />
           </div>
        </section>

        {/* Diff Viewer Scroll Section */}
        <DiffViewer />

      </main>

      {/* Brutalist Footer */}
      <footer className="bg-black py-12 border-t border-[#333333] font-mono text-sm text-[#555] text-center relative z-20">
        <div className="max-w-7xl mx-auto px-6">
           <div className="flex justify-between items-center">
             <div>LAYMAN(1) - System Reference Manual</div>
             <div>v0.9.4_alpha</div>
           </div>
        </div>
      </footer>
    </div>
  );
}
