"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, notFound, useRouter } from "next/navigation";
import { Poppins } from "next/font/google";
import { Camera } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import img from "../login/Imojee.png";
import Cursor from "../login/Cursor";
import { signUp } from "@/app/lib/auth-client";

const poppins = Poppins({ subsets: ["latin"], weight: ["600"] });

const ProfileContent = () => {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name");
  const router = useRouter();

  useEffect(() => {
    if (!nameParam) notFound();
  }, [nameParam]);

  if (!nameParam) return null;

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>(nameParam || "");
  const [credentials, setCredentials] = useState<{email: string, password: string} | null>(null);
  const [userRole, setUserRole] = useState<"buyer" | "seller" | "both">("buyer");

  useEffect(() => {
     // Retrieve credentials from session storage
     const storedData = sessionStorage.getItem("signup_data");
     if (storedData) {
        setCredentials(JSON.parse(storedData));
     } else {
        // If no credentials, redirect back to login
        router.push("/login");
     }
  }, [router]);

  const profileRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);

  // GSAP Animations
  useEffect(() => {
    const tl = gsap.timeline();
    if (profileRef.current && nameRef.current) {
      tl.fromTo(
        profileRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      ).fromTo(
        nameRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5" // overlap slightly for smoother effect
      );
    }
  }, []);

  // Handle Image Preview and Cleanup
  useEffect(() => {
    if (!profilePic) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(profilePic);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profilePic]);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleConfirm = async () => {
    console.log("[SIGNUP] Starting signup process...");

    if (!credentials) {
      console.error("[SIGNUP] No credentials found");
      alert("Error: Credentials not found");
      return;
    }

    let imageUrl: string | undefined = undefined;

    if (profilePic) {
      try {
        console.log("[SIGNUP] Uploading image...");
        const formData = new FormData();
        formData.append("file", profilePic);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
           throw new Error("Failed to upload image");
        }

        const data = await response.json();
        imageUrl = data.url;
        console.log("[SIGNUP] Image uploaded:", imageUrl);
      } catch (err) {
        console.error("[SIGNUP] Image upload failed", err);
        alert("Failed to upload image, proceeding without it.");
      }
    }

    // Determine redirect URL based on role
    const redirectUrl = (userRole === "seller" || userRole === "both") ? "/seller/dashboard" : "/buyer/browse";
    console.log("[SIGNUP] Role:", userRole, "Redirect URL:", redirectUrl);

    try {
      const signupData: any = {
        email: credentials.email,
        password: credentials.password,
        name: displayName,
        callbackURL: redirectUrl
      };

      // Only include image if it was uploaded
      if (imageUrl) {
        signupData.image = imageUrl;
      }

      console.log("[SIGNUP] Calling signUp.email with data:", {
        email: signupData.email,
        name: signupData.name,
        hasImage: !!signupData.image
      });

      // Call signUp.email - it returns a Promise
      console.log("[SIGNUP] About to call signUp.email...");
      console.log("[SIGNUP] signUp object:", typeof signUp, Object.keys(signUp || {}));

      // Call custom signup endpoint
      console.log("[SIGNUP] Calling custom signup endpoint...");
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          name: displayName,
        }),
      });

      console.log("[SIGNUP] Signup response status:", signupResponse.status);
      const responseData = await signupResponse.json();
      console.log("[SIGNUP] Signup response data:", responseData);

      if (!signupResponse.ok) {
        throw new Error(`Signup failed ${signupResponse.status}: ${JSON.stringify(responseData)}`);
      }

      console.log("[SIGNUP] User created successfully!");

      sessionStorage.removeItem("signup_data");

      // Update user role in backend via protected endpoint
      try {
        if (userRole === "seller" || userRole === "both") {
          console.log("[SIGNUP] Setting seller role...");
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
          const response = await fetch(`${backendUrl}/seller/register`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            }
          });

          if (!response.ok) {
            console.warn("[SIGNUP] Failed to set seller role:", response.statusText);
          } else {
            console.log("[SIGNUP] Seller role set successfully");
          }
        }
      } catch (err) {
        console.error("[SIGNUP] Failed to update user role:", err);
        // Don't fail signup if role update fails
      }

      console.log("[SIGNUP] Redirecting to:", redirectUrl);
      router.push(redirectUrl);
    } catch (err: any) {
      console.error("[SIGNUP] Unexpected error during signup:", err);
      alert(`Signup error: ${err?.message || JSON.stringify(err) || "Unknown error"}`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md p-4">
      <Image
        src={"/FisheraLogo1.png"}
        alt="Fishera Logo"
        className="w-[40vh] max-w-full mb-2 h-auto"
        width={1500}
        height={1000}
        priority
      />

      <div
        ref={profileRef}
        className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden mb-6 opacity-0"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-4xl sm:text-5xl md:text-6xl text-gray-500">
              {displayName[0]?.toUpperCase() || "?"}
            </span>
          </div>
        )}

        <label
          htmlFor="profilePic"
          className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-[#40D2E0] hover:bg-cyan-600 cursor-pointer transition-all shadow-md"
        >
          <Camera className="text-white w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        </label>
        <input
          type="file"
          id="profilePic"
          accept="image/*"
          className="hidden"
          onChange={handleProfilePicChange}
        />
      </div>

      <div
        ref={nameRef}
        className={`${poppins.className} text-[4.7vh] font-semibold mb-4 text-black opacity-0`}
      >
        {displayName}
      </div>

      <div className="w-full mb-6">
        <p className="text-gray-700 font-semibold mb-3">What do you want to do?</p>

        <div className="space-y-2">
          <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#40D2E0] transition-colors" style={{ borderColor: userRole === "buyer" ? "#40D2E0" : "inherit" }}>
            <input
              type="radio"
              name="role"
              value="buyer"
              checked={userRole === "buyer"}
              onChange={(e) => setUserRole(e.target.value as "buyer" | "seller" | "both")}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="ml-3 text-gray-700">I want to buy seafood</span>
          </label>

          <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#40D2E0] transition-colors" style={{ borderColor: userRole === "seller" ? "#40D2E0" : "inherit" }}>
            <input
              type="radio"
              name="role"
              value="seller"
              checked={userRole === "seller"}
              onChange={(e) => setUserRole(e.target.value as "buyer" | "seller" | "both")}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="ml-3 text-gray-700">I want to sell seafood</span>
          </label>

          <label className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#40D2E0] transition-colors" style={{ borderColor: userRole === "both" ? "#40D2E0" : "inherit" }}>
            <input
              type="radio"
              name="role"
              value="both"
              checked={userRole === "both"}
              onChange={(e) => setUserRole(e.target.value as "buyer" | "seller" | "both")}
              className="w-4 h-4 cursor-pointer"
            />
            <span className="ml-3 text-gray-700">Both - I want to buy and sell</span>
          </label>
        </div>
      </div>

      <button
        onClick={handleConfirm}
        className="bg-[#40D2E0] hover:bg-cyan-600 cursor-pointer text-black w-full py-3 rounded-full font-semibold text-lg transition-colors"
      >
        Confirm & Continue
      </button>
    </div>
  );
};

const Page = () => {
  return (
    <div className="w-full min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4">
      <Cursor />
      <Suspense fallback={<div>Loading...</div>}>
        <ProfileContent />
      </Suspense>
    </div>
  );
};

export default Page;
