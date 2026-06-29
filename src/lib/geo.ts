import { lineString } from "@turf/helpers";
import length from "@turf/length";
import bbox from "@turf/bbox";
import type { Waypoint } from "./types";

export function buildRouteFromWaypoints(
  waypoints: Waypoint[]
): [number, number][] {
  const sorted = [...waypoints].sort((a, b) => a.order - b.order);
  return sorted.map((wp) => [wp.lng, wp.lat] as [number, number]);
}

export function calculateRouteDistanceKm(
  coordinates: [number, number][]
): number {
  if (coordinates.length < 2) return 0;
  const route = lineString(coordinates);
  return length(route, { units: "kilometers" });
}

export function getBoundsFromCoordinates(
  coordinates: [number, number][]
): [[number, number], [number, number]] | null {
  if (coordinates.length === 0) return null;
  const [minLng, minLat, maxLng, maxLat] = bbox(lineString(coordinates));
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

export function getBoundsFromPoints(
  points: { lat: number; lng: number }[]
): [[number, number], [number, number]] | null {
  if (points.length === 0) return null;
  const coordinates = points.map((p) => [p.lng, p.lat] as [number, number]);
  return getBoundsFromCoordinates(coordinates);
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { "Accept-Language": "en" } }
    );
    if (!res.ok) return "Unknown location";
    const data = await res.json();
    const city =
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.state;
    const country = data.address?.country;
    if (city && country) return `${city}, ${country}`;
    return data.display_name?.split(",").slice(0, 2).join(",") || "New place";
  } catch {
    return "New place";
  }
}

export const TRIP_COLORS = [
  "#8b5cf6",
  "#f97316",
  "#3b82f6",
  "#ec4899",
  "#06b6d4",
  "#eab308",
  "#6366f1",
];
