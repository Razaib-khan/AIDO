"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";

export default function BrowsePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (categoryFilter) params.append("category", categoryFilter);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?${params}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black">Browse Seafood</h1>

        {/* Filters */}
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#40D2E0]"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#40D2E0]"
          >
            <option value="">All Categories</option>
            <option value="fish">Fish</option>
            <option value="shrimp">Shrimp</option>
            <option value="crab">Crab</option>
            <option value="shellfish">Shellfish</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-xl text-gray-500">Loading products...</div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            {products.length === 0 ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="text-xl text-gray-500">No products found</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="bg-gray-200 h-48 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 text-black">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-2xl font-bold text-[#40D2E0]">
                          ${product.price.toFixed(2)}
                        </div>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mb-3">
                        <span>{product.freshness}</span>
                        <span>Stock: {product.stock}</span>
                      </div>
                      <button className="w-full bg-[#40D2E0] hover:bg-cyan-600 text-black font-bold py-2 rounded-lg transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
