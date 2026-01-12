import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">CampusSOS</h1>
            <div className="flex gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="text-6xl mb-6">🚨</div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Campus Emergency<br />Reporting System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Report and track campus emergencies and incidents in real-time.
            Connect with campus security and get help when you need it.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-lg transition-colors shadow-lg"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 font-semibold text-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Real-Time Updates</h3>
            <p className="text-gray-600">
              Get instant notifications about the status of your reports and emergency alerts
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-bold mb-3">Location-Based</h3>
            <p className="text-gray-600">
              Report incidents with precise campus locations for faster response
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
            <p className="text-gray-600">
              Your safety is our priority. All reports are handled confidentially
            </p>
          </div>
        </div>

        {/* Incident Types */}
        <div className="mt-20 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-10">What Can You Report?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🏥</div>
              <h4 className="font-semibold">Medical Emergency</h4>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔥</div>
              <h4 className="font-semibold">Fire Incident</h4>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🚨</div>
              <h4 className="font-semibold">Security Concern</h4>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔧</div>
              <h4 className="font-semibold">Facility Issue</h4>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚠️</div>
              <h4 className="font-semibold">Harassment</h4>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔍</div>
              <h4 className="font-semibold">Lost & Found</h4>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🧪</div>
              <h4 className="font-semibold">Lab Accident</h4>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📝</div>
              <h4 className="font-semibold">Other Issues</h4>
            </div>
          </div>
        </div>

        {/* Emergency Notice */}
        <div className="mt-12 bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-800 font-semibold text-lg">
            🚨 For life-threatening emergencies, always call Campus Security: <span className="text-2xl">911</span>
          </p>
        </div>
      </div>
    </div>
  );
}
