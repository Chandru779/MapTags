"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Clock,
  Camera,
  X,
  Move,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlacePhoto } from "@/components/map/place-photo";
import type { Place } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const MOOD_LABEL: Record<Place["mood"], string> = {
  amazing: "Amazing",
  memorable: "Memorable",
  good: "Good",
  okay: "Okay",
};

interface PlaceImmersivePanelProps {
  place: Place | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (id: string) => void;
  isNavigating?: boolean;
}

function ViewpointCanvas({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null
  );

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = {
      x: e.clientX,
      y: e.clientY,
      ox: offset.x,
      oy: offset.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [offset]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setOffset({
      x: Math.max(-120, Math.min(120, dragRef.current.ox + dx * 0.35)),
      y: Math.max(-40, Math.min(40, dragRef.current.oy + dy * 0.2)),
    });
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      className="viewpoint-canvas relative h-44 cursor-grab overflow-hidden rounded-xl active:cursor-grabbing sm:h-52"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <img
        src={src}
        alt={alt}
        className="viewpoint-image h-full w-[140%] max-w-none object-cover"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(1.08)`,
        }}
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
        <p className="flex items-center gap-1.5 text-xs text-white/90">
          <Move className="h-3 w-3" />
          Drag to look around from this spot
        </p>
      </div>
    </div>
  );
}

export function PlaceImmersivePanel({
  place,
  open,
  onOpenChange,
  onDelete,
  isNavigating = false,
}: PlaceImmersivePanelProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [viewpointMode, setViewpointMode] = useState(false);

  const photos = place?.photos ?? [];
  const activePhoto = photos[photoIndex] ?? photos[0];

  const handleClose = () => {
    setViewpointMode(false);
    setPhotoIndex(0);
    onOpenChange(false);
  };

  const prevPhoto = () =>
    setPhotoIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  const nextPhoto = () =>
    setPhotoIndex((i) => (i === photos.length - 1 ? 0 : i + 1));

  return (
    <AnimatePresence>
      {open && place && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-background/80 via-transparent to-transparent"
          />

          <motion.aside
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="absolute inset-x-0 bottom-0 z-30 mx-auto max-w-2xl px-3 pb-3 sm:px-4 sm:pb-4"
          >
            <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/95 shadow-2xl backdrop-blur-xl">
              {isNavigating ? (
                <div className="flex items-center gap-3 px-4 py-6">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <div>
                    <p className="text-sm font-medium">Flying to {place.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Tilting the map for a closer look…
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    {viewpointMode && activePhoto ? (
                      <ViewpointCanvas src={activePhoto} alt={place.name} />
                    ) : (
                      <PlacePhoto
                        src={activePhoto}
                        alt={place.name}
                        className="h-44 w-full sm:h-52"
                      />
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute right-3 top-3 h-8 w-8 rounded-full bg-background/80 shadow-md backdrop-blur-sm"
                      onClick={handleClose}
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    {photos.length > 1 && (
                      <>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/70 backdrop-blur-sm"
                          onClick={prevPhoto}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="absolute right-12 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-background/70 backdrop-blur-sm"
                          onClick={nextPhoto}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-lg font-semibold text-white drop-shadow-md">
                            {place.name}
                          </p>
                          <p className="text-xs text-white/80">
                            {formatDate(place.visitedAt)} ·{" "}
                            {MOOD_LABEL[place.mood]}
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-3.5 w-3.5 drop-shadow",
                                i < place.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-white/40"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 p-4">
                    {place.experience && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {place.experience}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                        <MapPin className="h-3 w-3" />
                        {place.lat.toFixed(3)}, {place.lng.toFixed(3)}
                      </span>
                      {place.timeSpentHours && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                          <Clock className="h-3 w-3" />
                          {place.timeSpentHours}h spent
                        </span>
                      )}
                      {place.photoCount && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1">
                          <Camera className="h-3 w-3" />
                          {place.photoCount} photos
                        </span>
                      )}
                    </div>

                    {place.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {place.tags.map((t) => (
                          <Badge key={t} variant="outline" className="text-xs">
                            #{t}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-1">
                      {activePhoto && (
                        <Button
                          size="sm"
                          variant={viewpointMode ? "default" : "outline"}
                          className="gap-1.5"
                          onClick={() => setViewpointMode(!viewpointMode)}
                        >
                          <Move className="h-3.5 w-3.5" />
                          {viewpointMode ? "Photo view" : "Viewpoint mode"}
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            onDelete(place.id);
                            handleClose();
                          }}
                        >
                          Remove stamp
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
