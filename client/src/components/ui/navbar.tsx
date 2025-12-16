import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Work", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center mix-blend-difference text-white">
      <Link href="/" className="text-2xl font-display font-bold tracking-tighter hover-trigger cursor-pointer">
        NEO<span className="text-primary">BRUTAL</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-8 items-center">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path} className={`text-lg font-medium hover-trigger relative group cursor-pointer ${location === item.path ? 'text-primary' : ''}`}>
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
        ))}
        <Link href="/contact" className="px-6 py-2 bg-white text-black font-bold border-2 border-transparent hover:border-white hover:bg-black hover:text-white transition-all neo-shadow hover:neo-shadow-hover hover-trigger cursor-pointer">
          Let's Talk
        </Link>
      </div>

      {/* Mobile Nav Toggle */}
      <button 
        className="md:hidden hover-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-16 left-0 w-full bg-background border-b-4 border-black text-foreground p-8 flex flex-col gap-6 md:hidden shadow-2xl"
        >
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className="text-4xl font-display font-bold uppercase hover:text-primary transition-colors cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}