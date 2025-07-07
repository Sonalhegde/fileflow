"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"
import { Upload, Copy, Check, Eye, Shield, FileImage, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<null | {
    url: string
    code: string
    filename: string
  }>(null)
  const [viewLink, setViewLink] = useState("")
  const [securityCode, setSecurityCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Handle file upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    console.log("File selected:", file.name, "Size:", file.size, "Type:", file.type)

    // Reset previous states
    setUploadError(null)
    setUploadedFile(null)

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      const error = "File too large. Maximum size is 10MB."
      setUploadError(error)
      toast({ title: "Upload Error", description: error, variant: "destructive" })
      return
    }

    if (!file.type.startsWith("image/")) {
      const error = "Invalid file type. Please upload an image file."
      setUploadError(error)
      toast({ title: "Upload Error", description: error, variant: "destructive" })
      return
    }

    setUploading(true)

    try {
      console.log("Starting upload...")

      const formData = new FormData()
      formData.append("file", file)
      formData.append("filename", file.name)

      console.log("Sending request to /api/upload")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      let responseData: any = null
      let rawText = ""

      try {
        // try to parse JSON even on failure – but fall back to text
        rawText = await response.clone().text()
        responseData = rawText ? JSON.parse(rawText) : null
      } catch {
        /* non-JSON */
      }

      if (!response.ok) {
        const msg = responseData?.error || rawText || `Upload failed with status ${response.status}`
        throw new Error(msg)
      }

      if (!responseData?.publicUrl || !responseData?.code) {
        throw new Error("Invalid response from server – missing code or URL")
      }

      const { publicUrl, code, filename } = responseData

      if (!code || !publicUrl) {
        throw new Error("Invalid response from server - missing code or URL")
      }

      setUploadedFile({
        url: publicUrl,
        code: code,
        filename: filename || file.name,
      })

      toast({
        title: "Upload Successful!",
        description: `Image uploaded with security code: ${code}`,
      })

      console.log("Upload completed successfully:", { code, publicUrl })
    } catch (err: any) {
      console.error("Upload error:", err)
      const errorMessage = err.message || "Upload failed. Please try again."
      setUploadError(errorMessage)
      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: uploading,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
    multiple: false,
  })

  const copyShareLink = async () => {
    if (!uploadedFile) return

    try {
      const shareUrl = `${window.location.origin}/view/${uploadedFile.code}`
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: "Copied!", description: "Share link copied to clipboard." })
    } catch (err) {
      toast({ title: "Copy Failed", description: "Could not copy to clipboard", variant: "destructive" })
    }
  }

  const handleViewFile = () => {
    if (!viewLink.trim() || !securityCode.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both link and security code.",
        variant: "destructive",
      })
      return
    }

    // Extract code from URL if full URL is provided
    let code = securityCode.trim().toUpperCase()
    if (viewLink.includes("/view/")) {
      const urlCode = viewLink.split("/view/")[1]?.split("?")[0]?.split("#")[0]
      if (urlCode) {
        code = urlCode.toUpperCase()
      }
    }

    // Navigate to view page
    window.location.href = `/view/${code}`
  }

  const resetUpload = () => {
    setUploadedFile(null)
    setCopied(false)
    setUploadError(null)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-6">
      <div className="max-w-6xl mx-auto pt-20">
        <header className="text-center mb-12">
          <Link
            href="/"
            className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            FileFlow
          </Link>
          <p className="text-gray-600 mt-2">Upload & share high-quality images securely</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Box 1: Upload File */}
          <Card className="backdrop-blur-md bg-white/30 border-white/20 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Upload className="w-6 h-6 text-purple-600" />
                Upload File
              </CardTitle>
              <p className="text-center text-gray-600">Upload an image and generate a security code</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}

              {!uploadedFile ? (
                <>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                      isDragActive
                        ? "border-purple-400 bg-purple-50/50"
                        : uploading
                          ? "border-gray-300 bg-gray-50/30 cursor-not-allowed"
                          : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/30"
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                        <FileImage className="w-8 h-8 text-white" />
                      </div>
                      {uploading ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
                          <p className="text-black font-medium">Uploading your image...</p>
                          <p className="text-sm text-gray-500 mt-1">Generating security code...</p>
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
                </>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={uploadedFile.url || "/placeholder.svg"}
                        alt={uploadedFile.filename}
                        className="max-w-full max-h-48 rounded-2xl shadow-lg"
                        onError={(e) => {
                          console.error("Image load error:", uploadedFile.url)
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <p className="text-gray-600 font-medium">{uploadedFile.filename}</p>
                  </div>

                  <div className="bg-white/50 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-purple-600" />
                      <p className="text-sm font-medium text-gray-700">Security Code Generated:</p>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <code className="flex-1 bg-gray-100 px-4 py-3 rounded-xl font-mono text-xl font-bold text-purple-600 text-center">
                        {uploadedFile.code}
                      </code>
                      <Button onClick={copyShareLink} className="liquid-glass-button" size="sm">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        <strong>Share Link:</strong> {window.location.origin}/view/{uploadedFile.code}
                      </p>
                      <p className="text-orange-600 font-medium">
                        ⚠️ Recipients need this security code to view the image
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={copyShareLink} className="liquid-glass-button flex-1">
                      {copied ? "Copied!" : "Copy Share Link"}
                    </Button>
                    <Button
                      onClick={resetUpload}
                      variant="outline"
                      className="liquid-glass-button-outline flex-1 bg-transparent"
                    >
                      Upload Another
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Box 2: View File */}
          <Card className="backdrop-blur-md bg-white/30 border-white/20 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Eye className="w-6 h-6 text-blue-600" />
                View File
              </CardTitle>
              <p className="text-center text-gray-600">Enter link and security code to view an image</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-fit mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-gray-600">
                  Have a FileFlow link and security code? Enter them below to view the image.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="viewLink" className="text-sm font-medium text-gray-700">
                    FileFlow Link
                  </Label>
                  <Input
                    id="viewLink"
                    type="url"
                    placeholder="https://fileflow.com/view/ABC123 or just paste the link"
                    value={viewLink}
                    onChange={(e) => setViewLink(e.target.value)}
                    className="rounded-xl border-gray-300 focus:border-blue-400 focus:ring-blue-400"
                  />
                  <p className="text-xs text-gray-500">Paste the full FileFlow link you received</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="securityCode" className="text-sm font-medium text-gray-700">
                    Security Code
                  </Label>
                  <Input
                    id="securityCode"
                    type="text"
                    placeholder="Enter 6-character security code"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value.toUpperCase())}
                    className="rounded-xl border-gray-300 focus:border-blue-400 focus:ring-blue-400 text-center font-mono text-lg"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500">The sender should have provided this code</p>
                </div>
              </div>

              <Button
                onClick={handleViewFile}
                disabled={!viewLink.trim() || !securityCode.trim()}
                className="w-full liquid-glass-button bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Image
              </Button>

              <div className="bg-blue-50/50 rounded-2xl p-4">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Security Notice:</p>
                    <p>
                      Both the link and security code are required to view any image. This ensures your shared content
                      remains private and secure.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
