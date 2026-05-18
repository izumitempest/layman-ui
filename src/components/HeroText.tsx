import { useEffect, useRef } from "react";
import anime from "animejs";

export default function HeroText() {
  const containerRef = useRef<HTMLDivElement>(null);
  const words = "The programming language for everyone else.".split(" ");

  useEffect(() => {
    // Animate the text reveal using a strict step function / easeOutExpo combination
    anime.timeline()
      .add({
        targets: '.caret-block',
        scaleY: [0, 1],
        duration: 300,
        easing: 'easeOutExpo',
        delay: anime.stagger(30)
      })
      .add({
        targets: '.char-text',
        translateY: ['110%', '0%'],
        duration: 400,
        easing: 'easeOutExpo',
        delay: anime.stagger(30)
      }, 150) // offset
      .add({
        targets: '.caret-block',
        scaleX: [1, 0],
        duration: 400,
        easing: 'easeOutExpo',
        delay: anime.stagger(30)
      }, 150);
  }, []);

  return (
    <div ref={containerRef} className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter max-w-5xl leading-[0.85] text-slate-900 pointer-events-none">
      {words.map((word, i) => (
        <span key={i} className="inline-block mr-[0.25em] whitespace-nowrap">
          {word.split('').map((char, j) => (
            <span key={j} className="relative inline-block overflow-hidden px-[0.02em] pb-2 align-bottom">
              <span className="char-text block transform translate-y-full">{char}</span>
              <span 
                className="caret-block absolute inset-0 bg-slate-900" 
                style={{ transformOrigin: '100% 100%', transform: 'scaleY(0)' }} 
              />
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
