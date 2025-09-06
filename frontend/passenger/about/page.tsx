export default function About() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">About Smart Bus Portal</h1>
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-lg text-gray-700 mb-6">
            Smart Bus Portal is revolutionizing the way people travel by bus. We provide a comprehensive 
            platform that connects passengers, drivers, and administrators in one seamless experience.
          </p>
          <p className="text-lg text-gray-700 mb-6">
            Our mission is to make bus transportation more efficient, reliable, and convenient for everyone. 
            Through our smart technology solutions, we enable real-time tracking, easy booking, and secure payments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">1000+</div>
              <div className="text-gray-600">Happy Passengers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50+</div>
              <div className="text-gray-600">Partner Drivers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
