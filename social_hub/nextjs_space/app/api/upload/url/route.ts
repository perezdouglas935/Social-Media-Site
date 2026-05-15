import { NextResponse } from "next/server";
import { getFileUrl } from "@/lib/s3";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const cloud_storage_path = String(body?.cloud_storage_path ?? "");
    const isPublic = body?.isPublic !== false;
    if (!cloud_storage_path) return NextResponse.json({ error: "path required" }, { status: 400 });
    const url = await getFileUrl(cloud_storage_path, isPublic);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
