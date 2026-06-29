"use client";

import { motion } from "framer-motion";
import {
  MapPin,
  RotateCcw,
  Save,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useTrailMarkStore } from "@/lib/store";
import { StatsGrid } from "@/components/profile/stats-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useState } from "react";

function ProfileEditor({
  profile,
  onSave,
}: {
  profile: { name: string; title: string; bio: string; location: string };
  onSave: (data: {
    name: string;
    title: string;
    bio: string;
    location: string;
  }) => void;
}) {
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [bio, setBio] = useState(profile.bio);
  const [location, setLocation] = useState(profile.location);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({ name, title, bio, location });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <CardContent className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1.5"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Location</label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1.5"
        />
      </div>
      <div>
        <label className="text-sm font-medium">Bio</label>
        <Textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="mt-1.5"
        />
      </div>
      <Button onClick={handleSave} className="gap-2">
        <Save className="h-4 w-4" />
        {saved ? "Saved!" : "Save profile"}
      </Button>
    </CardContent>
  );
}

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const profile = useTrailMarkStore((s) => s.profile);
  const places = useTrailMarkStore((s) => s.places);
  const updateProfile = useTrailMarkStore((s) => s.updateProfile);
  const resetDemo = useTrailMarkStore((s) => s.resetDemo);

  const profileKey = `${profile.name}|${profile.title}|${profile.bio}|${profile.location}`;

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const recentPlaces = [...places]
    .sort((a, b) => new Date(b.visitedAt).getTime() - new Date(a.visitedAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left"
        >
          <Avatar className="h-24 w-24 border-4 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 sm:mt-0 sm:ml-6">
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-lg text-primary">{profile.title}</p>
            <p className="mt-1 text-muted-foreground">{profile.location}</p>
          </div>
        </motion.div>

        <div className="mt-10">
          <StatsGrid />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Edit profile
              </CardTitle>
            </CardHeader>
            <ProfileEditor
              key={profileKey}
              profile={profile}
              onSave={updateProfile}
            />
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Recent stamps
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentPlaces.length === 0 ? (
                <p className="text-sm text-muted-foreground">No stamps yet</p>
              ) : (
                <div className="space-y-3">
                  {recentPlaces.map((place) => (
                    <div
                      key={place.id}
                      className="flex items-start gap-3 rounded-xl border border-border/50 p-3"
                    >
                      <span className="text-lg">📍</span>
                      <div>
                        <p className="font-medium">{place.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(place.visitedAt)}
                        </p>
                        {place.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {place.tags.map((t) => (
                              <Badge key={t} variant="outline" className="text-xs">
                                #{t}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            Toggle theme
          </Button>
          <Button variant="outline" className="gap-2" onClick={resetDemo}>
            <RotateCcw className="h-4 w-4" />
            Reset travel data
          </Button>
        </div>
      </div>
    </div>
  );
}
