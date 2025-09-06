export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-gray-600">123 Bus Terminal Road, Dhaka, Bangladesh</p>
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-gray-600">+880 1234-567890</p>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-gray-600">info@smartbusportal.com</p>
              </div>
              <div>
                <h3 className="font-semibold">Business Hours</h3>
                <p className="text-gray-600">24/7 Customer Support</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input type="text" className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input type="email" className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Subject</label>
                <input type="text" className="w-full px-3 py-2 border rounded" required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Message</label>
                <textarea className="w-full px-3 py-2 border rounded" rows={4} required></textarea>
              </div>
              <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
