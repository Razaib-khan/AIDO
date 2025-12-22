"use client";

import { useEffect, useState } from "react";

const emojis = ["✨", "🔥", "💖", "🌟", "🎉", "💎"];

export default function EmojiCursor() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; emoji: string }[]
  >([]);
  const [isLargeScreen, setIsLargeScreen] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!isLargeScreen) return; 

    let id = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const newParticle = {
        id: id++,
        x: e.clientX,
        y: e.clientY,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      };

      setParticles((prev) => [...prev, newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 1000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isLargeScreen]);

  if (!isLargeScreen) return null;

  return (
    <>
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: "fixed",
            left: p.x,
            top: p.y,
            pointerEvents: "none",
            fontSize: Math.random() * 20 + 20,
            transform: "translate(-50%, -50%)",
            transition: "all 0.8s ease-out",
            opacity: 0,
            animation: "fadeUp 0.8s forwards",
            zIndex: 9999,
          }}
        >
          {p.emoji}
        </span>
      ))}

      <style jsx>{`
        @keyframes fadeUp {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) translateY(0px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) translateY(-40px) scale(0.5);
          }
        }
      `}</style>
    </>
  );
}
