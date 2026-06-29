"use client";

import { useState } from "react";
import { Star, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import type { Mood, Place } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: "amazing", emoji: "🤩", label: "Amazing" },
  { value: "memorable", emoji: "✨", label: "Memorable" },
  { value: "good", emoji: "😊", label: "Good" },
  { value: "okay", emoji: "👍", label: "Okay" },
];

interface StampDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lat: number;
  lng: number;
  placeName: string;
  onPlaceNameChange: (name: string) => void;
  onSave: (data: {
    name: string;
    experience: string;
    rating: number;
    mood: Mood;
    tags: string[];
  }) => void;
  loading?: boolean;
}

export function StampDialog({
  open,
  onOpenChange,
  lat,
  lng,
  placeName,
  onPlaceNameChange,
  onSave,
  loading,
}: StampDialogProps) {
  const [experience, setExperience] = useState("");
  const [rating, setRating] = useState(5);
  const [mood, setMood] = useState<Mood>("amazing");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const handleSave = () => {
    if (!placeName.trim()) return;
    onSave({
      name: placeName.trim(),
      experience: experience.trim(),
      rating,
      mood,
      tags,
    });
    setExperience("");
    setRating(5);
    setMood("amazing");
    setTags([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Stamp this place
          </DialogTitle>
          <DialogDescription>
            {lat.toFixed(4)}, {lng.toFixed(4)} — Share your experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Place name</label>
            <Input
              value={placeName}
              onChange={(e) => onPlaceNameChange(e.target.value)}
              placeholder="Where are you?"
              className="mt-1.5"
            />
          </div>

          <div>
            <label className="text-sm font-medium">How was it?</label>
            <div className="mt-2 flex gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={cn(
                    "flex flex-1 flex-col items-center gap-1 rounded-xl border p-2 text-xs transition",
                    mood === m.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <span className="text-lg">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Rating</label>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="p-1 transition hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-6 w-6",
                      n <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Your story</label>
            <Textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="What made this place special?"
              className="mt-1.5 min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Tags</label>
            <div className="mt-1.5 flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="beach, food, solo..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="secondary" onClick={addTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={!placeName.trim() || loading}
          >
            {loading ? "Saving..." : "Stamp this place 📍"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface PlaceDetailDialogProps {
  place: Place | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete?: (id: string) => void;
}

export function PlaceDetailDialog({
  place,
  open,
  onOpenChange,
  onDelete,
}: PlaceDetailDialogProps) {
  if (!place) return null;

  const moodEmoji =
    MOODS.find((m) => m.value === place.mood)?.emoji ?? "📍";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{moodEmoji}</span>
            {place.name}
          </DialogTitle>
          <DialogDescription>{formatDate(place.visitedAt)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < place.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground"
                )}
              />
            ))}
          </div>

          {place.photos && place.photos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {place.photos.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt={place.name}
                  className="h-32 w-44 shrink-0 rounded-lg object-cover"
                />
              ))}
            </div>
          )}

          {place.experience && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {place.experience}
            </p>
          )}

          {place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {place.tags.map((t) => (
                <Badge key={t} variant="outline">
                  #{t}
                </Badge>
              ))}
            </div>
          )}

          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                onDelete(place.id);
                onOpenChange(false);
              }}
            >
              Remove stamp
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
