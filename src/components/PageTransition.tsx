import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 600);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -20 }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="relative"
      >
        {/* Expanding rectangle overlay */}
        {isAnimating && (
          <motion.div
            initial={{ scaleX: 0, scaleY: 0, borderRadius: "12px" }}
            animate={{ scaleX: 1, scaleY: 1, borderRadius: "0px" }}
            exit={{ scaleX: 0, scaleY: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 bg-primary/5 z-50 origin-top-left pointer-events-none"
          />
        )}
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
