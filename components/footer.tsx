import Link from "next/link"

export default function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-white/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            FileFlow
          </Link>
          <p className="text-gray-600 mt-2 mb-6">Share images without losing quality</p>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Link href="/upload" className="text-gray-600 hover:text-purple-600 transition-colors">
              Upload
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-purple-600 transition-colors">
              About
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-purple-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-purple-600 transition-colors">
              Terms
            </Link>
          </div>

          <div className="border-t border-white/20 pt-6">
            <p className="text-gray-500 text-sm">© 2024 FileFlow. Built with ❤️ using Next.js and Supabase.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
