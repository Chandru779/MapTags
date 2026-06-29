"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlacePhotoProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  sizes?: string;
}

export function PlacePhoto({
  src,
  alt,
  className,
  fallbackClassName,
  sizes,
}: PlacePhotoProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error"
  );

  if (!src || status === "error") {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          fallbackClassName ?? className
        )}
        aria-label={alt}
      >
        <Camera className="h-5 w-5 opacity-50" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {status === "loading" && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted via-muted-foreground/10 to-muted" />
      )}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          status === "loaded" ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("error")}
      />
    </div>
  );
}
