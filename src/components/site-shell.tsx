"use client";

import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";
import CustomCursor from "@/components/ui/custom-cursor";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomCursor />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
