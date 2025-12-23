"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "./pageTransition";
import { useState, useEffect } from "react";

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Only render animations after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>; // render plain content on server

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={`transition-${pathname}`} />
      <motion.div
        key={`content-${pathname}`}
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
