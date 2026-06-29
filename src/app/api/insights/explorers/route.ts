import { NextResponse } from "next/server";
import { readPublicData, simulateLatency } from "@/lib/server-data";
import type { ExplorerSummary } from "@/lib/types";

export async function GET() {
  await simulateLatency(400);
  try {
    const data = await readPublicData<ExplorerSummary[]>(
      "explorers/index.json"
    );
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load explorers" },
      { status: 500 }
    );
  }
}
