import React from "react";

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa]">
      {/* Buyer Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-[#40D2E0]">Fishera</div>
          <div className="flex items-center gap-6">
            <a href="/buyer/browse" className="text-gray-700 hover:text-[#40D2E0]">
              Browse
            </a>
            <a href="/buyer/cart" className="text-gray-700 hover:text-[#40D2E0]">
              Cart
            </a>
            <a href="/buyer/orders" className="text-gray-700 hover:text-[#40D2E0]">
              Orders
            </a>
            <a href="/buyer/profile" className="text-gray-700 hover:text-[#40D2E0]">
              Profile
            </a>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6 text-center">
        <p>&copy; 2025 Fishera - Premium Raw Seafood Marketplace</p>
      </footer>
    </div>
  );
}
