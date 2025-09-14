export default function Services() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Online Booking</h3>
            <p className="text-gray-600">Book your bus tickets online with ease</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Real-time Tracking</h3>
            <p className="text-gray-600">Track your bus location in real-time</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Secure Payments</h3>
            <p className="text-gray-600">Multiple secure payment options</p>
          </div>
        </div>
      </div>
    </div>
  );
}
