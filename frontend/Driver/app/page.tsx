import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Welcome to <span className="text-blue-600">Smart Bus Portal</span>
          </h1>
          <p className="text-xl text-black mb-8 max-w-3xl mx-auto">
            Your ultimate destination for smart and convenient bus transportation. 
            Book tickets, track buses, and enjoy seamless travel experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/passenger/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300">
              Get Started
            </Link>
            <Link href="#features" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white transition duration-300">
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="mt-20">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🎫</div>
              <h3 className="text-xl font-semibold mb-2 text-black">Easy Booking</h3>
              <p className="text-black">Book your bus tickets online with just a few clicks. Quick, easy, and secure.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold mb-2 text-black">Real-time Tracking</h3>
              <p className="text-black">Track your bus in real-time and never miss your ride again.</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2 text-black">Secure Payments</h3>
              <p className="text-black">Multiple payment options with secure and encrypted transactions.</p>
            </div>
          </div>
        </section>

        {/* User Types Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Join as</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition duration-300">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-2xl font-semibold mb-4 text-black">Passenger</h3>
              <p className="text-black mb-6">Book tickets, track buses, and enjoy comfortable journeys.</p>
              <Link href="/passenger/signup" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Join as Passenger
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition duration-300">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="text-2xl font-semibold mb-4 text-black">Driver</h3>
              <p className="text-black mb-6">Drive with us and earn money while serving passengers.</p>
              <Link href="/driver/signup" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Join as Driver
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition duration-300">
              <div className="text-5xl mb-4">👔</div>
              <h3 className="text-2xl font-semibold mb-4 text-black">Admin</h3>
              <p className="text-black mb-6">Manage the platform and oversee operations.</p>
              <button className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-300">
                Admin Access
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">🚌 Smart Bus Portal</div>
            <p className="text-gray-400 mb-4">Making bus travel smarter and more convenient</p>
            <div className="flex justify-center space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white">Privacy Policy</Link>
              <Link href="#" className="text-gray-400 hover:text-white">Terms of Service</Link>
              <Link href="#" className="text-gray-400 hover:text-white">Contact Us</Link>
            </div>
            <div className="mt-4 text-gray-400 text-sm">
              © 2025 Smart Bus Portal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
