import { Button } from "@/components/ui/button"
import { Linkedin, Mail, Heart, Star, Code2 } from "lucide-react"

export default function About() {
  return (
    <section className="py-20 px-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="backdrop-blur-xl bg-white/20 rounded-3xl p-12 border border-white/30 shadow-2xl liquid-glass-card group">
          {/* Liquid glass shimmer effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-in-out"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-pink-500 animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                About FileFlow
              </h2>
              <Star className="w-8 h-8 text-yellow-500 animate-pulse animation-delay-2000" />
            </div>

            <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
              FileFlow is a modern image sharing platform built with cutting-edge technology. Created with passion for
              simplicity and quality, it allows you to share high-resolution images without any quality loss through
              unique, easy-to-remember codes.
            </p>

            {/* Tech stack with liquid glass cards */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                <Code2 className="w-6 h-6 text-purple-600" />
                Built with
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {["Next.js", "Supabase", "TypeScript", "Tailwind CSS", "Liquid Glass UI"].map((tech, index) => (
                  <span
                    key={tech}
                    className="group/tech relative px-6 py-3 backdrop-blur-md bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full text-sm font-medium text-gray-700 border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-500/30"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Mini shimmer effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/tech:translate-x-full transition-transform duration-700"></div>
                    <span className="relative z-10">{tech}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Creator section with enhanced styling */}
            <div className="border-t border-white/30 pt-8">
              <div className="backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                  Created by Sonal Hegde
                </h3>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <a href="https://www.linkedin.com/in/sonalhegde/" target="_blank" rel="noopener noreferrer">
                    <Button className="liquid-glass-button flex items-center gap-2 group/btn">
                      <Linkedin className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                      LinkedIn Profile
                    </Button>
                  </a>
                  <a href="mailto:sonalhhegde@gmail.com">
                    <Button className="liquid-glass-button flex items-center gap-2 group/btn">
                      <Mail className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                      Email Me
                    </Button>
                  </a>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">
                  Have questions or suggestions? Feel free to reach out! I'd love to hear from you and help make
                  FileFlow even better.
                </p>

                {/* Decorative elements */}
                <div className="flex justify-center gap-4 mt-6">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-2000"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-4000"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute top-6 right-6 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-ping"></div>
          <div className="absolute bottom-6 left-6 w-2 h-2 bg-pink-400 rounded-full opacity-60 animate-ping animation-delay-2000"></div>
          <div className="absolute top-1/2 left-6 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-ping animation-delay-4000"></div>
        </div>
      </div>
    </section>
  )
}
