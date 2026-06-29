"use client";

import { useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Route,
  Trash2,
  Calendar,
} from "lucide-react";
import { MapView, type MapViewHandle } from "@/components/map/map-view";
import { useTrailMarkStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistance, formatDate } from "@/lib/utils";

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const mapRef = useRef<MapViewHandle>(null);
  const fitOnceRef = useRef(false);

  const trip = useTrailMarkStore(
    useCallback((s) => s.trips.find((t) => t.id === id), [id])
  );
  const allPlaces = useTrailMarkStore((s) => s.places);
  const removeTrip = useTrailMarkStore((s) => s.removeTrip);

  const tripPlaces = useMemo(
    () => allPlaces.filter((p) => p.tripId === id),
    [allPlaces, id]
  );

  const tripsForMap = useMemo(() => (trip ? [trip] : []), [trip]);

  const handleMapReady = useCallback(() => {
    if (fitOnceRef.current) return;
    fitOnceRef.current = true;
    mapRef.current?.fitAll();
  }, []);

  if (!trip) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center pt-16">
        <p className="text-muted-foreground">Trip not found</p>
        <Link href="/trips" className="mt-4">
          <Button variant="outline">Back to trips</Button>
        </Link>
      </div>
    );
  }

  const sortedWaypoints = [...trip.waypoints].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-[50vh] min-h-[300px]">
        <MapView
          ref={mapRef}
          places={allPlaces}
          trips={tripsForMap}
          activeTripId={trip.id}
          interactive={false}
          onStyleReady={handleMapReady}
          className="absolute inset-0"
        />
        <div className="absolute left-4 top-4 z-10">
          <Link href="/trips">
            <Button size="icon" variant="secondary" className="shadow-lg">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="mb-2 h-1 w-16 rounded-full"
            style={{ background: trip.color }}
          />
          <h1 className="text-3xl font-bold">{trip.title}</h1>
          {trip.description && (
            <p className="mt-2 text-muted-foreground">{trip.description}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1">
              <Route className="h-3 w-3" />
              {formatDistance(trip.distanceKm)}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <MapPin className="h-3 w-3" />
              {sortedWaypoints.length} stops
            </Badge>
            {trip.startDate && (
              <Badge variant="outline" className="gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(trip.startDate)}
                {trip.endDate && ` — ${formatDate(trip.endDate)}`}
              </Badge>
            )}
          </div>
        </motion.div>

        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold">Route timeline</h2>
          <div className="relative space-y-0">
            {sortedWaypoints.map((wp, idx) => (
              <motion.div
                key={wp.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex gap-4 pb-8"
              >
                {idx < sortedWaypoints.length - 1 && (
                  <div
                    className="absolute left-[15px] top-8 h-full w-0.5"
                    style={{ background: trip.color, opacity: 0.4 }}
                  />
                )}
                <div
                  className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: trip.color }}
                >
                  {idx + 1}
                </div>
                <div className="pt-1">
                  <p className="font-medium">{wp.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {wp.lat.toFixed(2)}, {wp.lng.toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {tripPlaces.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-4 text-lg font-semibold">Stamps on this trip</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {tripPlaces.map((place) => (
                <Card key={place.id} className="border-border/50">
                  <CardContent className="p-4">
                    <p className="font-medium">{place.name}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {place.experience}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 flex gap-3">
          <Link href="/trips/new">
            <Button variant="outline">Plan another trip</Button>
          </Link>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => {
              removeTrip(trip.id);
              window.location.href = "/trips";
            }}
          >
            <Trash2 className="h-4 w-4" />
            Delete trip
          </Button>
        </div>
      </div>
    </div>
  );
}
