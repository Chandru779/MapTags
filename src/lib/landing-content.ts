import {
  MapPin,
  Route,
  MousePointerClick,
  Share2,
  BarChart3,
  Users,
  Globe,
  Layers,
  type LucideIcon,
} from "lucide-react";

export const platformStats = [
  { key: "explorers", icon: Users, label: "Active explorers", value: "12,400+" },
  { key: "stamps", icon: MapPin, label: "Places stamped", value: "48,000+" },
  { key: "routes", icon: Route, label: "Routes planned", value: "8,200+" },
  { key: "countries", icon: Globe, label: "Countries covered", value: "140+" },
] as const;

export const heroHighlights = [
  "Map-first place stamping",
  "Multi-stop route planning",
  "Shareable travel portfolios",
] as const;

export const liveActivity = [
  { user: "Maya K.", action: "stamped Reykjavik", region: "Iceland", time: "2m ago" },
  { user: "Alex R.", action: "planned Tokyo → Kyoto", region: "Japan", time: "5m ago" },
  { user: "Priya S.", action: "completed Andes route", region: "Peru", time: "12m ago" },
  { user: "James L.", action: "stamped Serengeti", region: "Tanzania", time: "18m ago" },
] as const;

export const mapPreviewRoutes = [
  {
    path: "M80 320 Q180 260 280 280 T480 220 T620 260",
    color: "#a78bfa",
    stops: [
      { x: 80, y: 320 },
      { x: 280, y: 280 },
      { x: 480, y: 220 },
      { x: 620, y: 260 },
    ],
  },
  {
    path: "M120 180 Q220 140 340 160 T520 120",
    color: "#f472b6",
    stops: [
      { x: 120, y: 180 },
      { x: 340, y: 160 },
      { x: 520, y: 120 },
    ],
  },
  {
    path: "M200 360 Q300 340 400 380 T580 350",
    color: "#fbbf24",
    stops: [
      { x: 200, y: 360 },
      { x: 400, y: 380 },
      { x: 580, y: 350 },
    ],
  },
] as const;

export const howItWorks = [
  {
    step: "01",
    title: "Stamp where you've been",
    description:
      "Drop pins on an interactive world map. Add ratings, moods, photos, and stories — no spreadsheets required.",
  },
  {
    step: "02",
    title: "Sketch your routes",
    description:
      "Connect cities and landmarks with multi-stop journeys. mapTag calculates distance and visualizes every leg.",
  },
  {
    step: "03",
    title: "Share your travel story",
    description:
      "Publish a living portfolio recruiters, friends, and fellow travelers can explore on the map itself.",
  },
] as const;

export const features: {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}[] = [
  {
    icon: MousePointerClick,
    title: "One-click place stamping",
    description:
      "Mark anywhere on the map in seconds. Rich place cards capture ratings, moods, tags, and written experiences.",
    color: "text-violet-400",
  },
  {
    icon: Route,
    title: "Visual route builder",
    description:
      "Plan multi-stop trips with waypoints that draw themselves. See total distance, dates, and progress at a glance.",
    color: "text-fuchsia-400",
  },
  {
    icon: BarChart3,
    title: "Explorer analytics",
    description:
      "Track countries visited, kilometers covered, and trip history. Your dashboard updates as you explore.",
    color: "text-amber-400",
  },
  {
    icon: MapPin,
    title: "Living travel portfolios",
    description:
      "Turn stamps and routes into a shareable profile. Let people explore your journeys geographically, not as a resume bullet.",
    color: "text-rose-400",
  },
  {
    icon: Share2,
    title: "Built to be shared",
    description:
      "Polished, responsive profiles designed for link-in-bio, job applications, and travel communities.",
    color: "text-violet-400",
  },
  {
    icon: Layers,
    title: "Trips & places, unified",
    description:
      "Link stamps to journeys, filter by mood or tag, and browse your entire travel history on one interactive map.",
    color: "text-orange-400",
  },
];

export const useCases = [
  {
    title: "Frequent travelers",
    description: "Build a visual record of every city, trail, and hidden gem you've discovered.",
  },
  {
    title: "Digital nomads",
    description: "Show where you've worked and wandered — a map beats a list of locations.",
  },
  {
    title: "Trip planners",
    description: "Sketch upcoming routes, track progress, and compare planned vs. completed journeys.",
  },
  {
    title: "Travel creators",
    description: "Give your audience an explorable map of your adventures instead of scattered posts.",
  },
] as const;
