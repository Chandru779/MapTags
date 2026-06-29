"use client";

import { motion } from "framer-motion";
import { platformStats } from "@/lib/landing-content";
import { Card, CardContent } from "@/components/ui/card";

export function PlatformStats() {
  return (
    <section className="border-y border-border/50 bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Trusted by explorers worldwide
          </h2>
          <p className="mt-3 text-muted-foreground">
            Thousands of travelers use mapTag to document routes, stamp
            destinations, and share their journeys on the map.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {platformStats.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50 bg-card/50">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          2.4M+ kilometers tracked · 18,000+ trips completed · Growing every day
        </p>
      </div>
    </section>
  );
}
