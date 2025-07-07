"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Shield, Eye } from "lucide-react"

interface CodeVerificationProps {
  expectedCode: string
  onVerified: () => void
  filename: string
}

export default function CodeVerification({ expectedCode, onVerified, filename }: CodeVerificationProps) {
  const [inputCode, setInputCode] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)

  const handleVerify = async () => {
    if (!inputCode.trim()) {
      setError("Please enter the verification code")
      return
    }

    setIsVerifying(true)
    setError("")

    // Simulate verification delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (inputCode.trim().toUpperCase() === expectedCode.toUpperCase()) {
      onVerified()
    } else {
      setError("Invalid verification code. Please try again.")
    }

    setIsVerifying(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerify()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-6">
      <Card className="backdrop-blur-md bg-white/30 border-white/20 shadow-xl rounded-3xl overflow-hidden max-w-md w-full">
        <CardHeader className="text-center">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-fit mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Verification Required</CardTitle>
          <p className="text-gray-600">Enter the code to view this image</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Image: <span className="font-medium">{filename}</span>
            </p>
            <p className="text-xs text-gray-500">The sender should have provided you with a verification code</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="code" className="text-sm font-medium text-gray-700">
              Verification Code
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="Enter 6-character code"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value)
                setError("")
              }}
              onKeyPress={handleKeyPress}
              className="rounded-xl border-gray-300 focus:border-purple-400 focus:ring-purple-400 text-center font-mono text-lg"
              maxLength={6}
              disabled={isVerifying}
            />
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          </div>

          <Button
            onClick={handleVerify}
            disabled={isVerifying || !inputCode.trim()}
            className="w-full liquid-glass-button"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                View Image
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">Don't have the code? Contact the person who shared this link.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
