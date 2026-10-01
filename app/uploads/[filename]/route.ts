import { NextRequest, NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  
  if (!filename) {
    return new NextResponse("File not found", { status: 404 });
  }

  // Ensure no directory traversal
  const safeFilename = path.basename(filename);
  const filePath = path.join(process.cwd(), "public", "uploads", safeFilename);
  
  if (!existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  try {
    const fileBuffer = await fs.readFile(filePath);
    
    let contentType = "image/jpeg";
    if (safeFilename.endsWith(".png")) contentType = "image/png";
    else if (safeFilename.endsWith(".webp")) contentType = "image/webp";
    else if (safeFilename.endsWith(".gif")) contentType = "image/gif";
    else if (safeFilename.endsWith(".svg")) contentType = "image/svg+xml";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Error reading file", { status: 500 });
  }
}
