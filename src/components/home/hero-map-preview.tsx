"use client";

import { useState } from "react";
import { heroMapPlaces, heroMapRoutes } from "@/lib/hero-map-data";

function AnimatedRoute({
  path,
  color,
  glow,
  delay,
  dotDelay,
}: {
  path: string;
  color: string;
  glow: string;
  delay: number;
  dotDelay: number;
}) {
  const flowDelay = delay + 2.4;

  return (
    <g>
      <path
        d={path}
        stroke={glow}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        className="hero-route-glow"
        style={{ animationDelay: `${delay}s, ${delay + 2.4}s` }}
      />
      <path
        d={path}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        className="hero-route-line"
        style={{ animationDelay: `${delay}s` }}
      />
      <path
        d={path}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="hero-route-flow"
        style={{
          animationDelay: `${flowDelay}s, ${flowDelay}s`,
        }}
      />
      <circle r="4" fill={color} opacity="0.95">
        <animateMotion
          dur="4.5s"
          begin={`${dotDelay}s`}
          repeatCount="indefinite"
          path={path}
        />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          dur="4.5s"
          begin={`${dotDelay}s`}
          repeatCount="indefinite"
        />
      </circle>
    </g>
  );
}

function PinAvatar({
  src,
  alt,
  initials,
  color,
  size = 40,
}: {
  src: string;
  alt: string;
  initials: string;
  color: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="flex items-center justify-center rounded-full border-2 border-[#0c0a14] font-semibold text-white"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.32,
          background: `linear-gradient(135deg, ${color}, ${color}88)`,
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full border-2 border-[#0c0a14] object-cover"
      style={{ width: size, height: size }}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

function ExplorerPin({
  spot,
  isHovered,
  onEnter,
  onLeave,
}: {
  spot: (typeof heroMapPlaces)[number];
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="hero-map-pin absolute z-10"
      style={{
        left: `${spot.x}%`,
        top: `${spot.y}%`,
        animationDelay: `${spot.appearDelay}s`,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        className="group relative block -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 outline-none"
        aria-label={`${spot.user} visited ${spot.place}`}
      >
        <div
          className="absolute left-1/2 top-full h-3 w-px -translate-x-1/2 bg-gradient-to-b from-white/40 to-transparent opacity-60 transition-opacity group-hover:opacity-100"
          aria-hidden
        />

        <div className="relative transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5">
          <div
            className="absolute -inset-1 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: spot.color }}
          />
          <div
            className="relative rounded-full p-0.5"
            style={{
              background: `linear-gradient(135deg, ${spot.color}, ${spot.color}99)`,
              boxShadow: isHovered
                ? `0 0 0 4px ${spot.color}40, 0 12px 28px ${spot.color}55`
                : `0 4px 16px ${spot.color}40`,
            }}
          >
            <PinAvatar
              src={spot.avatarImage}
              alt={spot.place}
              initials={spot.initials}
              color={spot.color}
            />
          </div>
        </div>

        <div
          className={`pointer-events-none absolute left-1/2 top-[calc(100%+14px)] z-20 -translate-x-1/2 rounded-xl border border-white/10 bg-[#14101f]/95 px-3 py-2 text-center shadow-2xl transition-all duration-300 ${
            isHovered
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-1 scale-95 opacity-0"
          }`}
        >
          <p className="whitespace-nowrap text-xs font-semibold text-white">
            {spot.place}
          </p>
          <p className="whitespace-nowrap text-[10px] text-white/45">
            {spot.country}
          </p>
          <p
            className="mt-1 whitespace-nowrap text-[9px] font-medium"
            style={{ color: spot.color }}
          >
            {spot.trip}
          </p>
        </div>
      </button>
    </div>
  );
}

export function HeroMapPreview() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative aspect-video overflow-hidden bg-gradient-to-b from-[#0f0d18] to-[#080610]">
      <div className="pointer-events-none absolute left-1/4 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[80px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-56 w-56 translate-x-1/2 rounded-full bg-cyan-600/8 blur-[70px]" />

      <div className="hero-map-stage flex h-full items-center justify-center px-6 py-5 sm:px-10 sm:py-7">
        <div className="hero-map-tilt relative h-full w-full max-w-3xl">
          <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#0c0a14]/90 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.55)]">
            <div className="hero-map-drift relative h-full w-full">
              {/* Subtle India silhouette */}
              <div
                className="pointer-events-none absolute inset-0 bg-[url('/india-map-skeleton.svg')] bg-center bg-no-repeat opacity-[0.32]"
                style={{ backgroundSize: "88% auto" }}
                aria-hidden
              />

              {/* Infinite drifting grid */}
              <div
                className="hero-map-grid pointer-events-none absolute inset-[-36px] opacity-[0.045]"
                style={{
                  backgroundImage:
                    "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                  backgroundSize: "36px 36px",
                }}
              />

              {/* Glowing animated routes */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 800 450"
                preserveAspectRatio="xMidYMid meet"
                fill="none"
                aria-hidden
              >
                {heroMapRoutes.map((route) => (
                  <AnimatedRoute key={route.id} {...route} />
                ))}
              </svg>

              {/* Explorer pins */}
              {heroMapPlaces.map((spot) => (
                <ExplorerPin
                  key={spot.id}
                  spot={spot}
                  isHovered={hoveredId === spot.id}
                  onEnter={() => setHoveredId(spot.id)}
                  onLeave={() => setHoveredId(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
