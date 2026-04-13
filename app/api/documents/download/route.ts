import { NextResponse } from "next/server";

function isAllowedCloudinaryUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^\w.\-() ]+/g, "_").trim() || "document.pdf";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("url");
  const filename = sanitizeFilename(searchParams.get("filename") ?? "document.pdf");

  if (!fileUrl || !isAllowedCloudinaryUrl(fileUrl)) {
    return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
  }

  const upstream = await fetch(fileUrl, {
    cache: "no-store"
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Unable to download file" }, { status: 502 });
  }

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store"
    }
  });
}
