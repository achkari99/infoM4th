import { Link } from "wouter";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-destructive flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
      
      <motion.h1 
        initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="text-[15vw] font-display font-black text-white leading-none z-10"
      >
        404
      </motion.h1>
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="z-10 bg-white border-4 border-black p-8 neo-shadow-lg rotate-2 max-w-lg"
      >
        <h2 className="text-4xl font-bold uppercase mb-4">You're Lost.</h2>
        <p className="text-xl mb-8 font-medium">
          This page has been consumed by the void. It doesn't exist. Or maybe it never did.
        </p>
        
        <Link href="/" className="inline-block px-8 py-4 bg-black text-white text-xl font-bold uppercase border-2 border-transparent hover:bg-primary hover:text-white transition-all neo-shadow hover:neo-shadow-active hover:-rotate-2 cursor-pointer">
          Get Me Out Of Here
        </Link>
      </motion.div>
    </div>
  );
}