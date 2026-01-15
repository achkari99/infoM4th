"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Moon, ShieldCheck, Sun, UserCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabaseClient";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useSupabaseSession();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const loadRole = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      setIsAdmin(data?.role === "admin");
    };

    loadRole();
  }, [user]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "News", path: "/news" },
    { name: "Library", path: "/library" },
    { name: "Team", path: "/team" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-background/60 text-foreground backdrop-blur-2xl border-b border-white/20 shadow-[0_8px_30px_rgba(11,58,79,0.18)]">
      <Link href="/" className="text-2xl font-display font-bold tracking-tighter hover-trigger cursor-pointer">
        INFO<span className="text-primary">M4TH</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex gap-8 items-center">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`text-lg font-medium hover-trigger relative group cursor-pointer ${
              pathname === item.path ? "text-primary font-bold" : ""
            }`}
          >
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
          </Link>
        ))}

        {!user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-lg font-medium hover-trigger relative group cursor-pointer"
            >
              Login
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
            <Link
              href="/register"
              className="text-lg font-medium hover-trigger relative group cursor-pointer"
            >
              Register
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-lg font-medium hover-trigger relative group cursor-pointer"
            >
              <UserCircle2 size={20} />
              Profile
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-lg font-medium hover-trigger relative group cursor-pointer"
              >
                <ShieldCheck size={18} className="text-primary" />
                Admin
              </Link>
            )}
          </div>
        )}

        <button
          type="button"
          aria-label="Toggle theme"
          onClick={() => setTheme((resolvedTheme ?? theme) === "dark" ? "light" : "dark")}
          className="h-10 w-10 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
        >
          {isMounted && (resolvedTheme ?? theme) === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link
          href="/join"
          className="px-6 py-2 bg-primary text-white font-bold border-2 border-transparent hover:border-white hover:bg-white hover:text-primary transition-all neo-shadow hover:neo-shadow-hover hover-trigger cursor-pointer"
        >
          Join
        </Link>
      </div>

      {/* Mobile Nav Toggle */}
      <button className="md:hidden hover-trigger" onClick={() => setIsOpen(!isOpen)}>
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
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono uppercase tracking-widest opacity-60">Theme</span>
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme((resolvedTheme ?? theme) === "dark" ? "light" : "dark")}
              className="h-10 w-10 rounded-full border border-border bg-card/70 hover:bg-card transition-colors flex items-center justify-center"
            >
              {isMounted && (resolvedTheme ?? theme) === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="text-3xl font-display font-bold uppercase hover:text-primary transition-colors cursor-pointer"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {!user ? (
            <>
              <Link
                href="/login"
                className="text-3xl font-display font-bold uppercase hover:text-primary transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-3xl font-display font-bold uppercase hover:text-primary transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="text-3xl font-display font-bold uppercase hover:text-primary transition-colors cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-3xl font-display font-bold uppercase hover:text-primary transition-colors cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              )}
            </>
          )}
          <Link
            href="/join"
            className="text-3xl font-display font-bold uppercase hover:text-primary transition-colors cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            Join
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
