"use client";

import { useEffect, useState } from "react";

export default function BackendStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading");
  const [userData, setUserData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    async function checkConnection() {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        
        // 1. Check public endpoint
        const res = await fetch(`${backendUrl}/`);
        if (!res.ok) throw new Error("Failed to connect to backend root");
        
        // 2. Check protected endpoint (if logged in)
        // We use credentials: 'include' to send cookies
        const meRes = await fetch(`${backendUrl}/me`, {
            credentials: 'include'
        });
        
        if (meRes.ok) {
            const data = await meRes.json();
            setUserData(data);
        } else if (meRes.status === 401) {
            // Not logged in or session invalid, but connection works
            console.log("Backend connected but not authenticated");
        } else {
             console.warn(`Backend /me returned ${meRes.status}`);
        }

        setStatus("connected");
      } catch (e: any) {
        console.error(e);
        setStatus("error");
        setErrorMsg(e.message);
      }
    }

    checkConnection();
  }, []);

  if (status === "loading") return <div className="fixed bottom-4 right-4 bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded shadow-lg z-50 text-xs">Checking backend...</div>;
  if (status === "error") return <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50 text-xs">Backend Error: {errorMsg}</div>;

  return (
    <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50 text-xs">
      <p className="font-bold">Backend Connected!</p>
      {userData ? (
          <p>Logged in as: {userData.name}</p>
      ) : (
          <p>Guest Mode</p>
      )}
    </div>
  );
}
