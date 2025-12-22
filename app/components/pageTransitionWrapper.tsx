"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import PageTransition from "./pageTransition";

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [zIndex, setZIndex] = useState(0);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`transition-${pathname}`}
        initial={{ opacity: 1, zIndex: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ zIndex }}
        onAnimationComplete={() => setZIndex(-9999)}
      >
        <PageTransition />
      </motion.div>

      <motion.div
        key={`page-${pathname}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
