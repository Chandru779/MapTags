"use client";

import { useEffect } from "react";
import { useTrailMarkStore } from "@/lib/store";

export function StoreInitializer() {
  const loadUserData = useTrailMarkStore((s) => s.loadUserData);
  const initialized = useTrailMarkStore((s) => s.initialized);

  useEffect(() => {
    if (!initialized) {
      loadUserData();
    }
  }, [initialized, loadUserData]);

  return null;
}
