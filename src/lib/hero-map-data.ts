import heroMapPlacesJson from "../../public/data/hero-map-places.json";
import userMe from "../../public/data/user-me.json";

const VIEWBOX = { w: 800, h: 450 } as const;

const GLOW: Record<string, string> = {
  "#8b5cf6": "#c4b5fd",
  "#06b6d4": "#67e8f9",
  "#f97316": "#fdba74",
};

/** Calibrated against pin positions in hero-map-places.json */
const GEO_ANCHORS = [
  { lat: 12.9716, lng: 77.5946, xPct: 48, yPct: 62 },
  { lat: 15.335, lng: 76.46, xPct: 44, yPct: 50 },
  { lat: 14.547, lng: 74.3188, xPct: 38, yPct: 54 },
  { lat: 10.0889, lng: 77.0595, xPct: 47, yPct: 78 },
  { lat: 12.4244, lng: 75.7382, xPct: 42, yPct: 66 },
  { lat: 9.9312, lng: 76.2673, xPct: 40, yPct: 82 },
] as const;

type Affine = { c0: number; c1: number; c2: number };

function fitAffine(
  anchors: readonly { lat: number; lng: number; xPct: number; yPct: number }[],
  axis: "x" | "y"
): Affine {
  const key = axis === "x" ? "xPct" : "yPct";
  let s0 = 0;
  let s1 = 0;
  let s2 = 0;
  let s11 = 0;
  let s22 = 0;
  let s12 = 0;
  let t0 = 0;
  let t1 = 0;
  let t2 = 0;

  for (const a of anchors) {
    const f0 = 1;
    const f1 = a.lng;
    const f2 = a.lat;
    const t = a[key];
    s0 += f0;
    s1 += f1;
    s2 += f2;
    s11 += f1 * f1;
    s22 += f2 * f2;
    s12 += f1 * f2;
    t0 += f0 * t;
    t1 += f1 * t;
    t2 += f2 * t;
  }

  const det =
    s0 * (s11 * s22 - s12 * s12) -
    s1 * (s1 * s22 - s2 * s12) +
    s2 * (s1 * s12 - s2 * s11);

  return {
    c0:
      (t0 * (s11 * s22 - s12 * s12) -
        t1 * (s1 * s22 - s2 * s12) +
        t2 * (s1 * s12 - s2 * s11)) /
      det,
    c1:
      (s0 * (t1 * s22 - t2 * s12) -
        t0 * (s1 * s22 - s2 * s12) +
        t2 * (s1 * t2 - t1 * s2)) /
      det,
    c2:
      (s0 * (s11 * t2 - s12 * t1) -
        s1 * (s1 * t2 - s2 * t1) +
        t0 * (s1 * s12 - s2 * s11)) /
      det,
  };
}

const xAffine = fitAffine(GEO_ANCHORS, "x");
const yAffine = fitAffine(GEO_ANCHORS, "y");

function projectLngLat(lng: number, lat: number) {
  const xPct = xAffine.c0 + xAffine.c1 * lng + xAffine.c2 * lat;
  const yPct = yAffine.c0 + yAffine.c1 * lng + yAffine.c2 * lat;
  return {
    x: (xPct / 100) * VIEWBOX.w,
    y: (yPct / 100) * VIEWBOX.h,
  };
}

function sampleRoute(
  coords: [number, number][],
  step: number
): [number, number][] {
  if (coords.length <= 2) return coords;
  const sampled: [number, number][] = [];
  for (let i = 0; i < coords.length; i += step) {
    sampled.push(coords[i]!);
  }
  const last = coords[coords.length - 1]!;
  if (sampled[sampled.length - 1] !== last) sampled.push(last);
  return sampled;
}

function coordsToPath(coords: [number, number][]): string {
  const points = coords.map(([lng, lat]) => projectLngLat(lng, lat));
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return (
    `M ${first.x.toFixed(1)} ${first.y.toFixed(1)} ` +
    rest.map((p) => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ")
  );
}

export type HeroMapPlace = {
  id: string;
  place: string;
  country: string;
  user: string;
  initials: string;
  trip: string;
  avatarImage: string;
  color: string;
  x: number;
  y: number;
  appearDelay: number;
};

export type HeroMapRoute = {
  id: string;
  path: string;
  color: string;
  glow: string;
  delay: number;
  dotDelay: number;
  label: string;
};

export const heroMapPlaces: HeroMapPlace[] = heroMapPlacesJson.map(
  (place, index) => ({
    ...place,
    appearDelay: 2.8 + index * 0.15,
  })
);

export const heroMapRoutes: HeroMapRoute[] = userMe.trips.map((trip, index) => {
  const step = Math.max(1, Math.floor(trip.routeCoordinates.length / 28));
  const path = coordsToPath(
    sampleRoute(trip.routeCoordinates as [number, number][], step)
  );
  const color = trip.color;
  return {
    id: trip.id,
    path,
    color,
    glow: GLOW[color] ?? color,
    delay: 0.4 + index * 0.6,
    dotDelay: 3.2 + index * 0.6,
    label: trip.title,
  };
});
