import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(imageUrl)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Test if URL is accessible and is an image
    try {
      const response = await fetch(imageUrl, { method: "HEAD" })
      if (!response.ok) {
        throw new Error("Image URL is not accessible")
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.startsWith("image/")) {
        throw new Error("URL does not point to an image")
      }
    } catch (error) {
      return NextResponse.json(
        {
          error: "Unable to access image URL or URL does not point to a valid image",
        },
        { status: 400 },
      )
    }

    // Generate unique code
    const code = Math.random().toString(36).slice(2, 8).toUpperCase()
    const filename = imageUrl.split("/").pop() || "shared-image"

    // Store in database using service role (bypasses RLS)
    const { error: dbError } = await supabaseAdmin.from("shared_images").insert({
      code,
      filename,
      file_path: imageUrl, // Store the original URL as file_path
      file_size: 0, // Unknown size for external URLs
      mime_type: "image/unknown",
      public_url: imageUrl,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Failed to save link share" }, { status: 500 })
    }

    return NextResponse.json({
      code,
      filename,
      publicUrl: imageUrl,
    })
  } catch (error: any) {
    console.error("Share link API error:", error)
    return NextResponse.json({ error: error.message || "Failed to share link" }, { status: 500 })
  }
}
