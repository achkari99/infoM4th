"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, Bell, FileText, LayoutDashboard, Search, Settings, Shield, Users } from "lucide-react";
import Image from "next/image";
import popArtImage from "@/../attached_assets/ChatGPT_Image_Dec_31,_2025,_07_39_12_PM_1767368748048.png";
import { supabase } from "@/lib/supabaseClient";

type SearchCategory = "Users" | "Join Requests" | "Events" | "News" | "Library";

type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  category: SearchCategory;
};

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
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const normalizedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    if (normalizedQuery.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const handle = setTimeout(async () => {
      const pattern = `%${normalizedQuery}%`;
      const [
        { data: profiles },
        { data: joins },
        { data: events },
        { data: news },
        { data: library },
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, email")
          .or(`full_name.ilike.${pattern},email.ilike.${pattern}`)
          .limit(5),
        supabase
          .from("join_requests")
          .select("id, name, email, major, status")
          .or(`name.ilike.${pattern},email.ilike.${pattern},major.ilike.${pattern}`)
          .limit(5),
        supabase
          .from("events")
          .select("id, title, date")
          .ilike("title", pattern)
          .limit(5),
        supabase
          .from("news")
          .select("id, title, date, slug")
          .ilike("title", pattern)
          .limit(5),
        supabase
          .from("library_paths")
          .select("id, title, category")
          .ilike("title", pattern)
          .limit(5),
      ]);

      const nextResults: SearchResult[] = [
        ...(profiles ?? []).map(
          (item): SearchResult => ({
            id: String(item.id),
            title: item.full_name || item.email || "Unnamed user",
            subtitle: item.email || undefined,
            href: "/admin/users",
            category: "Users",
          })
        ),
        ...(joins ?? []).map(
          (item): SearchResult => ({
            id: String(item.id),
            title: item.name || item.email || "Join request",
            subtitle: item.major || item.status || undefined,
            href: "/admin",
            category: "Join Requests",
          })
        ),
        ...(events ?? []).map(
          (item): SearchResult => ({
            id: String(item.id),
            title: item.title,
            subtitle: item.date || undefined,
            href: "/admin/content",
            category: "Events",
          })
        ),
        ...(news ?? []).map(
          (item): SearchResult => ({
            id: String(item.id),
            title: item.title,
            subtitle: item.date || undefined,
            href: item.slug ? `/news/${item.slug}` : "/admin/content",
            category: "News",
          })
        ),
        ...(library ?? []).map(
          (item): SearchResult => ({
            id: String(item.id),
            title: item.title,
            subtitle: item.category || undefined,
            href: "/admin/content",
            category: "Library",
          })
        ),
      ];

      setResults(nextResults);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(handle);
  }, [normalizedQuery]);

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

      <main className="flex-1 overflow-auto pt-[40px]">
        <header className="h-16 border-b border-border/40 px-8 flex items-center justify-between sticky top-[40px] bg-primary/5 backdrop-blur-xl z-10 shadow-[0_18px_42px_rgba(11,58,79,0.28)]">
          <div
            className="relative w-96"
            onFocusCapture={() => setShowResults(true)}
            onBlurCapture={() => setShowResults(false)}
          >
            <div className="flex items-center gap-4 bg-background/70 px-3 py-1.5 rounded-full border border-border/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
            <Search size={18} className="text-muted-foreground" />
            <input
              type="text"
              placeholder="Search admin..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
            />
          </div>
            {showResults && (normalizedQuery.length >= 2 || isSearching) && (
              <div className="absolute left-0 right-0 mt-3 rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
                <div className="px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground border-b border-border">
                  Search Results
                </div>
                {isSearching ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">Searching...</div>
                ) : results.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">No matches found.</div>
                ) : (
                  <div className="max-h-72 overflow-auto">
                    {results.map((item) => (
                      <Link
                        key={`${item.category}-${item.id}`}
                        href={item.href}
                        className="flex items-start justify-between gap-4 px-4 py-3 border-b border-border/60 last:border-b-0 hover:bg-muted/40 transition-colors"
                        onClick={() => setShowResults(false)}
                      >
                        <div>
                          <div className="text-sm font-medium text-foreground">{item.title}</div>
                          {item.subtitle && (
                            <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                          )}
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {item.category}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
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

        <div className="pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
