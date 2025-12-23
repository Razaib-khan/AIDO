"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/me`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const user = await response.json();
          setIsAuthenticated(true);
          // Redirect authenticated users to buyer browse
          router.push("/buyer/browse");
        }
      } catch (error) {
        console.log("User not authenticated");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fafafa]">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-black">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/fisheralogo1.png"
              alt="Fishera Logo"
              width={150}
              height={150}
              className=""
            />
          </div>
          <Link href="/login">
            <button className="bg-[#40D2E0] hover:bg-cyan-600 text-black px-6 py-2 rounded-lg font-semibold transition-colors">
              Login
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl font-bold mb-6 leading-tight text-black">
              Premium Raw Seafood Marketplace
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect directly with suppliers and buyers. Get the freshest seafood delivered to your door, or sell your premium catch to restaurants and home chefs worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <button className="bg-[#40D2E0] hover:bg-cyan-600 text-black px-8 py-3 rounded-lg font-bold text-lg transition-colors w-full sm:w-auto">
                  Get Started
                </button>
              </Link>
              <button className="bg-transparent border-2 border-black hover:bg-black hover:text-white text-black px-8 py-3 rounded-lg font-bold text-lg transition-colors w-full sm:w-auto">
                Learn More
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <Image
              src="/fisherafinallogo.png"
              alt="Fishera Marketplace"
              width={400}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Fishera?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#fafafa] p-8 rounded-lg">
              <div className="text-4xl mb-4">🐠</div>
              <h3 className="text-2xl font-bold mb-3">Premium Quality</h3>
              <p className="text-gray-600">
                Only the freshest, highest-quality raw seafood from trusted suppliers worldwide.
              </p>
            </div>

            <div className="bg-[#fafafa] p-8 rounded-lg">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-2xl font-bold mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Same-day and next-day delivery options to keep your seafood fresh.
              </p>
            </div>

            <div className="bg-[#fafafa] p-8 rounded-lg">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-2xl font-bold mb-3">Secure Transactions</h3>
              <p className="text-gray-600">
                Protected payments and buyer/seller guarantees for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#40D2E0]">
        <div className="max-w-7xl mx-auto px-6 text-center text-black">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-black/80">
            Join thousands of seafood enthusiasts and professionals on Fishera today.
          </p>
          <Link href="/login">
            <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors">
              Sign Up Now
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6 text-center">
        <p>&copy; 2025 Fishera - Premium Raw Seafood Marketplace. All rights reserved.</p>
      </footer>
    </div>
  );
}
