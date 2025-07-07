"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import ImageViewer from "@/components/image-viewer"
import CodeVerification from "@/components/code-verification"

interface PageProps {
  params: {
    code: string
  }
}

interface ImageData {
  code: string
  filename: string
  file_path: string
  file_size: number
  mime_type: string
  public_url: string
  created_at: string
}

export default function ViewPage({ params }: PageProps) {
  const [imageData, setImageData] = useState<ImageData | null>(null)
  const [isVerified, setIsVerified] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchImageData() {
      try {
        const { data, error } = await supabase
          .from("shared_images")
          .select("*")
          .eq("code", params.code.toUpperCase())
          .single()

        if (error || !data) {
          setError("Image not found")
          return
        }

        setImageData(data)
      } catch (err) {
        console.error("Error fetching image:", err)
        setError("Failed to load image")
      } finally {
        setLoading(false)
      }
    }

    fetchImageData()
  }, [params.code])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading image...</p>
        </div>
      </div>
    )
  }

  if (error || !imageData) {
    notFound()
  }

  if (!isVerified) {
    return (
      <CodeVerification
        expectedCode={imageData.code}
        onVerified={() => setIsVerified(true)}
        filename={imageData.filename}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <ImageViewer imageData={imageData} />
    </div>
  )
}
