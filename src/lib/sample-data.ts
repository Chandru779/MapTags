import { nanoid } from "nanoid";
import type { Place, Profile, Trip } from "./types";
import { buildRouteFromWaypoints, calculateRouteDistanceKm } from "./geo";

export const defaultProfile: Profile = {
  name: "Chandru",
  title: "Explorer & Map Enthusiast",
  bio: "Documenting every road, ridge, and hidden café along the way. Building tools that turn journeys into stories.",
  location: "Bengaluru, India",
};

const bengaluruToKashmirWaypoints = [
  { id: nanoid(), name: "Bengaluru", lat: 12.9716, lng: 77.5946, order: 0 },
  { id: nanoid(), name: "Hyderabad", lat: 17.385, lng: 78.4867, order: 1 },
  { id: nanoid(), name: "Nagpur", lat: 21.1458, lng: 79.0882, order: 2 },
  { id: nanoid(), name: "Delhi", lat: 28.6139, lng: 77.209, order: 3 },
  { id: nanoid(), name: "Srinagar", lat: 34.0837, lng: 74.7973, order: 4 },
];

const routeCoords = buildRouteFromWaypoints(bengaluruToKashmirWaypoints);

export const sampleTrip: Trip = {
  id: "sample-trip-1",
  title: "Bengaluru → Kashmir Odyssey",
  description:
    "A cross-country road trip from the Silicon Valley of India to the valleys of Kashmir — 2,800+ km of highways, chai stops, and mountain views.",
  waypoints: bengaluruToKashmirWaypoints,
  routeCoordinates: routeCoords,
  distanceKm: calculateRouteDistanceKm(routeCoords),
  color: "#8b5cf6",
  startDate: "2024-10-01",
  endDate: "2024-10-12",
  createdAt: new Date().toISOString(),
};

export const samplePlaces: Place[] = [
  {
    id: nanoid(),
    name: "Lalbagh Botanical Garden",
    lat: 12.9507,
    lng: 77.5848,
    experience:
      "Morning walk among century-old trees before hitting the highway. Perfect send-off from Bengaluru.",
    rating: 5,
    mood: "amazing",
    visitedAt: "2024-10-01",
    tags: ["nature", "morning"],
    tripId: sampleTrip.id,
  },
  {
    id: nanoid(),
    name: "Charminar, Hyderabad",
    lat: 17.3616,
    lng: 78.4747,
    experience:
      "Irani chai and biryani pit stop. The old city at sunset is pure magic.",
    rating: 5,
    mood: "memorable",
    visitedAt: "2024-10-03",
    tags: ["food", "heritage"],
    tripId: sampleTrip.id,
  },
  {
    id: nanoid(),
    name: "Dal Lake, Srinagar",
    lat: 34.1176,
    lng: 74.864,
    experience:
      "Shikara ride at dawn. Mist on the water, mountains everywhere — worth every kilometer.",
    rating: 5,
    mood: "amazing",
    visitedAt: "2024-10-11",
    tags: ["lake", "mountains", "sunrise"],
    tripId: sampleTrip.id,
  },
  {
    id: nanoid(),
    name: "Gokarna Beach",
    lat: 14.547,
    lng: 74.3188,
    experience: "Quiet beaches and cliff-side sunsets. A solo weekend reset.",
    rating: 4,
    mood: "good",
    visitedAt: "2024-06-15",
    tags: ["beach", "solo"],
  },
  {
    id: nanoid(),
    name: "Hampi Ruins",
    lat: 15.335,
    lng: 76.46,
    experience:
      "Boulder-strewn landscapes and Vijayanagara history. Felt like another planet.",
    rating: 5,
    mood: "memorable",
    visitedAt: "2024-03-20",
    tags: ["heritage", "photography"],
  },
  {
    id: nanoid(),
    name: "Munnar Tea Gardens",
    lat: 10.0889,
    lng: 77.0595,
    experience: "Rolling green hills and fresh air. Best chai I've ever tasted.",
    rating: 5,
    mood: "amazing",
    visitedAt: "2023-12-28",
    tags: ["nature", "tea", "hills"],
  },
];
