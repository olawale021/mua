import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import sharp from "sharp";
import { skinAnalysisSchema } from "@/lib/analysis-schema";
import { SKIN_ANALYSIS_PROMPT } from "@/lib/prompts";

// Check if the buffer looks like a HEIC/HEIF file
function isHeic(buf: Buffer): boolean {
  // HEIC files have 'ftyp' at offset 4 and 'heic'/'heix'/'heif' brand
  if (buf.length < 12) return false;
  const ftyp = buf.toString("ascii", 4, 8);
  if (ftyp !== "ftyp") return false;
  const brand = buf.toString("ascii", 8, 12);
  return ["heic", "heix", "heif", "mif1"].includes(brand);
}

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    if (!image.startsWith("data:")) {
      return NextResponse.json(
        { error: "Invalid image format. Expected data URL." },
        { status: 400 }
      );
    }

    // Extract raw bytes from the data URL
    const commaIndex = image.indexOf(",");
    const base64Data = image.substring(commaIndex + 1);
    let rawBuffer = Buffer.from(base64Data, "base64");

    // If HEIC, convert to JPEG first using pure-JS decoder
    if (isHeic(rawBuffer)) {
      const convert = require("heic-convert");
      rawBuffer = await convert({
        buffer: rawBuffer,
        format: "JPEG",
        quality: 0.9,
      });
    }

    // Resize with sharp (handles JPEG, PNG, WebP, etc.)
    const jpegBuffer = await sharp(rawBuffer)
      .resize(1024, 1024, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Choose provider
    const provider =
      request.nextUrl.searchParams.get("provider") || "openai";

    const model =
      provider === "anthropic"
        ? anthropic("claude-sonnet-4-20250514")
        : openai.chat("gpt-4o");

    const { object: analysis } = await generateObject({
      model,
      schema: skinAnalysisSchema,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: SKIN_ANALYSIS_PROMPT },
            {
              type: "image",
              image: jpegBuffer,
              mediaType: "image/jpeg",
            },
          ],
        },
      ],
    });

    // Return analysis + converted JPEG so the client can display it
    const jpegDataUrl = `data:image/jpeg;base64,${jpegBuffer.toString("base64")}`;
    return NextResponse.json({ ...analysis, photoUrl: jpegDataUrl });
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Analysis failed",
      },
      { status: 500 }
    );
  }
}
