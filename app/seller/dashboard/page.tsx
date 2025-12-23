"use client";

import { useEffect, useState } from "react";

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      setLoading(true);

      // Fetch user data
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/me`,
        {
          credentials: "include",
        }
      );
      if (userResponse.ok) {
        setUser(await userResponse.json());
      }

      // Fetch seller's products
      const productsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/products`,
        {
          credentials: "include",
        }
      );
      if (productsResponse.ok) {
        setProducts(await productsResponse.json());
      }

      // Fetch seller's orders
      const ordersResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/seller/orders`,
        {
          credentials: "include",
        }
      );
      if (ordersResponse.ok) {
        setOrders(await ordersResponse.json());
      }
    } catch (error) {
      console.error("Failed to fetch seller data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex justify-center items-center">
        <div className="text-xl text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black">Seller Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Total Products
            </h3>
            <p className="text-4xl font-bold text-[#40D2E0]">{products.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Total Orders
            </h3>
            <p className="text-4xl font-bold text-[#40D2E0]">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">
              Total Revenue
            </h3>
            <p className="text-4xl font-bold text-[#40D2E0]">
              ${orders
                .reduce((sum: number, order: any) => sum + order.totalPrice, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">Your Products</h2>
            <button className="bg-[#40D2E0] hover:bg-cyan-600 text-black font-bold py-2 px-6 rounded-lg transition-colors">
              Add New Product
            </button>
          </div>

          {products.length === 0 ? (
            <p className="text-gray-500">No products yet. Create your first product!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-black">Product Name</th>
                    <th className="px-4 py-2 text-black">Category</th>
                    <th className="px-4 py-2 text-black">Price</th>
                    <th className="px-4 py-2 text-black">Stock</th>
                    <th className="px-4 py-2 text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product: any) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 text-black">{product.name}</td>
                      <td className="px-4 py-2 text-gray-600">{product.category}</td>
                      <td className="px-4 py-2 text-black">${product.price.toFixed(2)}</td>
                      <td className="px-4 py-2 text-gray-600">{product.stock}</td>
                      <td className="px-4 py-2">
                        <button className="text-[#40D2E0] hover:underline">Edit</button>
                        <span className="mx-2 text-gray-400">|</span>
                        <button className="text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-black mb-6">Recent Orders</h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-black">Order ID</th>
                    <th className="px-4 py-2 text-black">Buyer</th>
                    <th className="px-4 py-2 text-black">Total</th>
                    <th className="px-4 py-2 text-black">Status</th>
                    <th className="px-4 py-2 text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: any) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2 text-black font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </td>
                      <td className="px-4 py-2 text-black">{order.buyerId.slice(0, 8)}...</td>
                      <td className="px-4 py-2 text-black">
                        ${order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button className="text-[#40D2E0] hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
