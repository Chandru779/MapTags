"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  MapPin,
  Route,
  Users,
  Search,
} from "lucide-react";
import { fetchExplorers } from "@/lib/api-client";
import type { ExplorerSummary } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistance } from "@/lib/utils";

export default function InsightsPage() {
  const [explorers, setExplorers] = useState<ExplorerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchExplorers()
      .then(setExplorers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = explorers.filter(
    (e) =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.location.toLowerCase().includes(query.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">
          Loading explorer profiles…
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-16">
        <p className="text-destructive">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Badge variant="secondary" className="mb-3">
            Community insights
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore how others travel
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Browse public travel portfolios, compare routes, and discover
            patterns across the mapTag community. Click any explorer to view
            their full map, trips, and place history.
          </p>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, location, or tag…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filtered.map((explorer, i) => (
            <motion.div
              key={explorer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link href={`/insights/${explorer.id}`}>
                <Card className="h-full border-border/50 transition hover:border-primary/30 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {explorer.avatar ?? explorer.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-lg font-semibold">
                          {explorer.name}
                        </h2>
                        <p className="text-sm text-primary">{explorer.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {explorer.location}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                      {explorer.bio}
                    </p>

                    {explorer.highlightTrip && (
                      <p className="mt-3 text-sm">
                        <span className="text-muted-foreground">
                          Highlight trip:{" "}
                        </span>
                        <span className="font-medium">
                          {explorer.highlightTrip}
                        </span>
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {explorer.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="mt-5 grid grid-cols-4 gap-2 border-t border-border/50 pt-4 text-center">
                      <div>
                        <p className="flex items-center justify-center gap-1 text-lg font-bold">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          {explorer.stats.totalPlaces}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Places
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center justify-center gap-1 text-lg font-bold">
                          <Route className="h-3.5 w-3.5 text-primary" />
                          {explorer.stats.totalTrips}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Trips
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold">
                          {formatDistance(explorer.stats.totalDistanceKm)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Distance
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center justify-center gap-1 text-lg font-bold">
                          <Globe className="h-3.5 w-3.5 text-primary" />
                          {explorer.stats.countriesVisited}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Regions
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                      View travel history
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <Users className="mx-auto mb-3 h-10 w-10 opacity-40" />
            No explorers match your search.
          </div>
        )}
      </div>
    </div>
  );
}
