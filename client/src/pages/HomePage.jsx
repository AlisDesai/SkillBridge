import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-neutral-900 to-stone-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-gray-400/5 rounded-full blur-2xl animate-bounce"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
  <div className="text-2xl font-bold text-white">SkillSwap</div>
  <div className="hidden md:flex space-x-8">
    <a
      href="#"
      className="text-slate-300 hover:text-emerald-300 hover:border-b-2 hover:border-emerald-300 pb-1 transition-all duration-300"
    >
      About
    </a>
    <a
      href="#"
      className="text-slate-300 hover:text-emerald-300 hover:border-b-2 hover:border-emerald-300 pb-1 transition-all duration-300"
    >
      Features
    </a>
    <a
      href="#"
      className="text-slate-300 hover:text-emerald-300 hover:border-b-2 hover:border-emerald-300 pb-1 transition-all duration-300"
    >
      Community
    </a>
    <a
      href="#"
      className="text-slate-300 hover:text-emerald-300 hover:border-b-2 hover:border-emerald-300 pb-1 transition-all duration-300"
    >
      Contact
    </a>
  </div>
</nav>


      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center px-4 py-20">
        <div className="max-w-5xl text-center text-white space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Swap Skills.
            </h1>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">
              Spark Growth.
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Learn what you love. Teach what you know. Join a professional
            community built on collaboration and mutual growth.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 flex-wrap text-center py-8">
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 min-w-[120px]">
              <div className="text-2xl font-bold text-emerald-400">10K+</div>
              <div className="text-sm text-gray-400">Active Learners</div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 min-w-[120px]">
              <div className="text-2xl font-bold text-emerald-400">500+</div>
              <div className="text-sm text-gray-400">Skills Available</div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 min-w-[120px]">
              <div className="text-2xl font-bold text-emerald-400">95%</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="/register"
              className="group bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2"
            >
              Get Started Free
              <span className="text-lg group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
            <a
              href="/login"
              className="bg-gray-800/60 backdrop-blur-sm border border-gray-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-gray-700/60 transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose SkillSwap?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience learning like never before with our innovative skill
            exchange platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 text-center hover:bg-gray-800/60 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105">
            <div className="bg-emerald-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div className="text-emerald-400 text-2xl">👥</div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Connect & Learn
            </h3>
            <p className="text-gray-400">
              Join thousands of passionate learners and teachers in our
              professional community ecosystem
            </p>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 text-center hover:bg-gray-800/60 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105">
            <div className="bg-emerald-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div className="text-emerald-400 text-2xl">📚</div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Skill Exchange
            </h3>
            <p className="text-gray-400">
              Trade your expertise for new knowledge in our innovative
              peer-to-peer learning system
            </p>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8 text-center hover:bg-gray-800/60 hover:border-gray-600/50 transition-all duration-300 transform hover:scale-105">
            <div className="bg-emerald-600/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <div className="text-emerald-400 text-2xl">⭐</div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Quality First
            </h3>
            <p className="text-gray-400">
              Every interaction is rated and reviewed to ensure the highest
              quality learning experience
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Community Says
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <div className="ml-4">
                <div className="text-white font-bold">Sarah Chen</div>
                <div className="text-gray-400">UI/UX Designer</div>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              "SkillSwap transformed my career! I taught design principles and
              learned coding. Now I'm a full-stack designer earning 40% more."
            </p>
          </div>

          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <div className="ml-4">
                <div className="text-white font-bold">Marcus Johnson</div>
                <div className="text-gray-400">Marketing Specialist</div>
              </div>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              "The community here is incredible. I've made lifelong connections
              while mastering photography and teaching digital marketing
              strategies."
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative z-10 text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already transforming their
            careers through skill exchange
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="/register"
              className="group bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-10 py-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3 text-lg"
            >
              <span className="text-2xl">⚡</span>
              Start Learning Today
              <span className="text-lg group-hover:translate-x-1 transition-transform">
                →
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-neutral-900/80 backdrop-blur-sm border-t border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">
                SkillSwap
              </div>
              <p className="text-gray-400">
                Empowering professional growth through collaborative learning
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-gray-300 cursor-pointer transition-colors">
                  How it Works
                </div>
                <div className="hover:text-gray-300 cursor-pointer transition-colors">
                  Find Skills
                </div>
                <div className="hover:text-gray-300 cursor-pointer transition-colors">
                  Teach Skills
                </div>
                <div className="hover:text-gray-300 cursor-pointer transition-colors">
                  Community
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-gray-300 cursor-pointer transition-colors">
                  Help Center
                </div>
                <div className="hover:text-gray-300 cursor-pointer transition-colors">
                  Contact Us
                </div>
                <div className="hover:text-gray-300 cursor-pointer transition-colors">
                  Safety
                </div>
                <div className="hover:text-gray-300 cursor-pointer transition-colors">
                  Guidelines
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800/60 border border-gray-700/50 rounded-lg flex items-center justify-center hover:bg-gray-700/60 hover:border-gray-600/50 transition-colors cursor-pointer">
                  <span className="text-gray-300 text-lg">💼</span>
                </div>
                <div className="w-10 h-10 bg-gray-800/60 border border-gray-700/50 rounded-lg flex items-center justify-center hover:bg-gray-700/60 hover:border-gray-600/50 transition-colors cursor-pointer">
                  <span className="text-gray-300 text-lg">🌐</span>
                </div>
                <div className="w-10 h-10 bg-gray-800/60 border border-gray-700/50 rounded-lg flex items-center justify-center hover:bg-gray-700/60 hover:border-gray-600/50 transition-colors cursor-pointer">
                  <span className="text-gray-300 text-lg">📧</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700/50 mt-8 pt-8 text-center text-gray-500">
            © 2025 SkillSwap. Professional skill exchange platform.
          </div>
        </div>
      </footer>
    </div>
  );
}
