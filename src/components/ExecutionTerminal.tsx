import { motion } from "motion/react";
import { useEffect, useState } from "react";

const mechTransition = { type: "spring", stiffness: 400, damping: 40 };

const logs = [
  "> layman build core.dvn",
  "[INFO] Running static type inference... OK",
  "[INFO] Mapping goroutines... OK",
  "[SUCCESS] Native binary compiled in 0.4ms"
];

export default function ExecutionTerminal() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Slight delay before "executing"
    const t = setTimeout(() => setStarted(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto border border-[#333333] bg-[#050505]/90 backdrop-blur-md shadow-2xl p-6 font-mono text-sm sm:text-base leading-relaxed text-[#a3a3a3]">
       <div className="flex space-x-2 mb-6 border-b border-[#333333] pb-3">
         <span className="w-3 h-3 bg-[#333333] rounded-sm"></span>
         <span className="w-3 h-3 bg-[#333333] rounded-sm"></span>
         <span className="w-3 h-3 bg-[#333333] rounded-sm"></span>
         <div className="absolute top-6 right-6 text-xs text-[#555]">PID: 29014 (root)</div>
       </div>
       
       <div className="flex flex-col space-y-3 min-h-[160px]">
          {started && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.25 } }
              }}
            >
              {logs.map((log, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0, transition: mechTransition }
                  }}
                  className="whitespace-pre overflow-hidden"
                >
                  {log.includes("[SUCCESS]") ? (
                     <span className="text-[#ffb000] font-bold">{log}</span>
                  ) : log.includes(">") ? (
                     <span className="text-white font-bold">{log}</span>
                  ) : (
                     <span>{log}</span>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
          {!started && <div className="h-full w-full"></div>}
       </div>
    </div>
  );
}
