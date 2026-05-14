'use client';

export function FloatingCTA() {
  return (
    <div className="fixed bottom-5 left-1/2 z-40 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/80 px-5 py-3 shadow-soft backdrop-blur-xl md:block">
      <a href="#booking" className="inline-flex items-center gap-3 text-sm font-semibold text-white transition hover:text-brand-300">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-400/10 text-brand-100">📅</span>
        Check availability and book direct
      </a>
    </div>
  );
}
