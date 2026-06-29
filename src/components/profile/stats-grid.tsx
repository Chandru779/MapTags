"use client";

import { motion } from "framer-motion";
import { MapPin, Route, Globe, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useStats } from "@/lib/store";
import { formatDistance } from "@/lib/utils";

const statItems = [
  { key: "places", icon: MapPin, label: "Places stamped" },
  { key: "trips", icon: Route, label: "Journeys" },
  { key: "distance", icon: TrendingUp, label: "Km traveled" },
  { key: "countries", icon: Globe, label: "Regions" },
] as const;

export function StatsGrid({ className }: { className?: string }) {
  const stats = useStats();

  const values: Record<string, string | number> = {
    places: stats.totalPlaces,
    trips: stats.totalTrips,
    distance: formatDistance(stats.totalDistanceKm),
    countries: stats.countriesVisited,
  };

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statItems.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-border/50 bg-card/50">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{values[item.key]}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
