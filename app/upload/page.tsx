"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Upload, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<{
    url: string
    code: string
    filename: string
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const BUCKET = "public" // use Supabase's default bucket

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    if (!isSupabaseConfigured) {
      toast({
        title: "Uploads disabled in preview",
        description:
          "Supabase environment variables are missing, so uploads can't be processed in this preview. " +
          "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable full functionality.",
        variant: "destructive",
      })
      return
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const uniqueCode = generateUniqueCode()
      const fileExt = file.name.split(".").pop()
      const fileName = `${uniqueCode}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from(BUCKET).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      })

      if (error) throw error

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(fileName)

      // Store metadata in database
      const { error: dbError } = await supabase.from("shared_images").insert({
        code: uniqueCode,
        filename: file.name,
        file_path: fileName,
        file_size: file.size,
        mime_type: file.type,
        public_url: publicUrl,
      })

      if (dbError) throw dbError

      setUploadedFile({
        url: publicUrl,
        code: uniqueCode,
        filename: file.name,
      })

      toast({
        title: "Upload successful!",
        description: "Your image has been uploaded and is ready to share",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: !isSupabaseConfigured,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
    multiple: false,
  })

  const copyToClipboard = async () => {
    if (!uploadedFile) return

    const shareUrl = `${window.location.origin}/view/${uploadedFile.code}`
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto pt-20">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            FileFlow
          </Link>
          <p className="text-gray-600 mt-2">Upload and share your images with style</p>
        </div>

        {!isSupabaseConfigured && (
          <p className="mb-4 text-center text-sm text-red-600">
            Uploads are disabled in this preview — configure your Supabase keys to enable.
          </p>
        )}

        {!uploadedFile ? (
          <Card className="backdrop-blur-md bg-white/30 border-white/20 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800">Upload Your Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? "border-purple-400 bg-purple-50/50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/30"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  {uploading ? (
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Uploading your image...</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-lg font-medium text-gray-700">
                        {isDragActive ? "Drop your image here" : "Drag & drop an image here"}
                      </p>
                      <p className="text-gray-500">or click to browse</p>
                      <p className="text-sm text-gray-400">Supports PNG, JPG, JPEG, GIF, WebP (max 10MB)</p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="backdrop-blur-md bg-white/30 border-white/20 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Check className="w-6 h-6 text-green-500" />
                Upload Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={uploadedFile.url || "/placeholder.svg"}
                    alt={uploadedFile.filename}
                    className="max-w-full max-h-64 rounded-2xl shadow-lg"
                  />
                </div>
                <p className="mt-2 text-gray-600 font-medium">{uploadedFile.filename}</p>
              </div>

              <div className="bg-white/50 rounded-2xl p-4">
                <p className="text-sm text-gray-600 mb-2">Your unique share code:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 px-4 py-2 rounded-xl font-mono text-lg font-bold text-purple-600">
                    {uploadedFile.code}
                  </code>
                  <Button onClick={copyToClipboard} className="liquid-glass-button" size="sm">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Share this code or the link: {window.location.origin}/view/{uploadedFile.code}
                </p>
              </div>

              <div className="flex gap-3">
                <Button onClick={copyToClipboard} className="liquid-glass-button flex-1">
                  Copy Share Link
                </Button>
                <Button
                  onClick={() => setUploadedFile(null)}
                  variant="outline"
                  className="liquid-glass-button-outline flex-1"
                >
                  Upload Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
