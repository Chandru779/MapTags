"use client";

import {
  MapPin,
  Route,
  Flame,
  Layers,
  LocateFixed,
  ZoomIn,
  ZoomOut,
  ImageIcon,
  Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MapLayerVisibility } from "@/lib/types";

interface MapToolbarProps {
  stampMode: boolean;
  onStampToggle: () => void;
  showStamp?: boolean;
  layers: MapLayerVisibility;
  onLayerToggle: (key: keyof MapLayerVisibility) => void;
  onFitAll: () => void;
  onRecenter: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPlacesListToggle: () => void;
  placesListOpen: boolean;
  placeCount: number;
}

export function MapToolbar({
  stampMode,
  onStampToggle,
  showStamp = true,
  layers,
  onLayerToggle,
  onFitAll,
  onRecenter,
  onZoomIn,
  onZoomOut,
  onPlacesListToggle,
  placesListOpen,
  placeCount,
}: MapToolbarProps) {
  const layerButtons: {
    key: keyof MapLayerVisibility;
    icon: typeof MapPin;
    label: string;
  }[] = [
    { key: "places", icon: MapPin, label: "Place markers" },
    { key: "routes", icon: Route, label: "Road routes" },
    { key: "heatmap", icon: Flame, label: "Photo heatmap" },
    { key: "heatZones", icon: Layers, label: "Time-spent zones" },
    { key: "photos", icon: ImageIcon, label: "Photo pins" },
  ];

  return (
    <div className="absolute left-4 top-20 z-10 flex flex-col gap-2 sm:left-6">
      {showStamp && (
        <Button
        size={stampMode ? "default" : "icon"}
        variant={stampMode ? "default" : "secondary"}
        title="Click map to add a place stamp"
        className={cn(
          "shadow-lg backdrop-blur-md",
          stampMode && "gap-2 pr-4 shadow-primary/30"
        )}
        onClick={onStampToggle}
      >
        <MapPin className="h-4 w-4" />
        {stampMode && "Stamp mode"}
      </Button>
      )}

      <Button
        size={placesListOpen ? "default" : "icon"}
        variant={placesListOpen ? "default" : "secondary"}
        title="Toggle places list"
        className={cn(
          "shadow-lg backdrop-blur-md",
          placesListOpen && "gap-2 pr-3"
        )}
        onClick={onPlacesListToggle}
      >
        <Map className="h-4 w-4" />
        {placesListOpen && `${placeCount} places`}
      </Button>

      <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-background/80 p-1 shadow-lg backdrop-blur-md">
        {layerButtons.map(({ key, icon: Icon, label }) => (
          <Button
            key={key}
            size="icon"
            variant={layers[key] ? "default" : "ghost"}
            title={label}
            className="h-8 w-8"
            onClick={() => onLayerToggle(key)}
          >
            <Icon className="h-3.5 w-3.5" />
          </Button>
        ))}
      </div>

      <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-background/80 p-1 shadow-lg backdrop-blur-md">
        <Button
          size="icon"
          variant="ghost"
          title="Recenter on your trips"
          className="h-8 w-8"
          onClick={onRecenter}
        >
          <LocateFixed className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          title="Fit all routes and places"
          className="h-8 w-8"
          onClick={onFitAll}
        >
          <Layers className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          title="Zoom in"
          className="h-8 w-8"
          onClick={onZoomIn}
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          title="Zoom out"
          className="h-8 w-8"
          onClick={onZoomOut}
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
