"use client";

import { HeroMapCanvas } from "@/components/home/hero-map-canvas";

export function HeroMapPreview() {
  return (
    <div className="relative aspect-video overflow-hidden bg-gradient-to-b from-[#0f0d18] to-[#080610]">
      <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-56 w-56 translate-x-1/2 rounded-full bg-cyan-600/8 blur-[70px]" />

      <div className="hero-map-stage flex h-full items-center justify-center px-6 py-5 sm:px-10 sm:py-7">
        <div className="hero-map-tilt relative h-full w-full max-w-3xl">
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#0c0a14] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.55)]">
            <HeroMapCanvas />
          </div>
        </div>
      </div>
    </div>
  );
}
