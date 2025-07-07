import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    console.log("Upload API called")

    // Check if service role key is configured
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("SUPABASE_SERVICE_ROLE_KEY not configured")
      return NextResponse.json(
        {
          error: "Server configuration error: SUPABASE_SERVICE_ROLE_KEY not set",
        },
        { status: 500 },
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const filenameIn = formData.get("filename") as string | null

    console.log("File received:", file?.name, "Size:", file?.size)

    if (!file) {
      return NextResponse.json({ error: "No file received" }, { status: 400 })
    }

    const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "fileflow"
    console.log("Using bucket:", bucket)

    // Generate a unique code with retry logic
    let code: string
    let attempts = 0
    const maxAttempts = 5

    do {
      code = Math.random().toString(36).slice(2, 8).toUpperCase()
      attempts++

      // Check if code already exists
      const { count } = await supabaseAdmin
        .from("shared_images")
        .select("id", { count: "exact", head: true })
        .eq("code", code)

      if (!count || count === 0) break

      if (attempts >= maxAttempts) {
        throw new Error("Could not generate unique code after multiple attempts")
      }
    } while (attempts < maxAttempts)

    console.log("Generated code:", code)

    // Create file path
    const ext = (filenameIn ?? file.name).split(".").pop() ?? "png"
    const path = `${code}.${ext}`

    console.log("Upload path:", path)

    // Ensure bucket exists and is public
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets()
      const bucketExists = buckets?.some((b) => b.id === bucket)

      if (!bucketExists) {
        console.log("Creating bucket:", bucket)
        const { error: createError } = await supabaseAdmin.storage.createBucket(bucket, {
          public: true,
          allowedMimeTypes: ["image/*"],
          fileSizeLimit: 10485760, // 10MB
        })
        if (createError) {
          console.error("Bucket creation error:", createError)
          throw createError
        }
      } else {
        // Ensure bucket is public
        await supabaseAdmin.storage.updateBucket(bucket, { public: true })
      }
    } catch (bucketError) {
      console.error("Bucket setup error:", bucketError)
      return NextResponse.json(
        {
          error: "Storage bucket setup failed: " + (bucketError as Error).message,
        },
        { status: 500 },
      )
    }

    // Upload file
    console.log("Uploading file...")
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage.from(bucket).upload(path, file, {
      upsert: false,
      cacheControl: "3600",
    })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json(
        {
          error: "File upload failed: " + uploadError.message,
        },
        { status: 500 },
      )
    }

    console.log("Upload successful:", uploadData)

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path)
    const publicUrl = urlData.publicUrl

    console.log("Public URL:", publicUrl)

    // Store in database
    console.log("Saving to database...")
    const { error: dbError } = await supabaseAdmin.from("shared_images").insert({
      code,
      filename: filenameIn ?? file.name,
      file_path: path,
      file_size: file.size,
      mime_type: file.type,
      public_url: publicUrl,
    })

    if (dbError) {
      console.error("Database error:", dbError)
      // Clean up uploaded file
      await supabaseAdmin.storage.from(bucket).remove([path])
      return NextResponse.json(
        {
          error: "Database save failed: " + dbError.message,
        },
        { status: 500 },
      )
    }

    console.log("Success! Code:", code)

    return NextResponse.json({
      publicUrl,
      code,
      filename: filenameIn ?? file.name,
    })
  } catch (err: any) {
    console.error("Upload API error:", err)
    return NextResponse.json(
      {
        error: err.message || "Upload failed",
      },
      { status: 500 },
    )
  }
}
