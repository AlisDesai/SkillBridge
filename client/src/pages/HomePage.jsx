import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black via-gray-950 to-slate-950 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main gradient orbs with pulsing animation */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/25 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-teal-600/15 rounded-full blur-2xl animate-bounce"></div>

        {/* Additional atmospheric elements */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-emerald-300/15 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-green-400/12 rounded-full blur-lg animate-pulse delay-3000"></div>
        <div className="absolute top-3/4 left-1/6 w-32 h-32 bg-teal-500/15 rounded-full blur-xl animate-pulse delay-1500"></div>
        <div className="absolute top-1/6 right-1/3 w-40 h-40 bg-emerald-500/12 rounded-full blur-2xl animate-pulse delay-2500"></div>

        {/* More dynamic floating particles */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-emerald-400/80 rounded-full animate-ping shadow-lg shadow-emerald-400/50"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-green-400/90 rounded-full animate-ping delay-1000 shadow-lg shadow-green-400/50"></div>
        <div className="absolute bottom-32 left-1/3 w-3.5 h-3.5 bg-teal-400/70 rounded-full animate-ping delay-2000 shadow-lg shadow-teal-400/50"></div>
        <div className="absolute top-60 right-1/4 w-2.5 h-2.5 bg-emerald-300/80 rounded-full animate-ping delay-3000 shadow-lg shadow-emerald-300/50"></div>
        <div className="absolute bottom-1/3 right-1/6 w-3 h-3 bg-green-300/70 rounded-full animate-ping delay-1500 shadow-lg shadow-green-300/50"></div>
        <div className="absolute top-1/3 left-1/5 w-4 h-4 bg-teal-300/60 rounded-full animate-ping delay-2500 shadow-lg shadow-teal-300/50"></div>

        {/* Enhanced mesh gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/8 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-gray-950/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-emerald-400/5 to-transparent"></div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(34, 197, 94, 0.4) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        {/* Additional visual enhancement layers */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-green-500/5 via-transparent to-emerald-400/5"></div>
      </div>

      {/* Enhanced Navigation with advanced glassmorphism */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400/80 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent leading-normal">
            SkillBridge
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-1 bg-gray-950/40 backdrop-blur-xl rounded-2xl p-2 border border-gray-800/40 shadow-xl">
          <a
            href="#"
            className="relative px-4 py-3 text-sm text-slate-300 hover:text-white rounded-xl transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-green-500/15 to-teal-600/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative font-medium">About</span>
          </a>
          <a
            href="#"
            className="relative px-4 py-3 text-sm text-slate-300 hover:text-white rounded-xl transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-green-500/15 to-teal-600/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative font-medium">Features</span>
          </a>
          <a
            href="#"
            className="relative px-4 py-3 text-sm text-slate-300 hover:text-white rounded-xl transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-green-500/15 to-teal-600/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative font-medium">Community</span>
          </a>
          <a
            href="#"
            className="relative px-4 py-3 text-sm text-slate-300 hover:text-white rounded-xl transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-green-500/15 to-teal-600/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative font-medium">Contact</span>
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="/login"
            className="hidden md:block text-sm text-slate-300 hover:text-emerald-400 transition-colors duration-300 font-medium"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="relative bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-105 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative">Get Started</span>
          </a>
        </div>
      </nav>

      {/* Enhanced Hero Section with advanced animations */}
      <div className="relative z-10 flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl text-center text-white space-y-12">
          <div className="space-y-8">
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-black leading-normal">
                <span className="block bg-gradient-to-r from-white via-gray-100 to-slate-200 bg-clip-text text-transparent mb-6 drop-shadow-2xl pb-4">
                  Swap Skills.
                </span>
                <span className="block bg-gradient-to-r from-emerald-300 via-green-400 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl pb-4">
                  Spark Growth.
                </span>
              </h1>
              {/* Subtle glow effect behind text */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-green-500/5 to-teal-600/5 blur-3xl -z-10"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <p className="text-3xl md:text-4xl text-slate-300 leading-relaxed font-light pb-8">
                Transform your career through{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent font-semibold">
                  peer-to-peer learning
                </span>
                . Join a thriving community where knowledge flows freely.
              </p>
            </div>
          </div>

          {/* Enhanced Stats with magnetic hover effects */}
          <div className="flex justify-center gap-6 flex-wrap text-center py-12">
            <div className="group relative bg-gray-950/40 backdrop-blur-xl border border-gray-800/40 rounded-3xl p-8 min-w-[140px] hover:bg-gray-950/60 hover:border-emerald-500/50 transition-all duration-500 transform hover:scale-110 hover:-rotate-2 shadow-2xl hover:shadow-emerald-500/20 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-green-500/5 to-teal-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 via-green-500/20 to-teal-600/20 rounded-3xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent mb-3 pb-2">
                  10K+
                </div>
                <div className="text-sm text-slate-400 font-medium pb-2">
                  Active Learners
                </div>
                <div className="w-12 h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full mx-auto mt-3 group-hover:w-16 transition-all duration-300"></div>
              </div>
            </div>

            <div className="group relative bg-gray-950/40 backdrop-blur-xl border border-gray-800/40 rounded-3xl p-8 min-w-[140px] hover:bg-gray-950/60 hover:border-green-500/50 transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-green-500/20 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-teal-600/5 to-emerald-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 via-teal-600/20 to-emerald-400/20 rounded-3xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="text-3xl font-black bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent mb-3 pb-2">
                  500+
                </div>
                <div className="text-sm text-slate-400 font-medium pb-2">
                  Skills Available
                </div>
                <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mx-auto mt-3 group-hover:w-16 transition-all duration-300"></div>
              </div>
            </div>

            <div className="group relative bg-gray-950/40 backdrop-blur-xl border border-gray-800/40 rounded-3xl p-8 min-w-[140px] hover:bg-gray-950/60 hover:border-teal-600/50 transition-all duration-500 transform hover:scale-110 hover:rotate-2 shadow-2xl hover:shadow-teal-500/20 cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 via-emerald-400/5 to-green-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-600/20 via-emerald-400/20 to-green-500/20 rounded-3xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>
              <div className="relative">
                <div className="text-3xl font-black bg-gradient-to-r from-teal-600 to-emerald-400 bg-clip-text text-transparent mb-3 pb-2">
                  95%
                </div>
                <div className="text-sm text-slate-400 font-medium pb-2">
                  Success Rate
                </div>
                <div className="w-12 h-1 bg-gradient-to-r from-teal-600 to-emerald-400 rounded-full mx-auto mt-3 group-hover:w-16 transition-all duration-300"></div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Buttons with premium effects */}
          <div className="flex justify-center gap-6 flex-wrap">
            <a
              href="/register"
              className="group relative bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white font-bold px-12 py-4 rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-emerald-500/40 flex items-center gap-3 text-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              <span className="text-xl relative">🚀</span>
              <span className="relative">Get Started Free</span>
              <span className="text-lg group-hover:translate-x-2 transition-transform duration-300 relative">
                →
              </span>
            </a>

            <a
              href="/login"
              className="group relative bg-gray-950/50 backdrop-blur-xl border-2 border-gray-800/60 hover:border-emerald-500/60 text-white font-bold px-12 py-4 rounded-2xl hover:bg-gray-950/70 transition-all duration-500 transform hover:scale-105 flex items-center gap-3 text-lg shadow-xl hover:shadow-gray-900/50"
            >
              <span className="text-lg">👋</span>
              <span>Sign In</span>
            </a>
          </div>
        </div>
      </div>

      {/* Enhanced How It Works Section with 3D effects */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="inline-block bg-gradient-to-r from-emerald-400/15 via-green-500/10 to-teal-600/15 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-emerald-400/20 shadow-xl">
            <span className="text-emerald-400 font-semibold text-base">
              How It Works
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-6 drop-shadow-lg leading-normal pb-4">
            Simple. Powerful. Effective.
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed pb-8">
            Our revolutionary platform makes skill exchange as easy as having a
            conversation with a friend
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="group text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-400/25 via-green-500/20 to-teal-600/25 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 group-hover:rotate-6 shadow-xl group-hover:shadow-emerald-500/30 cursor-pointer">
                <div className="text-4xl">🎯</div>
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-400/30 rounded-full animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-400/20 rounded-full animate-pulse delay-1000"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors duration-300 leading-normal pb-2">
              Find Your Match
            </h3>
            <p className="text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300 pb-8">
              Browse skills, connect with experts, and find the perfect learning
              partner for your journey
            </p>
          </div>

          <div className="group text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500/25 via-teal-600/20 to-emerald-400/25 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 group-hover:-rotate-6 shadow-xl group-hover:shadow-green-500/30 cursor-pointer">
                <div className="text-4xl">🤝</div>
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-400/30 rounded-full animate-ping delay-1000"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-teal-400/20 rounded-full animate-pulse delay-2000"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300 leading-normal pb-2">
              Start Learning
            </h3>
            <p className="text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300 pb-8">
              Exchange knowledge through video calls, workshops, or hands-on
              collaboration sessions
            </p>
          </div>

          <div className="group text-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-teal-600/25 via-emerald-400/20 to-green-500/25 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-500 group-hover:rotate-6 shadow-xl group-hover:shadow-teal-500/30 cursor-pointer">
                <div className="text-4xl">🌟</div>
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-teal-400/30 rounded-full animate-ping delay-2000"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-emerald-400/20 rounded-full animate-pulse delay-3000"></div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors duration-300 leading-normal pb-2">
              Grow Together
            </h3>
            <p className="text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300 pb-8">
              Build lasting relationships while expanding your skillset and
              advancing your career
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section with morphing effects */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-6 drop-shadow-lg leading-normal pb-4">
            Why Choose SkillBridge?
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed pb-8">
            Experience learning like never before with our cutting-edge platform
            designed for modern professionals
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group bg-gray-950/30 backdrop-blur-xl border border-gray-800/40 rounded-3xl p-10 text-center hover:bg-gray-950/50 hover:border-emerald-500/50 transition-all duration-500 transform hover:scale-105 hover:-rotate-1 relative overflow-hidden shadow-2xl hover:shadow-emerald-500/20 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/5 via-green-500/5 to-teal-600/5 rounded-3xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>

            <div className="relative bg-gradient-to-r from-emerald-400/25 via-green-500/20 to-teal-600/25 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl">
              <div className="text-emerald-400 text-3xl">👥</div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-emerald-400 transition-colors duration-300 leading-normal pb-2">
              Connect & Learn
            </h3>
            <p className="text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300 pb-8">
              Join thousands of passionate learners and teachers in our thriving
              professional community ecosystem
            </p>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>

          <div className="group bg-gray-950/30 backdrop-blur-xl border border-gray-800/40 rounded-3xl p-10 text-center hover:bg-gray-950/50 hover:border-green-500/50 transition-all duration-500 transform hover:scale-105 relative overflow-hidden shadow-2xl hover:shadow-green-500/20 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/5 via-teal-600/5 to-emerald-400/5 rounded-3xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>

            <div className="relative bg-gradient-to-r from-green-500/25 via-teal-600/20 to-emerald-400/25 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 shadow-xl">
              <div className="text-green-400 text-3xl">📚</div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-green-400 transition-colors duration-300 leading-normal pb-2">
              Skill Exchange
            </h3>
            <p className="text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300 pb-8">
              Trade your expertise for new knowledge in our innovative
              peer-to-peer learning system
            </p>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-teal-600 to-emerald-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>

          <div className="group bg-gray-950/30 backdrop-blur-xl border border-gray-800/40 rounded-3xl p-10 text-center hover:bg-gray-950/50 hover:border-teal-600/50 transition-all duration-500 transform hover:scale-105 hover:rotate-1 relative overflow-hidden shadow-2xl hover:shadow-teal-500/20 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600/10 via-transparent to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-600/5 via-emerald-400/5 to-green-500/5 rounded-3xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>

            <div className="relative bg-gradient-to-r from-teal-600/25 via-emerald-400/20 to-green-500/25 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl">
              <div className="text-teal-400 text-3xl">⭐</div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-teal-400 transition-colors duration-300 leading-normal pb-2">
              Quality First
            </h3>
            <p className="text-base text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300 pb-8">
              Every interaction is rated and reviewed to ensure the highest
              quality learning experience possible
            </p>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 via-emerald-400 to-green-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Testimonials with premium styling */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-6 drop-shadow-lg leading-normal pb-4">
            Success Stories
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto pb-8">
            Real people. Real transformations. Real results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="group bg-gray-950/30 backdrop-blur-xl border border-gray-800/40 rounded-3xl p-10 hover:bg-gray-950/50 hover:border-emerald-500/50 transition-all duration-500 transform hover:scale-105 relative overflow-hidden shadow-2xl hover:shadow-emerald-500/20 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/10 to-green-500/10 rounded-3xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>

            <div className="flex items-center mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:shadow-emerald-500/30 transition-all duration-300">
                  S
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-950 animate-pulse shadow-lg shadow-green-400/50"></div>
              </div>
              <div className="ml-6">
                <div className="text-white font-bold text-lg pb-1">Sarah Chen</div>
                <div className="text-emerald-400 font-semibold text-sm pb-1">
                  UI/UX Designer → Full-Stack Designer
                </div>
                <div className="text-slate-400 text-xs">
                  6 months on SkillBridge
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="w-4 h-4 text-yellow-400 animate-pulse"
                  >
                    ⭐
                  </div>
                ))}
              </div>
            </div>

            <p className="text-slate-300 text-base leading-relaxed italic group-hover:text-slate-200 transition-colors duration-300 pb-8">
              "SkillBridge completely transformed my career trajectory! I taught
              design principles and learned coding from amazing developers. Now
              I'm a full-stack designer earning 40% more. The community here is
              incredible!"
            </p>
          </div>

          <div className="group bg-gray-950/30 backdrop-blur-xl border border-gray-800/40 rounded-3xl p-10 hover:bg-gray-950/50 hover:border-green-500/50 transition-all duration-500 transform hover:scale-105 relative overflow-hidden shadow-2xl hover:shadow-green-500/20 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-teal-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 to-teal-600/10 rounded-3xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10"></div>

            <div className="flex items-center mb-8">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 via-teal-600 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-xl group-hover:shadow-green-500/30 transition-all duration-300">
                  M
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-teal-400 rounded-full border-2 border-gray-950 animate-pulse shadow-lg shadow-teal-400/50"></div>
              </div>
              <div className="ml-6">
                <div className="text-white font-bold text-lg pb-1">
                  Marcus Johnson
                </div>
                <div className="text-green-400 font-semibold text-sm pb-1">
                  Marketing Specialist → Growth Expert
                </div>
                <div className="text-slate-400 text-xs">
                  1 year on SkillBridge
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className="w-4 h-4 text-yellow-400 animate-pulse"
                  >
                    ⭐
                  </div>
                ))}
              </div>
            </div>

            <p className="text-slate-300 text-base leading-relaxed italic group-hover:text-slate-200 transition-colors duration-300 pb-8">
              "The connections I've made here are invaluable. I've mastered
              photography, data analytics, and psychology while teaching digital
              marketing. It's not just learning - it's building lifelong
              professional relationships."
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Call to Action with cinematic effects */}
      <div className="relative z-10 text-center py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12">
            <div className="inline-block bg-gradient-to-r from-emerald-400/15 via-green-500/10 to-teal-600/15 backdrop-blur-sm rounded-full px-8 py-3 mb-8 border border-emerald-400/20 shadow-xl animate-pulse">
              <span className="text-emerald-400 font-semibold text-lg">
                ✨ Ready to Transform Your Career?
              </span>
            </div>

            <div className="relative">
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-8 leading-normal drop-shadow-2xl pb-4">
                Your Journey Starts Now
              </h2>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-green-500/10 to-teal-600/10 blur-3xl -z-10"></div>
            </div>

            <p className="text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed pb-8">
              Join thousands of professionals who are already transforming their
              careers through
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent font-semibold">
                {" "}
                skill exchange
              </span>
            </p>
          </div>

          <div className="flex justify-center gap-8 flex-wrap mb-12">
            <a
              href="/register"
              className="group relative bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white font-bold px-16 py-5 rounded-2xl transition-all duration-500 transform hover:scale-110 shadow-2xl hover:shadow-emerald-500/50 flex items-center gap-4 text-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
              <span className="text-2xl relative">⚡</span>
              <span className="relative">Start Learning Today</span>
              <span className="text-xl group-hover:translate-x-3 transition-transform duration-300 relative">
                →
              </span>
            </a>
          </div>

          <div className="text-slate-400 text-base flex flex-wrap justify-center gap-6">
            <div className="flex items-center gap-2 group cursor-pointer pb-2">
              <span className="text-lg">💳</span>
              <span className="group-hover:text-emerald-400 transition-colors duration-300">
                No credit card required
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer pb-2">
              <span className="text-lg">🎯</span>
              <span className="group-hover:text-green-400 transition-colors duration-300">
                Find your first skill match in minutes
              </span>
            </div>
            <div className="flex items-center gap-2 group cursor-pointer pb-2">
              <span className="text-lg">🌟</span>
              <span className="group-hover:text-teal-400 transition-colors duration-300">
                Join 10,000+ active learners
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer with premium styling */}
      <footer className="relative z-10 bg-black/80 backdrop-blur-xl border-t border-gray-800/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative group">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-2xl shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-110">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400/80 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent leading-normal">
                  SkillBridge
                </div>
              </div>
              <p className="text-slate-400 text-base leading-relaxed max-w-sm mb-8 pb-4">
                Empowering professional growth through collaborative learning
                and meaningful connections in our global community.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-950/60 border border-gray-800/50 rounded-xl flex items-center justify-center hover:bg-gray-900/70 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm shadow-lg hover:shadow-emerald-500/20">
                  <span className="text-slate-300 group-hover:text-emerald-400 transition-colors duration-300 text-xl">
                    💼
                  </span>
                </div>
                <div className="w-12 h-12 bg-gray-950/60 border border-gray-800/50 rounded-xl flex items-center justify-center hover:bg-gray-900/70 hover:border-green-500/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm shadow-lg hover:shadow-green-500/20">
                  <span className="text-slate-300 group-hover:text-green-400 transition-colors duration-300 text-xl">
                    🌐
                  </span>
                </div>
                <div className="w-12 h-12 bg-gray-950/60 border border-gray-800/50 rounded-xl flex items-center justify-center hover:bg-gray-900/70 hover:border-teal-600/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm shadow-lg hover:shadow-teal-500/20">
                  <span className="text-slate-300 group-hover:text-teal-400 transition-colors duration-300 text-xl">
                    📧
                  </span>
                </div>
                <div className="w-12 h-12 bg-gray-950/60 border border-gray-800/50 rounded-xl flex items-center justify-center hover:bg-gray-900/70 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group backdrop-blur-sm shadow-lg hover:shadow-emerald-500/20">
                  <span className="text-slate-300 group-hover:text-emerald-400 transition-colors duration-300 text-xl">
                    📱
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-base mb-6 pb-2">Platform</h4>
              <div className="space-y-4 text-slate-400">
                <div className="hover:text-emerald-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>How it Works</span>
                </div>
                <div className="hover:text-emerald-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Find Skills</span>
                </div>
                <div className="hover:text-emerald-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Teach Skills</span>
                </div>
                <div className="hover:text-emerald-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Community</span>
                </div>
                <div className="hover:text-emerald-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Success Stories</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-base mb-6 pb-2">Support</h4>
              <div className="space-y-4 text-slate-400">
                <div className="hover:text-green-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Help Center</span>
                </div>
                <div className="hover:text-green-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Contact Us</span>
                </div>
                <div className="hover:text-green-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Safety Guidelines</span>
                </div>
                <div className="hover:text-green-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Community Rules</span>
                </div>
                <div className="hover:text-green-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Privacy Policy</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-base mb-6 pb-2">Company</h4>
              <div className="space-y-4 text-slate-400">
                <div className="hover:text-teal-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>About Us</span>
                </div>
                <div className="hover:text-teal-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Careers</span>
                </div>
                <div className="hover:text-teal-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Press Kit</span>
                </div>
                <div className="hover:text-teal-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Partnership</span>
                </div>
                <div className="hover:text-teal-400 cursor-pointer transition-all duration-300 hover:translate-x-1 transform text-sm group flex items-center pb-1">
                  <span className="group-hover:mr-2 transition-all duration-300">
                    →
                  </span>
                  <span>Terms of Service</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-500 text-center md:text-left mb-4 md:mb-0 text-sm pb-2">
              © 2025 SkillBridge. Professional skill exchange platform. All
              rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-slate-400">
              <span className="hover:text-emerald-400 cursor-pointer transition-colors duration-300 text-sm pb-1">
                Privacy
              </span>
              <span className="hover:text-green-400 cursor-pointer transition-colors duration-300 text-sm pb-1">
                Terms
              </span>
              <span className="hover:text-teal-400 cursor-pointer transition-colors duration-300 text-sm pb-1">
                Cookies
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}