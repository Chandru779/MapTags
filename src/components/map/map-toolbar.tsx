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
  Crosshair,
  Maximize2,
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

function ToolbarButton({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Button
      size="icon"
      variant={active ? "default" : "ghost"}
      title={label}
      aria-label={label}
      className={cn(
        "relative h-9 w-9 shrink-0",
        active && "shadow-sm shadow-primary/20"
      )}
      onClick={onClick}
    >
      {children}
    </Button>
  );
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
    <div className="absolute left-3 top-[4.75rem] z-10 flex max-h-[calc(100%-6rem)] flex-col gap-2 overflow-y-auto overscroll-contain sm:left-5 [&::-webkit-scrollbar]:hidden">
      <div className="flex w-11 flex-col gap-1 rounded-xl border border-border/50 bg-background/85 p-1 shadow-lg backdrop-blur-md">
        {showStamp && (
          <ToolbarButton
            active={stampMode}
            label={stampMode ? "Exit stamp mode" : "Stamp a place on the map"}
            onClick={onStampToggle}
          >
            <Crosshair className="h-4 w-4" />
          </ToolbarButton>
        )}
        <ToolbarButton
          active={placesListOpen}
          label={
            placesListOpen
              ? "Hide travel log"
              : `Show travel log (${placeCount} places)`
          }
          onClick={onPlacesListToggle}
        >
          <Map className="h-4 w-4" />
          {placeCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-0.5 text-[9px] font-bold text-primary-foreground">
              {placeCount > 99 ? "99+" : placeCount}
            </span>
          )}
        </ToolbarButton>
      </div>

      <div className="flex w-11 flex-col gap-0.5 rounded-xl border border-border/50 bg-background/85 p-1 shadow-lg backdrop-blur-md">
        <p className="px-1 pb-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
          Layers
        </p>
        {layerButtons.map(({ key, icon: Icon, label }) => (
          <ToolbarButton
            key={key}
            active={layers[key]}
            label={label}
            onClick={() => onLayerToggle(key)}
          >
            <Icon className="h-3.5 w-3.5" />
          </ToolbarButton>
        ))}
      </div>

      <div className="flex w-11 flex-col gap-0.5 rounded-xl border border-border/50 bg-background/85 p-1 shadow-lg backdrop-blur-md">
        <ToolbarButton label="Recenter on your trips" onClick={onRecenter}>
          <LocateFixed className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Fit all routes and places" onClick={onFitAll}>
          <Maximize2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Zoom in" onClick={onZoomIn}>
          <ZoomIn className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton label="Zoom out" onClick={onZoomOut}>
          <ZoomOut className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>
    </div>
  );
}
