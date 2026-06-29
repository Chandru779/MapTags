"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, User, Compass, Sparkles, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/layout/footer";

const loginOptions = [
  {
    id: "default",
    label: "Default explorer",
    description: "Your personal travel log — trips, stamps, and routes",
    icon: User,
    href: "/explore",
    badge: "Recommended",
  },
  {
    id: "community",
    label: "Community explorer",
    description: "Browse insights and discover how others travel",
    icon: Compass,
    href: "/insights",
  },
  {
    id: "trial",
    label: "Trial user",
    description: "Limited access while we roll out the latest map features",
    icon: Sparkles,
    href: "/explore",
  },
];

export default function SignInPage() {
  const router = useRouter();

  return (
    <>
      <div className="flex min-h-screen items-start justify-center px-4 pt-24 pb-12 sm:pt-28">
        <div className="w-full max-w-lg">
          <Card className="border-border/50 shadow-xl">
            <CardContent className="px-8 pb-8 pt-10">
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-left">
                <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="text-sm font-medium">Scheduled maintenance</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Full account login is temporarily unavailable while we ship
                    map improvements and sync updates. Choose a session below to
                    continue with limited access.
                  </p>
                </div>
              </div>

              <h1 className="text-center text-2xl font-bold">Sign in to mapTag</h1>
              <p className="mt-2 text-center text-sm text-muted-foreground">
                Select how you&apos;d like to continue
              </p>

              <div className="mt-6 space-y-3">
                {loginOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => router.push(option.href)}
                    className="flex w-full items-center gap-4 rounded-xl border border-border/60 bg-card/50 p-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <option.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{option.label}</span>
                        {option.badge && (
                          <Badge variant="secondary" className="text-[10px]">
                            {option.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                ))}
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                New registrations are paused during this release window.{" "}
                <Link href="/about" className="text-primary hover:underline">
                  See what&apos;s changing
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}
