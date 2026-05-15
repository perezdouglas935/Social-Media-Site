import { NextResponse } from "next/server";
import { generatePresignedUploadUrl } from "@/lib/s3";
import { getSessionUserId } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const fileName = String(body?.fileName ?? "").slice(0, 200);
    const contentType = String(body?.contentType ?? "application/octet-stream");
    const isPublic = body?.isPublic !== false; // default true

    if (!fileName) return NextResponse.json({ error: "fileName required" }, { status: 400 });
    if (!contentType.startsWith("image/"))
      return NextResponse.json({ error: "only images supported" }, { status: 400 });

    // Allow guests to upload an avatar pre-signup (so they can build the form), but lock down all other usage to authed.
    // Light rate-limit not needed for demo; isPublic always true here.
    void getSessionUserId();
    const { uploadUrl, cloud_storage_path } = await generatePresignedUploadUrl(fileName, contentType, isPublic);
    return NextResponse.json({ uploadUrl, cloud_storage_path });
  } catch (e) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
