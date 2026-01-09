// components/ui/Meteors.tsx
"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useMemo } from "react";

export const Meteors = ({
  number = 20,
  className,
}: {
  number?: number;
  className?: string;
}) => {
  const meteors = useMemo(() => {
    return new Array(number).fill(true).map((_, idx) => {
      const delay = Math.random() * 5; // 0–5s
      const duration = Math.floor(Math.random() * 6) + 5; // 5–10s

      return {
        idx,
        delay,
        duration,
        position: idx * (1800 / number) - 900,
      };
    });
  }, [number]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {meteors.map(({ idx, delay, duration, position }) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute h-0.5 w-0.5 rotate-[45deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
            className
          )}
          style={{
            top: "-40px",
            left: `${position}px`,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          }}
        />
      ))}
    </motion.div>
  );
};