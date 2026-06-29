import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

const footerLinks = {
  Product: [
    { href: "/explore", label: "Explore" },
    { href: "/insights", label: "Insights" },
    { href: "/trips", label: "Trips" },
    { href: "/profile", label: "Portfolio" },
  ],
  Company: [
    { href: "/about", label: "About" },
    { href: "/sign-in", label: "Sign in" },
    { href: "/about", label: "Roadmap" },
    { href: "/about", label: "Contact" },
  ],
  Legal: [
    { href: "/about", label: "Privacy" },
    { href: "/about", label: "Terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/20 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-xl border border-border/50 bg-card/50 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Platform maintenance.</strong>{" "}
          mapTag is live with a focused explorer dataset while we ship map and
          sync improvements. Full account registration is paused briefly —{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            sign in with limited access
          </Link>{" "}
          to continue.
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <BrandLogo size="sm" showTagline />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The map-first platform for documenting journeys, planning routes,
              and sharing interactive travel portfolios with the world.
            </p>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold">{group}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} mapTag. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Map-first travel storytelling for the modern explorer.
          </p>
        </div>
      </div>
    </footer>
  );
}
