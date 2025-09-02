import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Roboto({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: "100"
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Bus Portal",
  description: "A Solution for Smart Bus Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="min-h-screen flex flex-col">
          <header className="p-4">
            {

            }
          </header>
          <div className="flex-1">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
