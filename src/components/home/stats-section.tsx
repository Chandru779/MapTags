"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-700 via-fuchsia-700 to-amber-600 px-8 py-16 text-center text-white sm:px-16"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Your next adventure deserves a map
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-violet-100">
              Join thousands of explorers on mapTag — stamp places, trace routes,
              and build a travel portfolio the world can explore. Sign in to
              access your log or discover community journeys.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/sign-in">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 bg-white text-violet-800 hover:bg-white/90"
                >
                  Sign in to mapTag
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/insights">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  Browse community insights
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
