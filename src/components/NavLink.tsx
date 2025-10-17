import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ReactNode } from "react";

interface NavLinkProps {
  to: string;
  children: ReactNode;
  variant?: "ghost" | "default";
  className?: string;
}

export const NavLink = ({ to, children, variant = "ghost", className }: NavLinkProps) => {
  return (
    <Link to={to} className="relative group">
      <motion.div
        className="absolute inset-0 border-2 border-primary rounded-md opacity-0 group-hover:opacity-100 -m-1 p-1"
        initial={{ scale: 0.8, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
      <Button 
        variant={variant} 
        size="sm" 
        className={`relative z-10 transition-all duration-200 group-hover:scale-105 ${className || ''}`}
      >
        {children}
      </Button>
    </Link>
  );
};
