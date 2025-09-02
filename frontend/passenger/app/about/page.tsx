"use client"

import NavBar from '../../components/navbar';

export default function AboutUs() {
  return (
    <div>
      <NavBar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              About Us
            </h1>
            <p className="text-xl text-gray-600">
              Smart Bus Portal - Revolutionizing Transportation
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
              👨‍💻 Developer Information
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold text-indigo-600 mb-4">Developer</h3>
              <div className="space-y-2 text-gray-700">
                <p className="text-lg">
                  <span className="font-medium">👤 Name:</span> Raihanul Islam
                </p>
                <p className="text-lg">
                  <span className="font-medium">🎓 University:</span> AIUB (American International University-Bangladesh)
                </p>
                <p className="text-lg">
                  <span className="font-medium">🚀 Project:</span> Smart Bus Portal - A comprehensive transportation management system
                </p>
                <p className="text-lg">
                  <span className="font-medium">🌐 Portfolio:</span> 
                  <a 
                    href="https://raihanulislam.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 underline ml-2"
                  >
                    raihanulislam.vercel.app
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
