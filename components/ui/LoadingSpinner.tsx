// components/ui/LoadingSpinner.tsx
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({
  className,
  size = "md",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-12 w-12 border-4",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className={cn(
          "rounded-full border-blue-600 border-t-transparent",
          sizeClasses[size],
        )}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
