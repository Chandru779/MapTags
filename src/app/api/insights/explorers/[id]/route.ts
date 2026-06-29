import { NextResponse } from "next/server";
import { readPublicData, simulateLatency } from "@/lib/server-data";
import type { ExplorerData } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await simulateLatency(450);
  try {
    const data = await readPublicData<ExplorerData>(`explorers/${id}.json`);
    return NextResponse.json({ ...data, id });
  } catch {
    return NextResponse.json({ error: "Explorer not found" }, { status: 404 });
  }
}
