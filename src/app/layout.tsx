import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { ThemeProvider, StoreHydration } from "@/components/providers";
import { StoreInitializer } from "@/components/store-initializer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mapTag — Map-First Travel Storytelling Platform",
  description:
    "Stamp places, plan multi-stop routes, and share interactive travel portfolios. mapTag helps explorers document journeys on the map — not in spreadsheets.",
  keywords: [
    "maptag",
    "travel platform",
    "journey tracker",
    "travel portfolio",
    "route planner",
    "place stamping",
    "interactive travel map",
  ],
  openGraph: {
    title: "mapTag — Map-First Travel Storytelling Platform",
    description:
      "Turn every journey into a living travel portfolio. Stamp places, sketch routes, and share your explorer story on the map.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ThemeProvider>
          <StoreHydration>
            <StoreInitializer />
            <Navbar />
            <main>{children}</main>
          </StoreHydration>
        </ThemeProvider>
      </body>
    </html>
  );
}
