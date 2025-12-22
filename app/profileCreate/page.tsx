"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, notFound } from "next/navigation";
import { Poppins } from "next/font/google";
import { Camera } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import img from "../login/logo.png";
import Cursor from "../login/Cursor";

const poppins = Poppins({ subsets: ["latin"], weight: ["600"] });

const ProfileContent = () => {
  const searchParams = useSearchParams();
  const nameParam = searchParams.get("name");

  useEffect(() => {
    if (!nameParam) notFound();
  }, [nameParam]);

  if (!nameParam) return null;

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>(nameParam || "");

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

  return (
    <div className="flex flex-col items-center w-full max-w-md p-4">
      <Image src={img} alt="Logo" className="w-[18vh] mb-[1.4vw]" />

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
          className="absolute bottom-2 right-2 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-all shadow-md"
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

      <p className="text-gray-500 mb-6">Confirm to enter</p>

      <button className="bg-[#7dff51] cursor-pointer text-black w-full py-3 rounded-full font-semibold text-lg transition-colors">
        Confirm
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
