import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function POST() {
  try {
    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "fileflow"

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()

    if (listError) {
      console.error("Error listing buckets:", listError)
      return NextResponse.json({ error: "Failed to check buckets" }, { status: 500 })
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === bucketName)

    if (!bucketExists) {
      // Create the bucket
      const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        allowedMimeTypes: ["image/*"],
        fileSizeLimit: 10485760, // 10MB
      })

      if (createError) {
        console.error("Error creating bucket:", createError)
        return NextResponse.json({ error: "Failed to create bucket" }, { status: 500 })
      }

      console.log(`Created bucket: ${bucketName}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Bucket setup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
