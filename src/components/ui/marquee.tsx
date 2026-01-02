import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  text: string;
  className?: string;
  repeat?: number;
  duration?: number;
  reverse?: boolean;
}

export default function Marquee({ 
  text, 
  className, 
  repeat = 4, 
  duration = 20,
  reverse = false 
}: MarqueeProps) {
  return (
    <div className={cn("overflow-hidden flex whitespace-nowrap select-none bg-primary text-primary-foreground py-4 border-y-4 border-black", className)}>
      <motion.div
        className="flex"
        animate={{
          x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: duration,
        }}
      >
        {Array.from({ length: repeat }).map((_, i) => (
          <span key={i} className="text-6xl font-display font-bold uppercase mx-8 tracking-tighter">
            {text} <span className="text-transparent" style={{ WebkitTextStroke: "2px white" }}>{text}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}