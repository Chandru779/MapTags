"use client";

import { useCallback, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  GripVertical,
  MapPin,
  Trash2,
  Route,
} from "lucide-react";
import Link from "next/link";
import { MapView, type MapViewHandle } from "@/components/map/map-view";
import { useTrailMarkStore } from "@/lib/store";
import {
  reverseGeocode,
  buildRouteFromWaypoints,
  calculateRouteDistanceKm,
} from "@/lib/geo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistance } from "@/lib/utils";

export default function NewTripPage() {
  const router = useRouter();
  const mapRef = useRef<MapViewHandle>(null);

  const draftWaypoints = useTrailMarkStore((s) => s.draftWaypoints);
  const addDraftWaypoint = useTrailMarkStore((s) => s.addDraftWaypoint);
  const removeDraftWaypoint = useTrailMarkStore((s) => s.removeDraftWaypoint);
  const reorderDraftWaypoint = useTrailMarkStore((s) => s.reorderDraftWaypoint);
  const buildTripFromDraft = useTrailMarkStore((s) => s.buildTripFromDraft);
  const clearDraftWaypoints = useTrailMarkStore((s) => s.clearDraftWaypoints);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);

  const draftRoute = useMemo(
    () =>
      buildRouteFromWaypoints(
        [...draftWaypoints].sort((a, b) => a.order - b.order)
      ),
    [draftWaypoints]
  );

  const handleMapClick = useCallback(
    async (lng: number, lat: number) => {
      setAdding(true);
      const name = await reverseGeocode(lat, lng);
      addDraftWaypoint({ name, lat, lng });
      setAdding(false);
    },
    [addDraftWaypoint]
  );

  const handleSave = () => {
    const tripTitle = title.trim() || "Untitled Journey";
    const trip = buildTripFromDraft(tripTitle, description.trim());
    if (trip) {
      router.push(`/trips/${trip.id}`);
    }
  };

  const sortedWaypoints = [...draftWaypoints].sort((a, b) => a.order - b.order);

  return (
    <div className="relative h-[calc(100vh)] pt-16">
      <MapView
        ref={mapRef}
        places={[]}
        trips={[]}
        draftRoute={draftRoute}
        interactive
        onMapClick={handleMapClick}
        className="absolute inset-0 top-16"
      />

      {/* Instructions banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-1/2 top-20 z-10 -translate-x-1/2"
      >
        <Badge className="gap-2 px-4 py-2 text-sm shadow-lg">
          <MapPin className="h-3.5 w-3.5" />
          Click the map to add waypoints — build your route
          {adding && " (finding place...)"}
        </Badge>
      </motion.div>

      {/* Back button */}
      <div className="absolute left-4 top-20 z-10 sm:left-6">
        <Link href="/trips">
          <Button size="icon" variant="secondary" className="shadow-lg">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Trip builder panel */}
      <motion.aside
        initial={{ x: -360, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="absolute bottom-4 left-4 top-20 z-10 flex w-full max-w-md flex-col overflow-hidden rounded-2xl border border-border/50 bg-background/95 shadow-2xl backdrop-blur-xl"
      >
        <div className="border-b border-border/50 px-4 py-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Route className="h-5 w-5 text-primary" />
            Plan a journey
          </h2>
          <p className="text-xs text-muted-foreground">
            Drop pins on the map to sketch your route
          </p>
        </div>

        <div className="space-y-3 border-b border-border/50 p-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Trip title (e.g. Bengaluru → Kashmir)"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this journey about?"
            className="min-h-[60px]"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {sortedWaypoints.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Click the map to add your first waypoint
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {sortedWaypoints.map((wp, idx) => (
                  <motion.div
                    key={wp.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Card className="border-border/50">
                      <CardContent className="flex items-center gap-2 p-3">
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ background: "#f97316" }}
                        >
                          {idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {wp.name}
                          </p>
                        </div>
                        <div className="flex shrink-0 gap-0.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() =>
                              reorderDraftWaypoint(wp.id, "up")
                            }
                            disabled={idx === 0}
                          >
                            <GripVertical className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive"
                            onClick={() => removeDraftWaypoint(wp.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="border-t border-border/50 p-4">
          {draftRoute.length >= 2 && (
            <p className="mb-3 text-center text-sm text-muted-foreground">
              Route distance:{" "}
              <span className="font-semibold text-primary">
                {formatDistance(calculateRouteDistanceKm(draftRoute))}
              </span>
            </p>
          )}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => clearDraftWaypoints()}
              disabled={sortedWaypoints.length === 0}
            >
              Clear
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleSave}
              disabled={sortedWaypoints.length < 2}
            >
              <Check className="h-4 w-4" />
              Save journey
            </Button>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
