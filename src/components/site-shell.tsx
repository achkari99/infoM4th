"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/ui/custom-cursor";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <CustomCursor />}
      <Navbar />
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
