export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#4A6FFF] to-[#34D399] flex items-center justify-center px-4">
      <div className="max-w-3xl text-center text-white space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Swap Skills. Spark Growth.
        </h1>
        <p className="text-lg md:text-xl text-white/90">
          Learn what you love. Teach what you know. Join a community built on collaboration.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="/register"
            className="bg-white text-[#4A6FFF] font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="bg-white/20 border border-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition"
          >
            I Already Have an Account
          </a>
        </div>
      </div>
    </div>
  )
}
