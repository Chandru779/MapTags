import { NextResponse } from "next/server";
import { readPublicData, simulateLatency } from "@/lib/server-data";
import type { UserTravelData } from "@/lib/types";

export async function GET() {
  await simulateLatency(500);
  try {
    const data = await readPublicData<UserTravelData>("user-me.json");
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load user data" },
      { status: 500 }
    );
  }
}
