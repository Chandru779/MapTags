"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useTheme } from "next-themes";
import maplibregl, { type Map, type LngLatLike } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type {
  HeatZone,
  MapLayerVisibility,
  PhotoHotspot,
  Place,
  Trip,
} from "@/lib/types";
import { getBoundsFromPoints } from "@/lib/geo";
import { cn } from "@/lib/utils";
import {
  createPhotoMarkerEl,
  createPlaceMarkerEl,
} from "@/components/map/create-map-markers";

export interface FlyToPlaceOptions {
  zoom?: number;
  pitch?: number;
  bearing?: number;
  duration?: number;
  onComplete?: () => void;
}

export interface MapViewHandle {
  flyTo: (lng: number, lat: number, zoom?: number) => void;
  flyToPlace: (lng: number, lat: number, options?: FlyToPlaceOptions) => void;
  resetView: () => void;
  fitAll: () => void;
  recenter: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
}

interface MapViewProps {
  places?: Place[];
  trips?: Trip[];
  heatZones?: HeatZone[];
  photoHotspots?: PhotoHotspot[];
  layers?: MapLayerVisibility;
  activeTripId?: string;
  draftRoute?: [number, number][];
  interactive?: boolean;
  onMapClick?: (lng: number, lat: number) => void;
  onPlaceClick?: (place: Place) => void;
  onStyleReady?: () => void;
  selectedPlaceId?: string | null;
  className?: string;
  showControls?: boolean;
  initialCenter?: [number, number];
  initialZoom?: number;
}

const CARTO_DARK =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const CARTO_LIGHT =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const DEFAULT_LAYERS: MapLayerVisibility = {
  places: true,
  routes: true,
  heatmap: true,
  heatZones: true,
  photos: true,
};

function getCartoStyle(isDark: boolean) {
  return isDark ? CARTO_DARK : CARTO_LIGHT;
}

export const MapView = forwardRef<MapViewHandle, MapViewProps>(function MapView(
  {
    places = [],
    trips = [],
    heatZones = [],
    photoHotspots = [],
    layers = DEFAULT_LAYERS,
    activeTripId,
    draftRoute = [],
    interactive = true,
    onMapClick,
    onPlaceClick,
    onStyleReady,
    selectedPlaceId,
    className,
    showControls = false,
    initialCenter = [78.9629, 20.5937],
    initialZoom = 4.5,
  },
  ref
) {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const onMapClickRef = useRef(onMapClick);
  const onPlaceClickRef = useRef(onPlaceClick);
  const onStyleReadyRef = useRef(onStyleReady);
  const placesRef = useRef(places);
  const tripsRef = useRef(trips);
  const heatZonesRef = useRef(heatZones);
  const photoHotspotsRef = useRef(photoHotspots);
  const layersRef = useRef(layers);
  const activeTripIdRef = useRef(activeTripId);
  const draftRouteRef = useRef(draftRoute);
  const selectedPlaceIdRef = useRef(selectedPlaceId);
  const appliedThemeRef = useRef<string | null>(null);
  const mapCreatedRef = useRef(false);
  const styleReadyCalledRef = useRef(false);
  const initialCenterRef = useRef(initialCenter);
  const initialZoomRef = useRef(initialZoom);
  const currentZoomRef = useRef(initialZoom);

  const [mounted, setMounted] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  onMapClickRef.current = onMapClick;
  onPlaceClickRef.current = onPlaceClick;
  onStyleReadyRef.current = onStyleReady;
  placesRef.current = places;
  tripsRef.current = trips;
  heatZonesRef.current = heatZones;
  photoHotspotsRef.current = photoHotspots;
  layersRef.current = layers;
  activeTripIdRef.current = activeTripId;
  draftRouteRef.current = draftRoute;
  selectedPlaceIdRef.current = selectedPlaceId;
  initialCenterRef.current = initialCenter;
  initialZoomRef.current = initialZoom;

  useEffect(() => setMounted(true), []);

  const getAllPoints = useCallback(() => {
    return [
      ...placesRef.current.map((p) => ({ lat: p.lat, lng: p.lng })),
      ...tripsRef.current.flatMap((t) =>
        t.waypoints.map((w) => ({ lat: w.lat, lng: w.lng }))
      ),
    ];
  }, []);

  useImperativeHandle(ref, () => ({
    flyTo: (lng, lat, zoom = 10) => {
      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom,
        pitch: 0,
        bearing: 0,
        duration: 1500,
      });
    },
    flyToPlace: (lng, lat, options = {}) => {
      const map = mapRef.current;
      if (!map) return;

      const {
        zoom = 15.5,
        pitch = 58,
        bearing = ((lng * 47 + lat * 31) % 60) - 30,
        duration = 2400,
        onComplete,
      } = options;

      if (onComplete) {
        map.once("moveend", onComplete);
      }

      map.flyTo({
        center: [lng, lat],
        zoom,
        pitch,
        bearing,
        duration,
        essential: true,
      });
    },
    resetView: () => {
      const map = mapRef.current;
      if (!map) return;
      map.easeTo({ pitch: 0, bearing: 0, duration: 900 });
    },
    fitAll: () => {
      const map = mapRef.current;
      if (!map?.isStyleLoaded()) return;
      const bounds = getBoundsFromPoints(getAllPoints());
      if (bounds) {
        map.fitBounds(bounds, { padding: 80, duration: 1200, maxZoom: 12 });
      }
    },
    recenter: () => {
      const map = mapRef.current;
      if (!map?.isStyleLoaded()) return;
      const points = getAllPoints();
      if (points.length === 0) {
        map.flyTo({
          center: initialCenterRef.current,
          zoom: initialZoomRef.current,
          duration: 1200,
        });
        return;
      }
      const avgLng =
        points.reduce((s, p) => s + p.lng, 0) / points.length;
      const avgLat =
        points.reduce((s, p) => s + p.lat, 0) / points.length;
      map.flyTo({ center: [avgLng, avgLat], zoom: 7, duration: 1200 });
    },
    zoomIn: () => {
      const map = mapRef.current;
      if (!map) return;
      map.zoomTo(Math.min(map.getZoom() + 1.5, 18), { duration: 400 });
    },
    zoomOut: () => {
      const map = mapRef.current;
      if (!map) return;
      map.zoomTo(Math.max(map.getZoom() - 1.5, 2), { duration: 400 });
    },
  }));

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
  }, []);

  const removeLayerIfExists = useCallback((map: Map, layerId: string) => {
    if (map.getLayer(layerId)) map.removeLayer(layerId);
  }, []);

  const removeSourceIfExists = useCallback((map: Map, sourceId: string) => {
    if (map.getSource(sourceId)) map.removeSource(sourceId);
  }, []);

  const syncMapData = useCallback(() => {
    const map = mapRef.current;
    if (!map?.isStyleLoaded()) return;

    clearMarkers();

    const currentPlaces = placesRef.current;
    const currentTrips = tripsRef.current;
    const currentHeatZones = heatZonesRef.current;
    const currentPhotoHotspots = photoHotspotsRef.current;
    const currentLayers = layersRef.current;
    const currentActiveTripId = activeTripIdRef.current;
    const currentDraftRoute = draftRouteRef.current;
    const zoom = map.getZoom();

    const selectedId = selectedPlaceIdRef.current;
    const showPhotoPins = currentLayers.photos && zoom >= 8;

    if (currentLayers.places) {
      currentPlaces.forEach((place) => {
        if (showPhotoPins && place.photos && place.photos.length > 0) return;

        const el = createPlaceMarkerEl(
          place,
          () => onPlaceClickRef.current?.(place),
          place.id === selectedId
        );
        markersRef.current.push(
          new maplibregl.Marker({ element: el, anchor: "bottom" })
            .setLngLat([place.lng, place.lat])
            .addTo(map)
        );
      });
    }

    if (showPhotoPins) {
      currentPlaces
        .filter((p) => p.photos && p.photos.length > 0)
        .forEach((place) => {
          const el = createPhotoMarkerEl(
            place,
            () => onPlaceClickRef.current?.(place),
            place.id === selectedId
          );
          markersRef.current.push(
            new maplibregl.Marker({ element: el, anchor: "bottom" })
              .setLngLat([place.lng, place.lat])
              .addTo(map)
          );
        });
    }

    try {
      removeLayerIfExists(map, "routes-line");
      removeLayerIfExists(map, "routes-glow");
      removeSourceIfExists(map, "routes");

      if (currentLayers.routes) {
        const routeFeatures = currentTrips.map((trip) => ({
          type: "Feature" as const,
          properties: { color: trip.color, id: trip.id },
          geometry: {
            type: "LineString" as const,
            coordinates: trip.routeCoordinates,
          },
        }));

        if (currentDraftRoute.length >= 2) {
          routeFeatures.push({
            type: "Feature",
            properties: { color: "#f97316", id: "draft" },
            geometry: {
              type: "LineString",
              coordinates: currentDraftRoute,
            },
          });
        }

        if (routeFeatures.length > 0) {
          map.addSource("routes", {
            type: "geojson",
            data: { type: "FeatureCollection", features: routeFeatures },
          });
          map.addLayer({
            id: "routes-glow",
            type: "line",
            source: "routes",
            paint: {
              "line-color": ["get", "color"],
              "line-width": 8,
              "line-opacity": 0.25,
              "line-blur": 4,
            },
            layout: { "line-cap": "round", "line-join": "round" },
          });
          map.addLayer({
            id: "routes-line",
            type: "line",
            source: "routes",
            paint: {
              "line-color": ["get", "color"],
              "line-width": 3,
              "line-opacity": 0.9,
            },
            layout: { "line-cap": "round", "line-join": "round" },
          });
        }
      }

      removeLayerIfExists(map, "photo-heatmap");
      removeSourceIfExists(map, "photo-heat");

      if (currentLayers.heatmap && currentPhotoHotspots.length > 0) {
        map.addSource("photo-heat", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: currentPhotoHotspots.map((p) => ({
              type: "Feature",
              properties: { weight: p.weight },
              geometry: {
                type: "Point",
                coordinates: [p.lng, p.lat],
              },
            })),
          },
        });
        map.addLayer({
          id: "photo-heatmap",
          type: "heatmap",
          source: "photo-heat",
          paint: {
            "heatmap-weight": ["get", "weight"],
            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 0.5, 12, 2],
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 8, 12, 28],
            "heatmap-opacity": 0.7,
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(139,92,246,0)",
              0.4,
              "rgba(139,92,246,0.5)",
              0.7,
              "rgba(236,72,153,0.7)",
              1,
              "rgba(251,191,36,0.9)",
            ],
          },
        });
      }

      removeLayerIfExists(map, "heat-zones-fill");
      removeLayerIfExists(map, "heat-zones-outline");
      removeSourceIfExists(map, "heat-zones");

      if (currentLayers.heatZones && currentHeatZones.length > 0) {
        map.addSource("heat-zones", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: currentHeatZones.map((z) => ({
              type: "Feature",
              properties: {
                intensity: z.intensity,
                name: z.name,
                hours: z.timeSpentHours,
              },
              geometry: {
                type: "Polygon",
                coordinates: [z.polygon],
              },
            })),
          },
        });
        map.addLayer({
          id: "heat-zones-fill",
          type: "fill",
          source: "heat-zones",
          paint: {
            "fill-color": "#8b5cf6",
            "fill-opacity": [
              "*",
              ["get", "intensity"],
              0.35,
            ],
          },
        });
        map.addLayer({
          id: "heat-zones-outline",
          type: "line",
          source: "heat-zones",
          paint: {
            "line-color": "#a78bfa",
            "line-width": 1.5,
            "line-opacity": 0.6,
          },
        });
      }
    } catch {
      // Style may still be loading during theme swap
    }

    if (currentLayers.routes) {
      currentTrips.forEach((trip) => {
        if (currentActiveTripId && trip.id !== currentActiveTripId) return;
        trip.waypoints.forEach((wp, idx) => {
          const el = document.createElement("div");
          el.className = "waypoint-marker";
          el.innerHTML = `<div class="waypoint-marker-inner" style="background:${trip.color}">${idx + 1}</div>`;
          markersRef.current.push(
            new maplibregl.Marker({ element: el, anchor: "center" })
              .setLngLat([wp.lng, wp.lat])
              .addTo(map)
          );
        });
      });

      currentDraftRoute.forEach((coord, idx) => {
        const el = document.createElement("div");
        el.className = "waypoint-marker";
        el.innerHTML = `<div class="waypoint-marker-inner" style="background:#f97316;border:2px dashed white">${idx + 1}</div>`;
        markersRef.current.push(
          new maplibregl.Marker({ element: el, anchor: "center" })
            .setLngLat(coord as LngLatLike)
            .addTo(map)
        );
      });
    }
  }, [clearMarkers, removeLayerIfExists, removeSourceIfExists]);

  useEffect(() => {
    if (!mounted || !resolvedTheme || !containerRef.current) return;
    if (mapCreatedRef.current) return;

    mapCreatedRef.current = true;
    appliedThemeRef.current = resolvedTheme;
    const isDark = resolvedTheme === "dark";

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: getCartoStyle(isDark),
      center: initialCenterRef.current,
      zoom: initialZoomRef.current,
      attributionControl: false,
    });

    if (showControls) {
      map.addControl(new maplibregl.NavigationControl(), "top-right");
      map.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        "bottom-right"
      );
    }

    map.on("zoom", () => {
      currentZoomRef.current = map.getZoom();
    });

    map.once("load", () => {
      setMapReady(true);
    });

    map.on("click", (e) => {
      onMapClickRef.current?.(e.lngLat.lng, e.lngLat.lat);
    });

    map.on("zoomend", () => syncMapData());

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      mapCreatedRef.current = false;
      styleReadyCalledRef.current = false;
      setMapReady(false);
    };
  }, [mounted, resolvedTheme, showControls, syncMapData]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !resolvedTheme || !mapReady) return;
    if (appliedThemeRef.current === resolvedTheme) return;

    appliedThemeRef.current = resolvedTheme;
    const isDark = resolvedTheme === "dark";

    map.setStyle(getCartoStyle(isDark));
    map.once("load", () => syncMapData());
  }, [resolvedTheme, mapReady, syncMapData]);

  useEffect(() => {
    if (mapReady) syncMapData();
  }, [
    mapReady,
    syncMapData,
    places,
    trips,
    heatZones,
    photoHotspots,
    layers,
    activeTripId,
    draftRoute,
    selectedPlaceId,
  ]);

  useEffect(() => {
    if (!mapReady || styleReadyCalledRef.current) return;
    styleReadyCalledRef.current = true;
    onStyleReadyRef.current?.();
  }, [mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.cursor =
      interactive && onMapClick ? "crosshair" : "grab";
  }, [interactive, onMapClick, mapReady]);

  const showInitialLoader = mounted && (!resolvedTheme || !mapReady);

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <div ref={containerRef} className="h-full w-full" />
      {showInitialLoader && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
});
