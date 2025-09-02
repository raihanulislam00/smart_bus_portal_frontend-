"use client"

import NavBar from '../../components/navbar';

export default function Contact() {
  return (
    <div>
      <NavBar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Contact Us</h2>
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600 mb-4">For any inquiries, please call us:</p>
              <p className="text-2xl font-bold text-indigo-600">+88 (01) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
