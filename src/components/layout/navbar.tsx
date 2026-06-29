"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Compass,
  MapPin,
  Route,
  User,
  Menu,
  X,
  Lightbulb,
  LogIn,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";

const appNavItems = [
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/trips", label: "Trips", icon: Route },
  { href: "/profile", label: "Profile", icon: User },
];

const landingNavItems = [
  { href: "/about", label: "About" },
  { href: "/sign-in", label: "Sign in" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isLanding = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isLanding
          ? scrolled
            ? "border-b border-border/40 bg-background/85 shadow-sm backdrop-blur-xl"
            : "bg-background/30 backdrop-blur-md"
          : "border-b border-border/40 bg-background/80 backdrop-blur-xl"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <BrandLogo size="md" showTagline />
        </Link>

        {isLanding ? (
          <nav className="hidden items-center gap-1 md:flex">
            {landingNavItems.map(({ href, label }) => (
              <Link key={href} href={href}>
                <Button variant="ghost" size="sm">
                  {label}
                </Button>
              </Link>
            ))}
            <Link href="/sign-in">
              <Button size="sm" className="ml-2 gap-2 shadow-lg shadow-primary/20">
                Get started
              </Button>
            </Link>
          </nav>
        ) : (
          <nav className="hidden items-center gap-1 md:flex">
            {appNavItems.map(({ href, label, icon: Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href}>
                  <Button
                    variant={active ? "secondary" : "ghost"}
                    size="sm"
                    className={cn("gap-2", active && "bg-primary/10 text-primary")}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              );
            })}
            <Link href="/explore?mode=stamp">
              <Button size="sm" className="ml-2 gap-2 shadow-lg shadow-primary/20">
                <MapPin className="h-4 w-4" />
                Stamp a place
              </Button>
            </Link>
          </nav>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-border/40 bg-background/95 backdrop-blur-xl md:hidden"
        >
          <nav className="flex flex-col gap-1 p-4">
            {isLanding ? (
              <>
                {landingNavItems.map(({ href, label }) => (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      {href === "/sign-in" && <LogIn className="h-4 w-4" />}
                      {label}
                    </Button>
                  </Link>
                ))}
                <Link href="/sign-in" onClick={() => setMobileOpen(false)}>
                  <Button className="mt-2 w-full gap-2">Get started</Button>
                </Link>
              </>
            ) : (
              <>
                {appNavItems.map(({ href, label, icon: Icon }) => (
                  <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3">
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  </Link>
                ))}
                <Link href="/explore?mode=stamp" onClick={() => setMobileOpen(false)}>
                  <Button className="mt-2 w-full gap-2">
                    <MapPin className="h-4 w-4" />
                    Stamp a place
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
