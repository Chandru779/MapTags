import type { ExplorerData, ExplorerSummary, UserTravelData } from "./types";

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function fetchUserTravelData(): Promise<UserTravelData> {
  await delay();
  const res = await fetch("/api/user/me");
  if (!res.ok) throw new Error("Failed to load your travel data");
  return res.json();
}

export async function fetchExplorers(): Promise<ExplorerSummary[]> {
  await delay(300);
  const res = await fetch("/api/insights/explorers");
  if (!res.ok) throw new Error("Failed to load explorers");
  return res.json();
}

export async function fetchExplorer(id: string): Promise<ExplorerData> {
  await delay(450);
  const res = await fetch(`/api/insights/explorers/${id}`);
  if (!res.ok) throw new Error("Explorer not found");
  return res.json();
}
