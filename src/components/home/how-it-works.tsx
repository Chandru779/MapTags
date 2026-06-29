"use client";

import { motion } from "framer-motion";
import { howItWorks } from "@/lib/landing-content";

export function HowItWorks() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How mapTag works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From first stamp to shareable portfolio in three steps
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {howItWorks.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative rounded-2xl border border-border/50 bg-card/40 p-8"
            >
              <span className="text-4xl font-bold text-primary/20">
                {step.step}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
