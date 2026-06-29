import Link from "next/link";
import { ArrowRight, MapPin, Route, Layers } from "lucide-react";
import { BrandWordmark } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen pt-16">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4">
            Platform update in progress
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            The map-first home for your travels
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            <BrandWordmark /> helps explorers stamp places, plan multi-stop routes,
            and share interactive travel portfolios — all on a living map. We&apos;re
            currently maintaining the platform and keeping a focused dataset live
            while we ship the next wave of features.
          </p>

          <div className="mt-10 space-y-6 text-muted-foreground">
            <section>
              <h2 className="text-xl font-semibold text-foreground">
                What you can do today
              </h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed">
                <li>
                  Interactive maps with road-snapped routes, place stamps, photo
                  heatmaps, and time-spent zones
                </li>
                <li>
                  Personal travel log on Explore — your trips, places, and stories
                </li>
                <li>
                  Community Insights — browse other explorers&apos; portfolios and
                  travel patterns
                </li>
                <li>
                  Multi-stop trip planning with distance and route visualization
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                What we&apos;re improving right now
              </h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed">
                <li>Account login and onboarding (temporarily limited)</li>
                <li>Real-time cloud sync across devices</li>
                <li>Social features — follow explorers, react to stamps</li>
                <li>GPX import and live GPS track recording</li>
                <li>Expanded explorer directory and public profile URLs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground">
                About the current dataset
              </h2>
              <p className="mt-3 text-sm leading-relaxed">
                During this maintenance window we&apos;re serving a curated set of
                explorer profiles and travel records through our API. The
                experience mirrors full production — routes, photos, heatmaps,
                and portfolios load the same way they will at scale. Your session
                stamps persist locally until cloud sync returns.
              </p>
            </section>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <MapPin className="mb-3 h-8 w-8 text-primary" />
                <h3 className="font-semibold">Explore</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your personal travel map
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Layers className="mb-3 h-8 w-8 text-primary" />
                <h3 className="font-semibold">Insights</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Browse community portfolios
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Route className="mb-3 h-8 w-8 text-primary" />
                <h3 className="font-semibold">Trips</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Plan multi-stop routes
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-in">
              <Button className="gap-2">
                Sign in to continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button variant="outline">Go to Explore</Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
