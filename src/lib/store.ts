"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import type {
  HeatZone,
  PhotoHotspot,
  Place,
  Profile,
  Trip,
  Waypoint,
} from "./types";
import {
  buildRouteFromWaypoints,
  calculateRouteDistanceKm,
  TRIP_COLORS,
} from "./geo";
import { defaultProfile } from "./sample-data";
import { fetchUserTravelData } from "./api-client";

interface TrailMarkState {
  profile: Profile;
  places: Place[];
  trips: Trip[];
  heatZones: HeatZone[];
  photoHotspots: PhotoHotspot[];
  initialized: boolean;
  dataLoading: boolean;
  dataError: string | null;
  draftWaypoints: Waypoint[];

  loadUserData: () => Promise<void>;
  resetDemo: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => void;

  addPlace: (place: Omit<Place, "id">) => Place;
  updatePlace: (id: string, updates: Partial<Place>) => void;
  removePlace: (id: string) => void;

  addTrip: (
    trip: Omit<Trip, "id" | "createdAt" | "distanceKm" | "routeCoordinates">
  ) => Trip;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  removeTrip: (id: string) => void;

  addDraftWaypoint: (waypoint: Omit<Waypoint, "id" | "order">) => Waypoint;
  removeDraftWaypoint: (id: string) => void;
  clearDraftWaypoints: () => void;
  reorderDraftWaypoint: (id: string, direction: "up" | "down") => void;
  buildTripFromDraft: (title: string, description: string) => Trip | null;
}

function applyUserData(
  data: Awaited<ReturnType<typeof fetchUserTravelData>>
) {
  return {
    profile: data.profile,
    places: data.places,
    trips: data.trips,
    heatZones: data.heatZones ?? [],
    photoHotspots: data.photoHotspots ?? [],
    initialized: true,
    dataLoading: false,
    dataError: null,
  };
}

export const useTrailMarkStore = create<TrailMarkState>()(
  persist(
    (set, get) => ({
      profile: defaultProfile,
      places: [],
      trips: [],
      heatZones: [],
      photoHotspots: [],
      initialized: false,
      dataLoading: false,
      dataError: null,
      draftWaypoints: [],

      loadUserData: async () => {
        if (get().dataLoading) return;
        set({ dataLoading: true, dataError: null });
        try {
          const data = await fetchUserTravelData();
          set(applyUserData(data));
        } catch (err) {
          set({
            dataLoading: false,
            dataError:
              err instanceof Error ? err.message : "Failed to load travel data",
          });
        }
      },

      resetDemo: async () => {
        set({ dataLoading: true, dataError: null, draftWaypoints: [] });
        try {
          const data = await fetchUserTravelData();
          set(applyUserData(data));
        } catch (err) {
          set({
            dataLoading: false,
            dataError:
              err instanceof Error ? err.message : "Failed to refresh travel data",
          });
        }
      },

      updateProfile: (updates) =>
        set((state) => ({ profile: { ...state.profile, ...updates } })),

      addPlace: (place) => {
        const newPlace: Place = { ...place, id: nanoid() };
        set((state) => ({ places: [...state.places, newPlace] }));
        return newPlace;
      },

      updatePlace: (id, updates) =>
        set((state) => ({
          places: state.places.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      removePlace: (id) =>
        set((state) => ({ places: state.places.filter((p) => p.id !== id) })),

      addTrip: (trip) => {
        const routeCoordinates = buildRouteFromWaypoints(trip.waypoints);
        const newTrip: Trip = {
          ...trip,
          id: nanoid(),
          routeCoordinates,
          distanceKm: calculateRouteDistanceKm(routeCoordinates),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ trips: [...state.trips, newTrip] }));
        return newTrip;
      },

      updateTrip: (id, updates) =>
        set((state) => ({
          trips: state.trips.map((t) => {
            if (t.id !== id) return t;
            const updated = { ...t, ...updates };
            if (updates.waypoints) {
              updated.routeCoordinates = buildRouteFromWaypoints(
                updated.waypoints
              );
              updated.distanceKm = calculateRouteDistanceKm(
                updated.routeCoordinates
              );
            }
            return updated;
          }),
        })),

      removeTrip: (id) =>
        set((state) => ({
          trips: state.trips.filter((t) => t.id !== id),
          places: state.places.map((p) =>
            p.tripId === id ? { ...p, tripId: undefined } : p
          ),
        })),

      addDraftWaypoint: (waypoint) => {
        const { draftWaypoints } = get();
        const newWp: Waypoint = {
          ...waypoint,
          id: nanoid(),
          order: draftWaypoints.length,
        };
        set({ draftWaypoints: [...draftWaypoints, newWp] });
        return newWp;
      },

      removeDraftWaypoint: (id) =>
        set((state) => ({
          draftWaypoints: state.draftWaypoints
            .filter((w) => w.id !== id)
            .map((w, i) => ({ ...w, order: i })),
        })),

      reorderDraftWaypoint: (id, direction) =>
        set((state) => {
          const wps = [...state.draftWaypoints].sort(
            (a, b) => a.order - b.order
          );
          const idx = wps.findIndex((w) => w.id === id);
          if (idx === -1) return state;
          const swapIdx = direction === "up" ? idx - 1 : idx + 1;
          if (swapIdx < 0 || swapIdx >= wps.length) return state;
          [wps[idx], wps[swapIdx]] = [wps[swapIdx], wps[idx]];
          return {
            draftWaypoints: wps.map((w, i) => ({ ...w, order: i })),
          };
        }),

      clearDraftWaypoints: () => set({ draftWaypoints: [] }),

      buildTripFromDraft: (title, description) => {
        const { draftWaypoints, trips, addTrip } = get();
        if (draftWaypoints.length < 2) return null;
        const color = TRIP_COLORS[trips.length % TRIP_COLORS.length];
        const trip = addTrip({
          title,
          description,
          waypoints: [...draftWaypoints].sort((a, b) => a.order - b.order),
          color,
        });
        set({ draftWaypoints: [] });
        return trip;
      },
    }),
    {
      name: "trailmark-storage",
      partialize: (state) => ({
        profile: state.profile,
        places: state.places,
        trips: state.trips,
        heatZones: state.heatZones,
        photoHotspots: state.photoHotspots,
        initialized: state.initialized,
      }),
    }
  )
);

export function useStats() {
  const places = useTrailMarkStore((s) => s.places);
  const trips = useTrailMarkStore((s) => s.trips);

  const totalDistanceKm = trips.reduce((sum, t) => sum + t.distanceKm, 0);
  const uniqueCountries = new Set(
    places.map((p) =>
      p.tags.includes("international") ? "intl" : "india"
    )
  ).size;

  return {
    totalPlaces: places.length,
    totalTrips: trips.length,
    totalDistanceKm,
    countriesVisited: Math.max(uniqueCountries, 1),
  };
}
