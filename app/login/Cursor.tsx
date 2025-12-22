"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

const NUM_CIRCLES = 20;

export default function Cursor() {
  useEffect(() => {
    const coords = { x: 0, y: 0 };
    const circles: HTMLDivElement[] = [];

    for (let i = 0; i < NUM_CIRCLES; i++) {
      const circle = document.createElement("div");
      circle.className =
        "cursor-circle fixed mt-4 top-0 left-0 w-6 h-6 rounded-full bg-[#8cfe65]/50 pointer-events-none z-[9999]";
      circle.style.opacity = `${1 - i / NUM_CIRCLES}`;
      circles.push(circle);
      document.body.appendChild(circle);
    }

    circles.forEach((circle) => {
      (circle as any).x = 0;
      (circle as any).y = 0;
    });

    const handleMouseMove = (e: MouseEvent) => {
      coords.x = e.clientX;
      coords.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const update = () => {
      let x = coords.x;
      let y = coords.y;

      circles.forEach((circle, index) => {
        const scale = (circles.length - index) / circles.length;

        gsap.set(circle, {
          x: x - 12,
          y: y - 12,
          duration: 0.2,
          scale,
        });

        (circle as any).x = x;
        (circle as any).y = y;

        const next = circles[index + 1] || circles[0];
        x += ((next as any).x - x) * 0.3;
        y += ((next as any).y - y) * 0.3;
      });
    };

    gsap.ticker.add(update);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      gsap.ticker.remove(update);
      circles.forEach((c) => c.remove());
    };
  }, []);

  return null;
}
