import { Suspense } from "react"
import Hero from "@/components/hero"
import Features from "@/components/features"
import About from "@/components/about"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100">
      <Suspense fallback={<div>Loading...</div>}>
        <Hero />
        <Features />
        <About />
        <Footer />
      </Suspense>
    </main>
  )
}
