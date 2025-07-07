import { Shield, Zap, Heart, Code } from "lucide-react"

export default function Features() {
  const features = [
    {
      icon: Shield,
      title: "Secure Storage",
      description: "Your images are stored securely with Supabase's enterprise-grade infrastructure",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Upload and share images instantly with our optimized delivery network",
    },
    {
      icon: Heart,
      title: "Quality Preserved",
      description: "No compression, no quality loss - your images stay exactly as you uploaded them",
    },
    {
      icon: Code,
      title: "Simple Sharing",
      description: "Share with a simple 6-character code - no complex URLs needed",
    },
  ]

  return (
    <section className="py-20 px-4 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Why Choose FileFlow?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built with modern technology and designed for simplicity
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative backdrop-blur-xl bg-white/20 rounded-3xl p-8 border border-white/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/30 liquid-glass-card"
            >
              {/* Liquid glass shimmer effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 text-center group-hover:text-purple-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>

              {/* Floating particles effect */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping animation-delay-2000"></div>
            </div>
          ))}
        </div>

        {/* Additional decorative elements */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 backdrop-blur-md bg-white/20 rounded-full px-6 py-3 border border-white/30 shadow-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">Trusted by developers worldwide</span>
          </div>
        </div>
      </div>
    </section>
  )
}
