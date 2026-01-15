"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, Bell, FileText, LayoutDashboard, Search, Settings, Shield, Users } from "lucide-react";
import Image from "next/image";
import popArtImage from "@/../attached_assets/ChatGPT_Image_Dec_31,_2025,_07_39_12_PM_1767368748048.png";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/audit", label: "Audit Log", icon: Shield },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-64 border-r border-border p-6 flex flex-col gap-8 hidden md:flex">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded bg-primary" />
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Admin</div>
            <span className="font-bold text-xl tracking-tight">INFOM4TH</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border border-border rounded-2xl p-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Command line quiet.
System calm.
        </div>
      </aside>

      <main className="flex-1 overflow-auto pt-16">
        <header className="h-16 border-b border-border px-8 flex items-center justify-between sticky top-16 bg-background/70 backdrop-blur-xl z-10">
          <div className="flex items-center gap-4 bg-card/70 px-3 py-1.5 rounded-full border border-border w-96">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search admin..."
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 border border-border rounded-full px-4 py-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <Activity size={14} className="text-primary" />
              Live
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-border overflow-hidden">
              <Image src={popArtImage} alt="Admin" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
