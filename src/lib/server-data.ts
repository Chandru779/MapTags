import { readFile } from "fs/promises";
import path from "path";

export async function simulateLatency(ms = 350) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function readPublicData<T>(filePath: string): Promise<T> {
  const fullPath = path.join(process.cwd(), "public", "data", filePath);
  const raw = await readFile(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}
