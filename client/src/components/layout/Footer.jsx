export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-gray-950/95 via-slate-950/95 to-gray-900/95 backdrop-blur-xl border-t border-slate-600/20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/3 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-green-500/2 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-60 h-60 bg-teal-400/2 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <svg
                    className="w-6 h-6 text-white relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 rounded-xl blur opacity-20"></div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent">
                SkillBridge
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4 max-w-md">
              Connecting passionate learners and skilled teachers worldwide. 
              Build your expertise, share your knowledge, and grow together in our vibrant community.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 font-medium">Empowering growth through skill exchange</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-3">
              {['About Us', 'How It Works', 'Success Stories', 'Community Guidelines', 'Help Center'].map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-slate-400 hover:text-emerald-400 text-sm transition-colors duration-300 flex items-center space-x-2 group">
                    <div className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-emerald-400 transition-colors duration-300"></div>
                    <span>{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Connect</span>
            </h3>
            
            {/* Social Media */}
            <div className="flex space-x-3 mb-6">
              {[
                { name: 'Twitter', icon: '🐦', color: 'from-blue-400 to-blue-600' },
                { name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-800' },
                { name: 'Discord', icon: '💬', color: 'from-indigo-500 to-purple-600' },
                { name: 'GitHub', icon: '⚡', color: 'from-gray-600 to-gray-800' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`w-10 h-10 bg-gradient-to-r ${social.color} rounded-xl flex items-center justify-center text-white hover:scale-110 transform transition-all duration-300 shadow-lg group`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
              <p className="text-slate-400 text-sm">Stay updated with our latest features</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="flex-1 px-3 py-2 bg-gray-800/50 backdrop-blur-sm border border-slate-600/30 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400/50 transition-all duration-300"
                />
                <button className="px-4 py-2 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 hover:from-emerald-500 hover:via-green-600 hover:to-teal-700 text-white font-medium text-sm rounded-lg transition-all duration-300 transform hover:scale-105">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-600/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-slate-400">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.736 6.979C9.208 6.193 9.696 6 10 6s.792.193 1.264.979a1 1 0 001.715-1.029C12.279 4.784 11.232 4 10 4s-2.279.784-2.979 1.95c-.285.475-.507 1-.67 1.55H6a1 1 0 000 2h.013a9.358 9.358 0 000 1H6a1 1 0 100 2h.351c.163.55.385 1.075.67 1.55C7.721 15.216 8.768 16 10 16s2.279-.784 2.979-1.95a1 1 0 10-1.715-1.029C10.792 13.807 10.304 14 10 14s-.792-.193-1.264-.979a4.265 4.265 0 01-.264-.521H9a1 1 0 000-2H8.472a7.396 7.396 0 010-1H9a1 1 0 100-2H8.472c.08-.185.167-.36.264-.521z" clipRule="evenodd" />
              </svg>
              <span>© {new Date().getFullYear()} SkillBridge. All rights reserved.</span>
            </div>

            {/* Tagline */}
            <div className="text-sm text-slate-300 font-medium">
              <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-600 bg-clip-text text-transparent">
                Learn What You Love. Teach What You Know.
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-slate-400 hover:text-emerald-400 transition-colors duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-4 left-8 w-1.5 h-1.5 bg-green-400/20 rounded-full animate-ping delay-500"></div>
        <div className="absolute top-1/2 left-4 w-1 h-1 bg-teal-500/25 rounded-full animate-ping delay-1000"></div>
      </div>
    </footer>
  );
}