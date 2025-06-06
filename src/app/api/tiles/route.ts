import { LRUCache } from "lru-cache";
import { NextResponse } from "next/server";

const tileCache = new LRUCache<string, string>({
  max: 1000,
  ttl: 1000 * 60 * 60,
});

const username = process.env.WMS_USERNAME!;
const password = process.env.WMS_PASSWORD!;
const authHeader =
  "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tileUrl = searchParams.get("url");

  if (!tileUrl) {
    return NextResponse.json({ error: "Missing tile URL" }, { status: 400 });
  }

  try {
    const cachedTile = tileCache.get(tileUrl);
    if (cachedTile) {
      return NextResponse.json({ data: cachedTile });
    }

    const response = await fetch(tileUrl, {
      headers: {
        Authorization: authHeader,
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error("Tile fetch failed");
    }

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = blob.type;
    const dataUrl = `data:${mimeType};base64,${base64}`;

    tileCache.set(tileUrl, dataUrl);

    return NextResponse.json({ data: dataUrl });
  } catch (error) {
    console.error("Tile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tile" },
      { status: 500 }
    );
  }
}
