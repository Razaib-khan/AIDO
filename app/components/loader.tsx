"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { Google_Sans } from "next/font/google";

const card1 = {
    color: "#fff",
    headingText: "Premium Raw Seafood Marketplace",
    subheadingText: "Connect with buyers and sellers of the freshest raw seafood.",
    descriptionText: "Buy direct from suppliers or sell your premium catch to restaurants and home chefs.",
    featureList: [
        "Fresh Daily Deliveries",
        "Direct Supplier Network"
    ]
};
const card2 = {
    color: "#BFFDAA",
    headingText: "Start Your Fishera Journey",
    subheadingText: "Whether you buy or sell, we've got you covered.",
    descriptionText: "Join thousands of seafood enthusiasts and professionals.",
    featureList: [
        "Quality Guaranteed",
        "Secure Transactions"
    ]
};

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["500"],
});

const Google_Sans_Font = Google_Sans({
    subsets: ["latin"],
    weight: ["500"],
});

export default function Loader() {
    const spinnerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [showButton, setShowButton] = useState(false);

    useGSAP(() => {
        gsap.to(spinnerRef.current, {
            rotate: 360,
            repeat: -1,
            duration: 1,
            ease: "linear",
        });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 bg-[#eee] flex flex-col justify-between"
        >
            {!showButton && (
                <div
                    ref={spinnerRef}
                    className="border-4 border-black border-t-transparent rounded-full absolute top-1/2 left-1/2 w-16 h-16 sm:w-12 sm:h-12 -translate-x-1/2 -translate-y-1/2"
                />
            )}

            {showButton && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4">
                    <div className="heading text-black text-2xl sm:text-xl md:text-2xl font-bold">
                        Welcome to Fishera
                    </div>
                    <div className="subheading text-[#555555] text-lg sm:text-base md:text-lg mt-2">
                        Your Premium Raw Seafood Marketplace. <br />
                        We are so glad to have you here!
                    </div>
                    <Link href='/login'>
                    <button
                        className={`${poppins.className} text-gray-900 mt-4 cursor-pointer bg-[#40D2E0] px-6 py-2 rounded-full transition`}
                    >
                        Enter App
                    </button>
                    </Link>
                </div>
            )}

            <div className="con1 h-1/2 w-full px-4 sm:px-2 py-6"></div>

            <div className="div2 h-1/2 w-full flex justify-end px-4 sm:px-2">
                <div className="w-[40%] sm:w-[60%] h-full flex justify-end translate-x-[10%]">
                    <div className="card1 border-2 hover:w-[50%] cursor-pointer transition-all duration-150 border-black shadow-lg translate-x-[13%] rotate-[-20deg] w-[30vh] sm:w-[35vh] md:w-[40vh] h-[35vh] sm:h-[40vh] md:h-[45vh] rounded-2xl flex flex-col px-4 py-4 bg-white">
                        <div className={`${Google_Sans_Font.className} heading text-black text-[1.4vw] sm:text-[1.2rem] md:text-[1.6vw] leading-snug w-full`}>
                            {card1.headingText}
                        </div>
                        <div className="subheading text-[#555555] text-[0.9vw] sm:text-[0.8rem] md:text-[1vw] leading-snug w-full mt-2">
                            {card1.subheadingText}
                        </div>
                        <div className="w-full rounded-lg mt-2 text-[0.9vw] sm:text-[0.8rem] md:text-[1vw] text-black/70">
                            {card1.descriptionText}
                        </div>
                        <ul>
                            {card1.featureList.map((item, idx) => (
                                <li key={idx} className="text-[0.8vw] sm:text-[0.7rem] md:text-[0.9vw] text-black/70 mt-2">
                                    • {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="card2 border-2 border-black shadow-lg translate-y-[10%] rotate-[-20deg] w-[30vh] sm:w-[35vh] md:w-[40vh] h-[35vh] sm:h-[40vh] md:h-[45vh] rounded-2xl flex flex-col px-4 py-4 bg-[#40D2E0]">
                        <div className={`${Google_Sans_Font.className} heading text-black text-[1.4vw] sm:text-[1.2rem] md:text-[1.6vw] leading-snug w-full`}>
                            {card2.headingText}
                        </div>
                        <div className="subheading text-[#555555] text-[0.9vw] sm:text-[0.8rem] md:text-[1vw] leading-snug w-full mt-2">
                            {card2.subheadingText}
                        </div>
                        <div className="w-full rounded-lg mt-2 text-[0.9vw] sm:text-[0.8rem] md:text-[1vw] text-black/70">
                            {card2.descriptionText}
                        </div>
                        <ul>
                            {card2.featureList.map((item, idx) => (
                                <li key={idx} className="text-[0.8vw] sm:text-[0.7rem] md:text-[0.9vw] text-black/70 mt-2">
                                    • {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
