"use client";

import { motion } from "framer-motion";
import { useCases, features } from "@/lib/landing-content";
import { Card, CardContent } from "@/components/ui/card";

export function Features() {
  return (
    <>
      <section className="border-y border-border/50 bg-muted/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Built for people who travel with intent
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whether you&apos;re crossing continents or exploring your own
              backyard, mapTag gives every trip a place on the map.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase, i) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold">{useCase.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {useCase.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to map your story
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powerful features designed around maps — not forms and spreadsheets.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm transition hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <feature.icon
                      className={`mb-4 h-8 w-8 ${feature.color}`}
                    />
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
