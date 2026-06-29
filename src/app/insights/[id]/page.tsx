"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  Camera,
  Globe,
} from "lucide-react";
import { MapView, type MapViewHandle } from "@/components/map/map-view";
import { MapToolbar } from "@/components/map/map-toolbar";
import { PlaceDetailDialog } from "@/components/map/stamp-dialog";
import { fetchExplorer } from "@/lib/api-client";
import type { ExplorerData, MapLayerVisibility, Place } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, formatDistance } from "@/lib/utils";

const DEFAULT_LAYERS: MapLayerVisibility = {
  places: true,
  routes: true,
  heatmap: true,
  heatZones: true,
  photos: true,
};

export default function ExplorerDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [explorer, setExplorer] = useState<ExplorerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [layers, setLayers] = useState<MapLayerVisibility>(DEFAULT_LAYERS);

  const mapRef = useRef<MapViewHandle>(null);

  useEffect(() => {
    fetchExplorer(id)
      .then(setExplorer)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleLayerToggle = useCallback((key: keyof MapLayerVisibility) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handlePlaceClick = useCallback((place: Place) => {
    setSelectedPlace(place);
    setDetailOpen(true);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">
          Loading {id.replace("-", " ")}&apos;s travel history…
        </p>
      </div>
    );
  }

  if (error || !explorer) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <p className="text-destructive">{error ?? "Explorer not found"}</p>
        <Link href="/insights">
          <Button variant="outline">Back to insights</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh)] pt-16">
      <MapView
        ref={mapRef}
        places={explorer.places}
        trips={explorer.trips}
        heatZones={explorer.heatZones}
        photoHotspots={explorer.photoHotspots}
        layers={layers}
        onPlaceClick={handlePlaceClick}
        className="absolute inset-0 top-16"
      />

      <MapToolbar
        stampMode={false}
        showStamp={false}
        onStampToggle={() => {}}
        layers={layers}
        onLayerToggle={handleLayerToggle}
        onFitAll={() => mapRef.current?.fitAll()}
        onRecenter={() => mapRef.current?.recenter()}
        onZoomIn={() => mapRef.current?.zoomIn()}
        onZoomOut={() => mapRef.current?.zoomOut()}
        onPlacesListToggle={() => setSidebarOpen(!sidebarOpen)}
        placesListOpen={sidebarOpen}
        placeCount={explorer.places.length}
      />

      <div className="absolute left-4 top-24 z-10 max-w-xs rounded-2xl border border-border/50 bg-background/90 p-4 shadow-xl backdrop-blur-xl sm:left-auto sm:right-[calc(24rem+2rem)]">
        <Link
          href="/insights"
          className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to insights
        </Link>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {explorer.profile.avatar ?? explorer.profile.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold">{explorer.profile.name}</h1>
            <p className="text-xs text-primary">{explorer.profile.title}</p>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
          {explorer.profile.bio}
        </p>
        <div className="mt-3 flex flex-wrap gap-1">
          {explorer.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {sidebarOpen && (
        <aside className="absolute bottom-4 right-4 top-20 z-10 flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/90 shadow-2xl backdrop-blur-xl sm:right-6">
          <div className="border-b border-border/50 px-4 py-3">
            <h2 className="font-semibold">Travel history</h2>
            <p className="text-xs text-muted-foreground">
              {explorer.places.length} places · {explorer.trips.length} trips ·{" "}
              <Globe className="mr-0.5 inline h-3 w-3" />
              {explorer.stats.countriesVisited} regions
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-4 space-y-2">
              <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Trips
              </p>
              {explorer.trips.map((trip) => (
                <Card
                  key={trip.id}
                  className="cursor-pointer border-border/50 transition hover:border-primary/30"
                  onClick={() => mapRef.current?.fitAll()}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
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
                      {trip.startDate && formatDate(trip.startDate)}
                      {trip.endDate && ` – ${formatDate(trip.endDate)}`}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-2">
              <p className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Places visited
              </p>
              {explorer.places.map((place) => (
                <Card
                  key={place.id}
                  className="cursor-pointer border-border/50 transition hover:border-primary/30"
                  onClick={() => {
                    handlePlaceClick(place);
                    mapRef.current?.flyTo(place.lng, place.lat, 12);
                  }}
                >
                  <CardContent className="flex items-start gap-3 p-3">
                    {place.photos?.[0] ? (
                      <img
                        src={place.photos[0]}
                        alt={place.name}
                        className="h-14 w-14 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{place.name}</p>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {place.experience}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-muted-foreground">
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </aside>
      )}

      <PlaceDetailDialog
        place={selectedPlace}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
