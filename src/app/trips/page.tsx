"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Route } from "lucide-react";
import { TripCard, TripListEmpty } from "@/components/trips/trip-card";
import { useTrailMarkStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { StatsGrid } from "@/components/profile/stats-grid";

export default function TripsPage() {
  const trips = useTrailMarkStore((s) => s.trips);

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 text-3xl font-bold"
            >
              <Route className="h-8 w-8 text-primary" />
              Your Journeys
            </motion.h1>
            <p className="mt-1 text-muted-foreground">
              Routes you&apos;ve sketched across the map
            </p>
          </div>
          <Link href="/trips/new">
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              New journey
            </Button>
          </Link>
        </div>

        <div className="mt-8">
          <StatsGrid />
        </div>

        <div className="mt-10">
          {trips.length === 0 ? (
            <TripListEmpty />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip.id} tripId={trip.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
