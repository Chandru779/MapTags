# TrailMark — Your Journey, Mapped

A **map-first travel portfolio app** — like LinkedIn for explorers. Stamp places you've visited, sketch cross-country routes, and build a living travel story recruiters can actually explore.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![MapLibre](https://img.shields.io/badge/MapLibre-GL-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Why this project?

Most travel apps are form-heavy. TrailMark flips that: **the map is the interface**. Click to stamp a place, drop waypoints to draw a route from Bengaluru to Kashmir, and watch distance stats update automatically.

Built as a production-ready portfolio piece showcasing modern frontend skills.

## Features

- **Stamp places** — Click anywhere on the map to mark where you've been, add ratings, moods, tags, and stories
- **Sketch journeys** — Drop waypoints to build routes with glowing linestrings and auto-calculated distance
- **Travel dashboard** — Places stamped, km traveled, trips completed
- **Trip timeline** — Visual route breakdown with numbered stops
- **Demo data** — Pre-loaded sample trip (Bengaluru → Kashmir) so the app looks great on first visit
- **Dark / light mode** — Polished violet/fuchsia theme
- **Local-first** — All data persists in browser localStorage (no backend required)
- **Responsive** — Works on mobile and desktop

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui + Radix UI |
| Icons | Lucide React |
| Animation | Framer Motion |
| Maps | MapLibre GL + Carto basemaps |
| Geo | Turf.js (distance, bbox) |
| State | Zustand + persist |
| Geocoding | OpenStreetMap Nominatim |

## Getting Started

```bash
# Install dependencies
yarn

# Run development server
yarn dev

# Production build
yarn build
yarn start
```

Open [http://localhost:3000](http://localhost:3000)

No API keys required — maps use free Carto basemaps.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, stats, features |
| `/explore` | Interactive map — stamp places, browse stamps |
| `/trips` | List of all journeys |
| `/trips/new` | Map-based trip builder — click to add waypoints |
| `/trips/[id]` | Trip detail with map, timeline, distance |
| `/profile` | Explorer profile, stats, theme toggle |

## How to use

1. **Explore the demo** — Sample data loads automatically on first visit
2. **Stamp a place** — Go to Explore → enable stamp mode → click the map
3. **Plan a journey** — Trips → New journey → click waypoints on the map → Save
4. **Customize profile** — Profile page → edit your name, title, bio

## Architecture

```
src/
├── app/              # Next.js App Router pages
├── components/
│   ├── map/          # MapLibre map, stamp dialogs
│   ├── home/         # Landing page sections
│   ├── trips/        # Trip cards
│   ├── profile/      # Stats grid
│   ├── layout/       # Navbar, footer
│   └── ui/           # shadcn/ui components
└── lib/
    ├── store.ts      # Zustand store (localStorage)
    ├── geo.ts        # Turf utilities, geocoding
    ├── types.ts      # TypeScript interfaces
    └── sample-data.ts # Demo trip & places
```

## Future enhancements

- [ ] Supabase backend for multi-user profiles
- [ ] OSRM routing for road-following paths
- [ ] Photo uploads per stamp
- [ ] Shareable public profile URLs
- [ ] Import GPX tracks

## License

MIT — use freely for your portfolio inspiration.

---

Built with ❤️ as a portfolio project to showcase map UX and modern React patterns.
