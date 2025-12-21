"use client";

import { useEffect, useState } from "react";

const ROWS = 8;
const COLS = 12;
const TOTAL_BLOCKS = ROWS * COLS;
const TOTAL_DURATION = .6 * 1000; // 1.4 seconds in ms

export default function PageTransition() {
  const [visibleBlocks, setVisibleBlocks] = useState<number[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Initialize all blocks as visible
    const blocks = Array.from({ length: TOTAL_BLOCKS }, (_, i) => i);
    setVisibleBlocks(blocks);

    // Calculate interval per block to complete in TOTAL_DURATION
    const intervalTime = TOTAL_DURATION / TOTAL_BLOCKS;

    const interval = setInterval(() => {
      setVisibleBlocks((prev) => {
        if (prev.length === 0) {
          clearInterval(interval);
          setShow(false); // remove grid from DOM
          return [];
        }

        // Pick a random block to remove
        const idx = Math.floor(Math.random() * prev.length);
        const newBlocks = [...prev];
        newBlocks.splice(idx, 1);
        return newBlocks;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
    >
      {Array.from({ length: TOTAL_BLOCKS }, (_, i) => (
        <div
          key={i}
          className={`bg-[#9cff7b] border-[1px] border-[#9cff7b] transition-opacity duration-150 ${
            visibleBlocks.includes(i) ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
