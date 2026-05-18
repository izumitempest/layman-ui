import { useState, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

const mechTransition = { type: "spring", stiffness: 400, damping: 40 };

type TokenProps = {
  children: ReactNode;
  metadata: { type: string; memory: string; addr: string } | null;
};

function Token({ children, metadata }: TokenProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span 
      className="relative cursor-crosshair inline-block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`transition-colors duration-150 ${isHovered ? 'bg-[#ffb000]/20 text-[#ffb000]' : ''}`}>
        {children}
      </span>

      <AnimatePresence>
        {isHovered && metadata && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={mechTransition}
            className="absolute left-1/2 -translate-x-1/2 bottom-full mb-8 z-50 pointer-events-none"
          >
             {/* The raw data tooltip */}
             <div className="bg-black border border-[#333333] p-4 min-w-[280px] shadow-2xl flex flex-col space-y-2">
                <div className="text-xs text-[#555] font-mono border-b border-[#333333] pb-2 mb-1">
                  COMPILER.AST_NODE_INF.SYS
                </div>
                <div className="flex space-x-2 text-sm justify-between">
                  <span className="text-[#a3a3a3]">Type:</span> 
                  <span className="text-[#ffb000]">{metadata.type}</span>
                </div>
                <div className="flex space-x-2 text-sm justify-between">
                  <span className="text-[#a3a3a3]">Mem:</span> 
                  <span className="text-white">{metadata.memory}</span>
                </div>
                <div className="flex space-x-2 text-sm justify-between">
                  <span className="text-[#a3a3a3]">Addr:</span> 
                  <span className="text-white">{metadata.addr}</span>
                </div>
             </div>
             
             {/* Mechanical SVG Line connecting tooltip to text */}
             <svg className="absolute top-full left-1/2 -translate-x-1/2 w-[20px] h-[32px] overflow-visible" fill="none">
               <motion.path 
                 initial={{ pathLength: 0 }}
                 animate={{ pathLength: 1 }}
                 transition={mechTransition}
                 d="M 10 0 L 10 32"
                 stroke="#ffb000" 
                 strokeWidth="2" 
               />
               <circle cx="10" cy="32" r="3" fill="#ffb000" />
             </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function ASTInspector() {
  return (
    <div className="w-full max-w-4xl mx-auto border border-[#333333] bg-black p-8 font-mono text-sm leading-8 text-[#d4d4d4] shadow-2xl">
      <div className="mb-6 flex justify-between items-center pb-4 border-b border-[#333333]">
         <div className="text-[#ffb000] text-xs font-bold uppercase tracking-widest">Live AST Memory Map</div>
         <div className="text-[#555] text-xs">core.dvn</div>
      </div>
      
      <div>
        <span className="text-[#569cd6]">fn</span> <span className="text-[#dcdcaa]">calculate_trajectory</span>(<span className="text-[#9cdcfe]">mass</span>) {'{'}
        <br />
        &nbsp;&nbsp;
        <Token metadata={{ type: 'Inferred Float64', memory: '8 bytes', addr: '0x1A4B' }}>
          <span className="text-[#569cd6]">let</span>
        </Token> result = mass * <span className="text-[#b5cea8]">9.81</span>;
        <br />
        &nbsp;&nbsp;
        <Token metadata={{ type: 'Native Goroutine', memory: 'Buffered(1)', addr: '0x2F8C' }}>
          <span className="text-[#c586c0]">in background</span>
        </Token> {'{'}
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;sync_telemetry(result);
        <br />
        &nbsp;&nbsp;{'}'}
        <br />
        &nbsp;&nbsp;<span className="text-[#c586c0]">return</span> result;
        <br />
        {'}'}
      </div>
    </div>
  );
}
