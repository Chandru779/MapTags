"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Route, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTrailMarkStore } from "@/lib/store";
import { formatDistance, formatDate } from "@/lib/utils";

export function TripCard({ tripId }: { tripId: string }) {
  const trip = useTrailMarkStore((s) => s.trips.find((t) => t.id === tripId));

  if (!trip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/trips/${trip.id}`}>
        <Card className="group overflow-hidden border-border/50 transition hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
          <div
            className="h-1.5 w-full"
            style={{ background: trip.color }}
          />
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold group-hover:text-primary transition">
                  {trip.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {trip.description}
                </p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1">
                <Route className="h-3 w-3" />
                {formatDistance(trip.distanceKm)}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <MapPin className="h-3 w-3" />
                {trip.waypoints.length} stops
              </Badge>
              {trip.startDate && (
                <Badge variant="outline">{formatDate(trip.startDate)}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function TripListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
      <Route className="mb-4 h-12 w-12 text-muted-foreground/50" />
      <h3 className="text-lg font-medium">No journeys yet</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Click waypoints on the map to sketch your first route — Bengaluru to
        Kashmir, perhaps?
      </p>
      <Link href="/trips/new" className="mt-6">
        <Button className="gap-2">
          Plan your first trip
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
}
