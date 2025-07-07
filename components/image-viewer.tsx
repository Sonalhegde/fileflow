"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Eye, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

interface ImageData {
  code: string
  filename: string
  file_path: string
  file_size: number
  mime_type: string
  public_url: string
  created_at: string
}

interface ImageViewerProps {
  imageData: ImageData
}

export default function ImageViewer({ imageData }: ImageViewerProps) {
  const [copied, setCopied] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const copyToClipboard = async () => {
    const shareUrl = window.location.href
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard",
    })
  }

  const downloadImage = () => {
    const link = document.createElement("a")
    link.href = imageData.public_url
    link.download = imageData.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto pt-20">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            FileFlow
          </Link>
          <p className="text-gray-600 mt-2">Viewing shared image</p>
        </div>

        <Card className="backdrop-blur-md bg-white/30 border-white/20 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <Eye className="w-6 h-6 text-purple-600" />
              {imageData.filename}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="relative inline-block max-w-full">
                <img
                  src={imageData.public_url || "/placeholder.svg"}
                  alt={imageData.filename}
                  className="max-w-full max-h-[70vh] rounded-2xl shadow-lg object-contain"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">File Details</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Code:</span> {imageData.code}
                  </p>
                  <p>
                    <span className="font-medium">Size:</span> {formatFileSize(imageData.file_size)}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> {imageData.mime_type}
                  </p>
                  <p>
                    <span className="font-medium">Uploaded:</span> {new Date(imageData.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-white/50 rounded-2xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Share Options</h3>
                <div className="space-y-2">
                  <Button onClick={copyToClipboard} className="liquid-glass-button w-full justify-start" size="sm">
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button onClick={downloadImage} className="liquid-glass-button w-full justify-start" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Original
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-white/20">
              <Link href="/upload">
                <Button className="liquid-glass-button">Upload Your Own Image</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
