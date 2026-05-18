import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CopyIcon, CheckIcon } from "lucide-react";

const commandToType = "curl -fsSL https://get.layman.dev | bash";

export default function Terminal() {
  const [typedText, setTypedText] = useState("");
  const [isTypingStarted, setIsTypingStarted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isTypingStarted) return;
    
    let currentIndex = 0;
    setTypedText(""); // Reset text on start

    const interval = setInterval(() => {
      setTypedText(commandToType.slice(0, currentIndex + 1));
      currentIndex++;
      
      if (currentIndex === commandToType.length) {
        clearInterval(interval);
      }
    }, 50); // Type at 50ms per character

    return () => clearInterval(interval);
  }, [isTypingStarted]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commandToType);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-24 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        onViewportEnter={() => setIsTypingStarted(true)}
        className="rounded-xl overflow-hidden bg-white/50 backdrop-blur-xl border border-slate-200 shadow-sm"
      >
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-3 bg-slate-100/50 border-b border-slate-200">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
          </div>
          <div className="mx-auto text-xs font-medium text-slate-500">
            layman-installer &mdash; bash
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 md:p-8 flex items-center justify-between font-mono text-sm sm:text-base text-slate-800 bg-[#f8fafc]">
          <div className="flex items-center min-h-[1.5rem]">
            <span className="text-slate-400 select-none mr-3">$</span>
            <span className="relative">
              {typedText}
              {isTypingStarted && typedText.length < commandToType.length && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="absolute ml-1 w-2 h-4 bg-slate-400 inline-block top-1"
                />
              )}
            </span>
          </div>

          <motion.button
            onClick={handleCopy}
            className="group relative ml-4 p-2 rounded-md hover:bg-slate-200 transition-colors focus:outline-none"
            aria-label="Copy to clipboard"
            animate={{ 
              boxShadow: isCopied 
                ? "0px 0px 20px rgba(34, 197, 94, 0.4)" 
                : "0px 0px 0px rgba(34, 197, 94, 0)" 
            }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {isCopied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CheckIcon className="w-5 h-5 text-green-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <CopyIcon className="w-5 h-5 text-slate-500 group-hover:text-slate-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
