"use client"

import { Button } from "@/components/ui/button"
import { Upload, Share2, Download } from "lucide-react"
import Link from "next/link"
import Ballpit from "./Ballpit"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Ballpit Animation Background */}
      <div className="absolute inset-0 opacity-30">
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <Ballpit count={150} gravity={0.7} friction={0.8} wallBounce={0.95} followCursor={true} />
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4 animate-fade-in">
            FileFlow
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-2 animate-fade-in-delay-1">
            Share images without losing quality
          </p>
          <p className="text-lg text-gray-600 animate-fade-in-delay-2">
            Upload, generate unique codes, and share high-quality images instantly
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-delay-3">
          <Link href="/upload">
            <Button className="liquid-glass-button text-lg px-8 py-6 rounded-2xl">
              <Upload className="w-5 h-5 mr-2" />
              Start Uploading
            </Button>
          </Link>
          <Button
            variant="outline"
            className="liquid-glass-button-outline text-lg px-8 py-6 rounded-2xl bg-transparent"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Learn More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in-delay-4">
          <div className="backdrop-blur-md bg-white/20 rounded-3xl p-6 border border-white/30">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Easy Upload</h3>
            <p className="text-gray-600 text-sm">Drag & drop or click to upload your images instantly</p>
          </div>

          <div className="backdrop-blur-md bg-white/20 rounded-3xl p-6 border border-white/30">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Unique Codes</h3>
            <p className="text-gray-600 text-sm">Get a unique 6-character code for easy sharing</p>
          </div>

          <div className="backdrop-blur-md bg-white/20 rounded-3xl p-6 border border-white/30">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 mx-auto">
              <Download className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">High Quality</h3>
            <p className="text-gray-600 text-sm">Download images in their original quality</p>
          </div>
        </div>
      </div>
    </section>
  )
}
