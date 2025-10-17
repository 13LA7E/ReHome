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
    const timer = setTimeout(() => setIsAnimating(false), 400);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.15,
          ease: "easeInOut",
        }}
        className="relative"
      >
        {/* Expanding rectangle overlay - from nav position to fullscreen */}
        {isAnimating && (
          <motion.div
            initial={{ 
              scaleX: 0.05, 
              scaleY: 0.05, 
              borderRadius: "8px",
              top: "1rem",
              left: "50%",
              translateX: "-50%"
            }}
            animate={{ 
              scaleX: 1, 
              scaleY: 1, 
              borderRadius: "0px",
              top: "0",
              left: "0",
              translateX: "0"
            }}
            transition={{ 
              duration: 0.4, 
              ease: [0.4, 0, 0.2, 1] 
            }}
            className="fixed inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent z-50 pointer-events-none"
            style={{ transformOrigin: "center top" }}
          />
        )}
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
