import { useEffect, useRef } from "react";
import anime from "animejs";

const COLS = 40;
const ROWS = 20;

export default function LexerGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous if any
    container.innerHTML = "";

    const total = COLS * ROWS;
    for (let i = 0; i < total; i++) {
        const span = document.createElement("span");
        span.classList.add("grid-item", "inline-block", "w-4", "h-4", "text-center", "select-none", "text-slate-300", "font-mono", "text-xs", "font-bold", "opacity-40");
        span.textContent = ".";
        span.dataset.index = i.toString();
        
        span.addEventListener("mouseenter", (e) => {
            const index = parseInt((e.target as HTMLSpanElement).dataset.index || "0");
            
            if (animationRef.current) {
                // Not pausing, letting it overlap or create multiple ripples is fine,
                // but for strict mechanical feel, maybe we constrain it.
                // Let's create a new animation so ripples can overlap mathematically.
            }

            anime({
                targets: '.grid-item',
                scale: [
                    { value: 2, easing: 'easeOutSine', duration: 250 },
                    { value: 1, easing: 'easeInOutQuad', duration: 500 }
                ],
                color: [
                    { value: '#3b82f6', easing: 'easeOutSine', duration: 250 },
                    { value: '#cbd5e1', easing: 'easeInOutQuad', duration: 500 } // slate-300 is roughly cbd5e1
                ],
                opacity: [
                    { value: 1, easing: 'easeOutSine', duration: 250 },
                    { value: 0.4, easing: 'easeInOutQuad', duration: 500 }
                ],
                delay: anime.stagger(50, { grid: [COLS, ROWS], from: index }),
                begin: function(anim) {
                   // Changing text content dynamically isn't natively supported staggered via anime configuration easily
                   // without using the update callback or a loop per target, but scale/color is native.
                }
            });
        });

        container.appendChild(span);
    }
  }, []);

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-50 overflow-hidden pointer-events-auto">
       <div 
         ref={containerRef} 
         className="grid gap-1"
         style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
       >
       </div>
    </div>
  );
}
