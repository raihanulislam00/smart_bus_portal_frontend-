'use client';
import Header from '../components/Header';
import Navbar from '@/components/navbar';

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Hero Image */}
            <div className="relative w-full h-64 mb-8 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/image.jpg"
                alt="Smart Bus Portal - Modern Transportation"
                height={400}
                width={800}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <h1 className="text-4xl font-bold mb-2">Smart Bus Portal</h1>
                  <p className="text-lg">Your Journey Starts Here</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Welcome to Smart Bus Portal
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="text-gray-600 mb-4">
                Experience hassle-free bus travel with our smart transportation solution.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Easy booking system</li>
                <li>Real-time bus tracking</li>
                <li>Secure payment options</li>
                <li>24/7 customer support</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
