import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "../public/data");
const explorersDir = path.join(dataDir, "explorers");

async function roadRoute(waypoints, maxPts = 120) {
  const coordStr = waypoints.map(([lng, lat]) => `${lng},${lat}`).join(";");
  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`
  );
  const data = await res.json();
  if (!data.routes?.[0]) throw new Error("OSRM failed for " + coordStr);
  const all = data.routes[0].geometry.coordinates;
  const step = Math.max(1, Math.floor(all.length / maxPts));
  return {
    routeCoordinates: all.filter((_, i) => i % step === 0),
    distanceKm: Math.round(data.routes[0].distance / 100) / 10,
  };
}

function heatZone(id, name, center, radiusDeg, intensity, hours, photos) {
  const [lng, lat] = center;
  const d = radiusDeg;
  return {
    id,
    name,
    intensity,
    timeSpentHours: hours,
    photoCount: photos,
    polygon: [
      [lng - d, lat - d],
      [lng + d, lat - d],
      [lng + d, lat + d],
      [lng - d, lat + d],
      [lng - d, lat - d],
    ],
  };
}

const photos = {
  hampi: "https://images.unsplash.com/photo-1596176530439-9f598cec6a73?w=600&h=400&fit=crop",
  gokarna: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
  munnar: "https://images.unsplash.com/photo-1593693397649-85e858f9660e?w=600&h=400&fit=crop",
  lalbagh: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop",
  coorg: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
  reykjavik: "https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=600&h=400&fit=crop",
  tokyo: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
  machu: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&h=400&fit=crop",
  serengeti: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=600&h=400&fit=crop",
};

async function buildMe() {
  const trip1Route = await roadRoute([
    [77.5946, 12.9716],
    [76.46, 15.335],
    [74.3188, 14.547],
  ]);
  const trip2Route = await roadRoute([
    [77.0595, 10.0889],
    [77.1603, 9.9658],
    [76.2673, 9.9312],
  ]);
  const trip3Route = await roadRoute([
    [75.7382, 12.4244],
    [75.7754, 13.3161],
    [76.0833, 12.2958],
  ]);

  const userMe = {
    profile: {
      name: "Chandru",
      title: "Product engineer & weekend explorer",
      bio: "Explorer on mapTag — documenting road trips across South India with map-first travel storytelling.",
      location: "Bengaluru, India",
    },
    trips: [
      {
        id: "trip-south-heritage",
        title: "South India Heritage Loop",
        description:
          "Weekend circuits through Hampi boulders and Gokarna cliffs — 644 km of highways and coastal roads.",
        waypoints: [
          { id: "wp-blru", name: "Bengaluru", lat: 12.9716, lng: 77.5946, order: 0 },
          { id: "wp-hampi", name: "Hampi", lat: 15.335, lng: 76.46, order: 1 },
          { id: "wp-gokarna", name: "Gokarna", lat: 14.547, lng: 74.3188, order: 2 },
        ],
        routeCoordinates: trip1Route.routeCoordinates,
        distanceKm: trip1Route.distanceKm,
        color: "#8b5cf6",
        startDate: "2024-03-15",
        endDate: "2024-03-20",
        createdAt: "2024-03-21T10:00:00.000Z",
      },
      {
        id: "trip-kerala-tea",
        title: "Kerala Tea Trail",
        description:
          "Munnar hills to Kochi backwaters — misty plantations and spice markets along 162 km of ghats.",
        waypoints: [
          { id: "wp-munnar", name: "Munnar", lat: 10.0889, lng: 77.0595, order: 0 },
          { id: "wp-thekkady", name: "Thekkady", lat: 9.9658, lng: 77.1603, order: 1 },
          { id: "wp-kochi", name: "Kochi", lat: 9.9312, lng: 76.2673, order: 2 },
        ],
        routeCoordinates: trip2Route.routeCoordinates,
        distanceKm: trip2Route.distanceKm,
        color: "#06b6d4",
        startDate: "2023-12-26",
        endDate: "2023-12-30",
        createdAt: "2023-12-31T10:00:00.000Z",
      },
      {
        id: "trip-ghats-monsoon",
        title: "Western Ghats Monsoon Run",
        description:
          "Coorg coffee estates to Chikmagalur ridges — 292 km through monsoon clouds and waterfall stops.",
        waypoints: [
          { id: "wp-coorg", name: "Coorg", lat: 12.4244, lng: 75.7382, order: 0 },
          { id: "wp-chik", name: "Chikmagalur", lat: 13.3161, lng: 75.7754, order: 1 },
          { id: "wp-hassan", name: "Hassan", lat: 12.2958, lng: 76.0833, order: 2 },
        ],
        routeCoordinates: trip3Route.routeCoordinates,
        distanceKm: trip3Route.distanceKm,
        color: "#f97316",
        startDate: "2024-07-10",
        endDate: "2024-07-13",
        createdAt: "2024-07-14T10:00:00.000Z",
      },
    ],
    places: [
      {
        id: "place-lalbagh",
        name: "Lalbagh Botanical Garden",
        lat: 12.9507,
        lng: 77.5848,
        experience: "Pre-trip morning walk among century-old trees.",
        rating: 5,
        mood: "amazing",
        visitedAt: "2024-03-15",
        tags: ["nature", "morning"],
        tripId: "trip-south-heritage",
        photos: [photos.lalbagh],
        timeSpentHours: 2.5,
        photoCount: 18,
      },
      {
        id: "place-hampi",
        name: "Hampi Ruins",
        lat: 15.335,
        lng: 76.46,
        experience: "Boulder-strewn landscapes and Vijayanagara history at golden hour.",
        rating: 5,
        mood: "memorable",
        visitedAt: "2024-03-18",
        tags: ["heritage", "photography"],
        tripId: "trip-south-heritage",
        photos: [photos.hampi, photos.lalbagh],
        timeSpentHours: 8,
        photoCount: 64,
      },
      {
        id: "place-gokarna",
        name: "Gokarna Beach",
        lat: 14.547,
        lng: 74.3188,
        experience: "Cliff-side sunsets and quiet coves after the heritage loop.",
        rating: 4,
        mood: "good",
        visitedAt: "2024-03-20",
        tags: ["beach", "sunset"],
        tripId: "trip-south-heritage",
        photos: [photos.gokarna],
        timeSpentHours: 6,
        photoCount: 42,
      },
      {
        id: "place-munnar",
        name: "Munnar Tea Gardens",
        lat: 10.0889,
        lng: 77.0595,
        experience: "Rolling green hills and fresh air — best chai on the trail.",
        rating: 5,
        mood: "amazing",
        visitedAt: "2023-12-27",
        tags: ["nature", "tea", "hills"],
        tripId: "trip-kerala-tea",
        photos: [photos.munnar],
        timeSpentHours: 5,
        photoCount: 55,
      },
      {
        id: "place-coorg",
        name: "Coorg Coffee Estate",
        lat: 12.4244,
        lng: 75.7382,
        experience: "Estate tour and monsoon mist over cardamom plantations.",
        rating: 5,
        mood: "memorable",
        visitedAt: "2024-07-11",
        tags: ["coffee", "monsoon"],
        tripId: "trip-ghats-monsoon",
        photos: [photos.coorg],
        timeSpentHours: 4,
        photoCount: 31,
      },
    ],
    heatZones: [
      heatZone("hz-hampi", "Hampi exploration zone", [76.46, 15.335], 0.08, 0.95, 8, 64),
      heatZone("hz-gokarna", "Gokarna coast", [74.3188, 14.547], 0.06, 0.75, 6, 42),
      heatZone("hz-munnar", "Munnar plantations", [77.0595, 10.0889], 0.07, 0.85, 5, 55),
    ],
    photoHotspots: [
      { lat: 15.335, lng: 76.46, weight: 1.0, placeId: "place-hampi" },
      { lat: 14.547, lng: 74.3188, weight: 0.7, placeId: "place-gokarna" },
      { lat: 10.0889, lng: 77.0595, weight: 0.85, placeId: "place-munnar" },
      { lat: 12.4244, lng: 75.7382, weight: 0.6, placeId: "place-coorg" },
      { lat: 12.9507, lng: 77.5848, weight: 0.4, placeId: "place-lalbagh" },
    ],
  };

  fs.writeFileSync(
    path.join(dataDir, "user-me.json"),
    JSON.stringify(userMe, null, 2)
  );
  console.log("Wrote user-me.json");
}

async function buildExplorer(id, explorer) {
  const tripRoutes = [];
  for (const trip of explorer.trips) {
    const wps = trip.waypoints.map((w) => [w.lng, w.lat]);
    const route = await roadRoute(wps);
    trip.routeCoordinates = route.routeCoordinates;
    trip.distanceKm = route.distanceKm;
    tripRoutes.push(trip.id);
  }
  fs.writeFileSync(
    path.join(explorersDir, `${id}.json`),
    JSON.stringify(explorer, null, 2)
  );
  console.log("Wrote explorers/" + id + ".json", tripRoutes.join(", "));
  return {
    id,
    name: explorer.profile.name,
    title: explorer.profile.title,
    location: explorer.profile.location,
    bio: explorer.profile.bio,
    avatar: explorer.profile.avatar,
    stats: explorer.stats,
    highlightTrip: explorer.trips[0]?.title,
    tags: explorer.tags,
  };
}

async function main() {
  fs.mkdirSync(explorersDir, { recursive: true });

  await buildMe();

  const summaries = [];

  summaries.push(
    await buildExplorer("maya-k", {
      profile: {
        name: "Maya K.",
        title: "Landscape photographer",
        bio: "Chasing auroras and volcanic coastlines across Iceland's ring road.",
        location: "Reykjavík, Iceland",
        avatar: "MK",
      },
      tags: ["photography", "nordic", "solo"],
      stats: {
        totalPlaces: 14,
        totalTrips: 2,
        totalDistanceKm: 1850,
        countriesVisited: 3,
      },
      trips: [
        {
          id: "trip-iceland-ring",
          title: "Iceland Ring Road",
          description: "10-day circumnavigation — waterfalls, black sand, and midnight sun.",
          waypoints: [
            { id: "w1", name: "Reykjavík", lat: 64.1466, lng: -21.9426, order: 0 },
            { id: "w2", name: "Vík", lat: 63.4186, lng: -19.006, order: 1 },
            { id: "w3", name: "Akureyri", lat: 65.6835, lng: -18.1262, order: 2 },
          ],
          color: "#3b82f6",
          startDate: "2024-06-01",
          endDate: "2024-06-10",
          createdAt: "2024-06-11T10:00:00.000Z",
        },
      ],
      places: [
        {
          id: "p-reyk",
          name: "Reykjavík Harbour",
          lat: 64.1466,
          lng: -21.9426,
          experience: "Harbour walk at 11pm daylight — surreal for a Bangalorean.",
          rating: 5,
          mood: "amazing",
          visitedAt: "2024-06-01",
          tags: ["harbour", "nordic"],
          tripId: "trip-iceland-ring",
          photos: [photos.reykjavik],
          timeSpentHours: 3,
          photoCount: 28,
        },
      ],
      heatZones: [
        heatZone("hz-reyk", "Reykjavík centre", [-21.9426, 64.1466], 0.05, 0.8, 3, 28),
      ],
      photoHotspots: [
        { lat: 64.1466, lng: -21.9426, weight: 0.9, placeId: "p-reyk" },
      ],
    })
  );

  summaries.push(
    await buildExplorer("alex-r", {
      profile: {
        name: "Alex R.",
        title: "UX designer & rail enthusiast",
        bio: "Documenting shinkansen hops and temple towns across Honshu.",
        location: "Tokyo, Japan",
        avatar: "AR",
      },
      tags: ["rail", "culture", "food"],
      stats: {
        totalPlaces: 22,
        totalTrips: 3,
        totalDistanceKm: 920,
        countriesVisited: 2,
      },
      trips: [
        {
          id: "trip-japan-golden",
          title: "Tokyo → Kyoto Golden Route",
          description: "Shinkansen spine with temple stops — 520 km of curated city hops.",
          waypoints: [
            { id: "w1", name: "Tokyo", lat: 35.6762, lng: 139.6503, order: 0 },
            { id: "w2", name: "Hakone", lat: 35.2324, lng: 139.1067, order: 1 },
            { id: "w3", name: "Kyoto", lat: 35.0116, lng: 135.7681, order: 2 },
          ],
          color: "#ec4899",
          startDate: "2024-04-10",
          endDate: "2024-04-17",
          createdAt: "2024-04-18T10:00:00.000Z",
        },
      ],
      places: [
        {
          id: "p-tokyo",
          name: "Shibuya Crossing",
          lat: 35.6595,
          lng: 139.7004,
          experience: "Rush-hour choreography from a café overlooking the scramble.",
          rating: 5,
          mood: "memorable",
          visitedAt: "2024-04-10",
          tags: ["urban", "culture"],
          tripId: "trip-japan-golden",
          photos: [photos.tokyo],
          timeSpentHours: 2,
          photoCount: 35,
        },
      ],
      heatZones: [
        heatZone("hz-tokyo", "Shibuya district", [139.7004, 35.6595], 0.04, 0.9, 2, 35),
      ],
      photoHotspots: [
        { lat: 35.6595, lng: 139.7004, weight: 0.95, placeId: "p-tokyo" },
      ],
    })
  );

  summaries.push(
    await buildExplorer("priya-s", {
      profile: {
        name: "Priya S.",
        title: "Trekking guide & anthropologist",
        bio: "High-altitude routes through the Andes with community homestays.",
        location: "Cusco, Peru",
        avatar: "PS",
      },
      tags: ["trekking", "andes", "culture"],
      stats: {
        totalPlaces: 18,
        totalTrips: 2,
        totalDistanceKm: 340,
        countriesVisited: 4,
      },
      trips: [
        {
          id: "trip-andes",
          title: "Sacred Valley Trek",
          description: "Cusco to Machu Picchu corridor — 4 days on Inca trails.",
          waypoints: [
            { id: "w1", name: "Cusco", lat: -13.5319, lng: -71.9675, order: 0 },
            { id: "w2", name: "Ollantaytambo", lat: -13.2583, lng: -72.2639, order: 1 },
            { id: "w3", name: "Machu Picchu", lat: -13.1631, lng: -72.545, order: 2 },
          ],
          color: "#eab308",
          startDate: "2024-08-05",
          endDate: "2024-08-09",
          createdAt: "2024-08-10T10:00:00.000Z",
        },
      ],
      places: [
        {
          id: "p-machu",
          name: "Machu Picchu",
          lat: -13.1631,
          lng: -72.545,
          experience: "Sunrise above the clouds — worth every switchback.",
          rating: 5,
          mood: "amazing",
          visitedAt: "2024-08-09",
          tags: ["heritage", "trekking"],
          tripId: "trip-andes",
          photos: [photos.machu],
          timeSpentHours: 7,
          photoCount: 78,
        },
      ],
      heatZones: [
        heatZone("hz-machu", "Machu Picchu site", [-72.545, -13.1631], 0.03, 1.0, 7, 78),
      ],
      photoHotspots: [
        { lat: -13.1631, lng: -72.545, weight: 1.0, placeId: "p-machu" },
      ],
    })
  );

  summaries.push(
    await buildExplorer("james-l", {
      profile: {
        name: "James L.",
        title: "Wildlife conservationist",
        bio: "Safari circuits across East Africa with GPS-tagged migration tracking.",
        location: "Arusha, Tanzania",
        avatar: "JL",
      },
      tags: ["safari", "wildlife", "conservation"],
      stats: {
        totalPlaces: 11,
        totalTrips: 2,
        totalDistanceKm: 680,
        countriesVisited: 5,
      },
      trips: [
        {
          id: "trip-serengeti",
          title: "Serengeti Migration Circuit",
          description: "Northern Tanzania loop following wildebeest corridors.",
          waypoints: [
            { id: "w1", name: "Arusha", lat: -3.3869, lng: 36.683, order: 0 },
            { id: "w2", name: "Serengeti", lat: -2.3333, lng: 34.8333, order: 1 },
            { id: "w3", name: "Ngorongoro", lat: -3.2, lng: 35.5, order: 2 },
          ],
          color: "#22c55e",
          startDate: "2024-02-14",
          endDate: "2024-02-22",
          createdAt: "2024-02-23T10:00:00.000Z",
        },
      ],
      places: [
        {
          id: "p-serengeti",
          name: "Serengeti Plains",
          lat: -2.3333,
          lng: 34.8333,
          experience: "Migration crossing at dawn — thousands of hooves on the horizon.",
          rating: 5,
          mood: "amazing",
          visitedAt: "2024-02-18",
          tags: ["wildlife", "safari"],
          tripId: "trip-serengeti",
          photos: [photos.serengeti],
          timeSpentHours: 10,
          photoCount: 92,
        },
      ],
      heatZones: [
        heatZone("hz-serengeti", "Central Serengeti", [34.8333, -2.3333], 0.12, 0.95, 10, 92),
      ],
      photoHotspots: [
        { lat: -2.3333, lng: 34.8333, weight: 1.0, placeId: "p-serengeti" },
      ],
    })
  );

  fs.writeFileSync(
    path.join(explorersDir, "index.json"),
    JSON.stringify(summaries, null, 2)
  );
  console.log("Wrote explorers/index.json");
}

main().catch(console.error);
