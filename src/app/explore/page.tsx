"use client";

import { useCallback, useRef, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Compass, Star, Clock, Camera } from "lucide-react";
import { MapView, type MapViewHandle } from "@/components/map/map-view";
import { MapToolbar } from "@/components/map/map-toolbar";
import { StampDialog } from "@/components/map/stamp-dialog";
import { PlaceImmersivePanel } from "@/components/map/place-immersive-panel";
import { PlacePhoto } from "@/components/map/place-photo";
import { useTrailMarkStore } from "@/lib/store";
import { reverseGeocode } from "@/lib/geo";
import type { MapLayerVisibility, Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, formatDistance } from "@/lib/utils";

const DEFAULT_LAYERS: MapLayerVisibility = {
  places: true,
  routes: true,
  heatmap: true,
  heatZones: true,
  photos: true,
};

function ExploreContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");

  const places = useTrailMarkStore((s) => s.places);
  const trips = useTrailMarkStore((s) => s.trips);
  const heatZones = useTrailMarkStore((s) => s.heatZones);
  const photoHotspots = useTrailMarkStore((s) => s.photoHotspots);
  const dataLoading = useTrailMarkStore((s) => s.dataLoading);
  const dataError = useTrailMarkStore((s) => s.dataError);
  const loadUserData = useTrailMarkStore((s) => s.loadUserData);
  const addPlace = useTrailMarkStore((s) => s.addPlace);
  const removePlace = useTrailMarkStore((s) => s.removePlace);

  const mapRef = useRef<MapViewHandle>(null);
  const [stampMode, setStampMode] = useState(mode === "stamp");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [layers, setLayers] = useState<MapLayerVisibility>(DEFAULT_LAYERS);

  const [stampDialogOpen, setStampDialogOpen] = useState(false);
  const [clickCoords, setClickCoords] = useState({ lat: 0, lng: 0 });
  const [placeName, setPlaceName] = useState("");
  const [geocoding, setGeocoding] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  const handleLayerToggle = useCallback((key: keyof MapLayerVisibility) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleMapClick = useCallback(
    async (lng: number, lat: number) => {
      if (!stampMode) return;
      setClickCoords({ lat, lng });
      setGeocoding(true);
      setStampDialogOpen(true);
      const name = await reverseGeocode(lat, lng);
      setPlaceName(name);
      setGeocoding(false);
    },
    [stampMode]
  );

  const handleSaveStamp = useCallback(
    (data: {
      name: string;
      experience: string;
      rating: number;
      mood: Place["mood"];
      tags: string[];
    }) => {
      addPlace({
        name: data.name,
        lat: clickCoords.lat,
        lng: clickCoords.lng,
        experience: data.experience,
        rating: data.rating,
        mood: data.mood,
        visitedAt: new Date().toISOString().split("T")[0],
        tags: data.tags,
      });
      setStampDialogOpen(false);
      setStampMode(false);
      mapRef.current?.flyToPlace(clickCoords.lng, clickCoords.lat, {
        onComplete: () => {},
      });
    },
    [addPlace, clickCoords]
  );

  const navigateToPlace = useCallback((place: Place) => {
    setSelectedPlace(place);
    setDetailOpen(true);
    setIsNavigating(true);

    mapRef.current?.flyToPlace(place.lng, place.lat, {
      onComplete: () => setIsNavigating(false),
    });
  }, []);

  const handlePlaceClick = useCallback(
    (place: Place) => {
      navigateToPlace(place);
    },
    [navigateToPlace]
  );

  const handleDetailClose = useCallback((open: boolean) => {
    if (!open) {
      setDetailOpen(false);
      setSelectedPlace(null);
      setIsNavigating(false);
      mapRef.current?.resetView();
    }
  }, []);

  if (dataLoading && places.length === 0) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <div className="text-center">
          <p className="font-medium">Loading your travel records</p>
          <p className="text-sm text-muted-foreground">
            Fetching trips, routes, and place stamps…
          </p>
        </div>
      </div>
    );
  }

  if (dataError && places.length === 0) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] flex-col items-center justify-center gap-4">
        <p className="text-destructive">{dataError}</p>
        <Button onClick={() => loadUserData()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 overflow-hidden">
      <MapView
        ref={mapRef}
        places={places}
        trips={trips}
        heatZones={heatZones}
        photoHotspots={photoHotspots}
        layers={layers}
        selectedPlaceId={selectedPlace?.id ?? null}
        interactive={stampMode}
        onMapClick={handleMapClick}
        onPlaceClick={handlePlaceClick}
        className="absolute inset-0"
      />

      <MapToolbar
        stampMode={stampMode}
        onStampToggle={() => setStampMode(!stampMode)}
        layers={layers}
        onLayerToggle={handleLayerToggle}
        onFitAll={() => mapRef.current?.fitAll()}
        onRecenter={() => mapRef.current?.recenter()}
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onPlacesListToggle={() => setSidebarOpen(!sidebarOpen)}
        placesListOpen={sidebarOpen}
        placeCount={places.length}
      />

      {stampMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 top-3 z-10 -translate-x-1/2"
        >
          <Badge className="gap-2 px-4 py-2 text-sm shadow-lg">
            <Compass className="h-3.5 w-3.5 animate-pulse" />
            Stamp mode — click anywhere on the map
          </Badge>
        </motion.div>
      )}

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute bottom-3 right-3 top-3 z-10 flex w-[min(100%,22rem)] min-h-0 flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/90 shadow-2xl backdrop-blur-xl sm:right-4"
          >
            <div className="shrink-0 border-b border-border/50 px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h2 className="font-semibold">Your travel log</h2>
                  <p className="text-xs text-muted-foreground">
                    {places.length} places · {trips.length} trips ·{" "}
                    {formatDistance(
                      trips.reduce((s, t) => s + t.distanceKm, 0)
                    )}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="shrink-0"
                  onClick={() => setSidebarOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 scrollbar-thin">
              {trips.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Your trips
                  </p>
                  {trips.map((trip) => (
                    <Card
                      key={trip.id}
                      className="cursor-pointer border-border/50 transition hover:border-primary/30"
                      onClick={() => mapRef.current?.fitAll()}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-full"
                            style={{ background: trip.color }}
                          />
                          <p className="truncate text-sm font-medium">
                            {trip.title}
                          </p>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {trip.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDistance(trip.distanceKm)} ·{" "}
                          {trip.waypoints.length} stops
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {places.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <MapPin className="mb-3 h-10 w-10 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    No stamps yet. Enable stamp mode and click the map!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Place stamps
                  </p>
                  {places.map((place) => (
                    <Card
                      key={place.id}
                      className={`cursor-pointer border-border/50 transition hover:border-primary/30 ${
                        selectedPlace?.id === place.id
                          ? "border-primary/50 ring-1 ring-primary/20"
                          : ""
                      }`}
                      onClick={() => navigateToPlace(place)}
                    >
                      <CardContent className="flex items-start gap-3 p-3">
                        <PlacePhoto
                          src={place.photos?.[0]}
                          alt={place.name}
                          className="h-14 w-14 shrink-0 rounded-lg"
                          fallbackClassName="h-14 w-14 shrink-0 rounded-lg"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{place.name}</p>
                          <p className="line-clamp-2 text-xs text-muted-foreground">
                            {place.experience || "No story yet"}
                          </p>
                          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {place.rating}
                            </span>
                            {place.timeSpentHours && (
                              <span className="flex items-center gap-0.5">
                                <Clock className="h-3 w-3" />
                                {place.timeSpentHours}h
                              </span>
                            )}
                            {place.photoCount && (
                              <span className="flex items-center gap-0.5">
                                <Camera className="h-3 w-3" />
                                {place.photoCount}
                              </span>
                            )}
                            <span>{formatDate(place.visitedAt)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <PlaceImmersivePanel
        place={selectedPlace}
        open={detailOpen}
        onOpenChange={handleDetailClose}
        onDelete={removePlace}
        isNavigating={isNavigating}
      />

      <StampDialog
        open={stampDialogOpen}
        onOpenChange={setStampDialogOpen}
        lat={clickCoords.lat}
        lng={clickCoords.lng}
        placeName={geocoding ? "Finding place..." : placeName}
        onPlaceNameChange={setPlaceName}
        onSave={handleSaveStamp}
        loading={geocoding}
      />
    </div>
  );
}

function ExplorePageInner() {
  const mode = useSearchParams().get("mode");
  return <ExploreContent key={mode ?? "default"} />;
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100dvh-4rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <ExplorePageInner />
    </Suspense>
  );
}
