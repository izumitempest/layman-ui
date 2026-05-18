import { useRef, useMemo } from "react";
import anime from "animejs";

const COLS = 40;
const ROWS = 20;

export default function LexerGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastAnimatedIndex = useRef<number>(-1);

  // Use useMemo to generate the grid geometry once instead of manipulating the DOM
  const cells = useMemo(() => Array.from({ length: COLS * ROWS }), []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Calculate precise grid cell based on pointer coordinates
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const cellWidth = rect.width / COLS;
    const cellHeight = rect.height / ROWS;
    
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);
    
    // Out of bounds check
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
    
    const index = row * COLS + col;
    
    // Prevent spamming animations for the same index
    if (index === lastAnimatedIndex.current) return; 
    lastAnimatedIndex.current = index;

    // Event Delegation: Select only the hovered cell and its immediate neighbors 
    // to prevent layout thrashing on 800+ elements.
    const targets: HTMLElement[] = [];
    const radius = 2; // Spread effect radius
    
    for (let r = Math.max(0, row - radius); r <= Math.min(ROWS - 1, row + radius); r++) {
       for (let c = Math.max(0, col - radius); c <= Math.min(COLS - 1, col + radius); c++) {
           const idx = r * COLS + c;
           const el = containerRef.current.children[idx] as HTMLElement;
           if (el) targets.push(el);
       }
    }

    // High performance orchestration for the targeted subset
    anime({
        targets,
        scale: [
            { value: 2, easing: 'easeOutSine', duration: 200 },
            { value: 1, easing: 'easeInOutQuad', duration: 400 }
        ],
        color: [
            { value: '#3b82f6', easing: 'easeOutSine', duration: 200 },
            { value: '#cbd5e1', easing: 'easeInOutQuad', duration: 400 } // slate-300 fallback
        ],
        opacity: [
            { value: 1, easing: 'easeOutSine', duration: 200 },
            { value: 0.4, easing: 'easeInOutQuad', duration: 400 }
        ]
    });
  };

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-50 overflow-hidden pointer-events-auto">
       <div 
         ref={containerRef} 
         className="grid gap-1"
         style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
         onPointerMove={handlePointerMove}
       >
         {cells.map((_, i) => (
            <span
              key={i}
              className="grid-item inline-block w-4 h-4 text-center select-none text-slate-300 font-mono text-xs font-bold opacity-40 transition-none"
            >
              .
            </span>
         ))}
       </div>
    </div>
  );
}
