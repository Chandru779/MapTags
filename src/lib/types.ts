export type Mood = "amazing" | "good" | "okay" | "memorable";

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  experience: string;
  rating: number;
  mood: Mood;
  visitedAt: string;
  tags: string[];
  tripId?: string;
  photos?: string[];
  timeSpentHours?: number;
  photoCount?: number;
}

export interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  order: number;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  waypoints: Waypoint[];
  routeCoordinates: [number, number][];
  distanceKm: number;
  color: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  location: string;
  avatar?: string;
}

export interface AppStats {
  totalPlaces: number;
  totalTrips: number;
  totalDistanceKm: number;
  countriesVisited: number;
}

export interface PhotoHotspot {
  lat: number;
  lng: number;
  weight: number;
  placeId: string;
}

export interface HeatZone {
  id: string;
  name: string;
  intensity: number;
  timeSpentHours: number;
  photoCount: number;
  polygon: [number, number][];
}

export interface UserTravelData {
  profile: Profile;
  trips: Trip[];
  places: Place[];
  heatZones: HeatZone[];
  photoHotspots: PhotoHotspot[];
}

export interface ExplorerSummary {
  id: string;
  name: string;
  title: string;
  location: string;
  bio: string;
  avatar?: string;
  stats: AppStats;
  highlightTrip?: string;
  tags: string[];
}

export interface ExplorerData extends UserTravelData {
  id: string;
  tags: string[];
  stats: AppStats;
}

export type MapMode = "explore" | "stamp" | "route";

export interface MapLayerVisibility {
  places: boolean;
  routes: boolean;
  heatmap: boolean;
  heatZones: boolean;
  photos: boolean;
}
