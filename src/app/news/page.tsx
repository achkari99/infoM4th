"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Megaphone, Newspaper, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  tag: string;
  read_time: string | null;
  is_featured: boolean | null;
}

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("news")
        .select("*")
        .is("archived_at", null)
        .order("date", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      setItems((data as NewsItem[]) ?? []);
      setIsLoading(false);
    };

    loadNews();
  }, []);

  const featured = useMemo(() => items.find((item) => item.is_featured) ?? items[0], [items]);
  const updates = useMemo(() => items.filter((item) => item.slug !== featured?.slug), [items, featured?.slug]);

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20 relative overflow-hidden">
      <div className="absolute -top-32 right-0 w-[400px] h-[400px] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute top-40 -left-20 w-[320px] h-[320px] bg-accent/20 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] font-mono text-foreground/70 mb-6">
              <Newspaper className="text-primary" size={20} />
              Newsroom
            </div>
            <h1 className="text-[12vw] md:text-[6rem] font-display font-black uppercase leading-none">
              InfoM4th
              <br />
              News
            </h1>
          </div>
          <div className="border-4 border-border bg-card p-6 neo-shadow max-w-md">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/70 mb-2">Quick Pulse</div>
            <p className="text-lg font-bold">
              {featured?.summary ??
                "We are building the newsroom. Fresh updates will appear here as soon as the first stories publish."}
            </p>
          </div>
        </motion.div>

        {error && (
          <div className="border-4 border-border bg-card p-6 neo-shadow mb-10 text-lg">{error}</div>
        )}

        {isLoading ? (
          <div className="border-4 border-border bg-card p-8 neo-shadow animate-pulse">Loading news?</div>
        ) : (
          <>
            <motion.section
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid md:grid-cols-[1.4fr_1fr] gap-8 mb-20"
            >
              <div className="border-4 border-black bg-foreground text-background p-10 neo-shadow-lg relative overflow-hidden">
                <div className="absolute -right-10 -top-10 w-40 h-40 border-4 border-primary rotate-12" />
                <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] font-mono mb-6">
                  <Sparkles size={20} className="text-primary" />
                  Featured
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black uppercase leading-tight mb-4">
                  {featured?.title ?? "Stories loading"}
                </h2>
                <p className="text-lg opacity-80 mb-8">{featured?.summary ?? ""}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold uppercase">
                  <span className="bg-primary text-foreground px-3 py-1">
                    {featured?.category ?? "Highlights"}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar size={16} />
                    {featured?.date ?? ""}
                  </span>
                </div>
                {featured && (
                  <Link
                    href={`/news/${featured.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-lg font-bold uppercase text-primary hover:text-background transition-colors"
                  >
                    Read story <ArrowUpRight size={20} />
                  </Link>
                )}
              </div>

              <div className="border-4 border-border bg-card p-10 neo-shadow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] font-mono mb-6">
                    <Megaphone className="text-primary" size={20} />
                    Announcements
                  </div>
                  <h3 className="text-3xl font-display font-black uppercase mb-4">Spring Callouts</h3>
                  <p className="text-lg opacity-80">
                    We are opening new roles in outreach, design, and research. Applications open Feb 10.
                  </p>
                </div>
                <Link
                  href="/join"
                  className="mt-8 inline-flex items-center gap-2 text-lg font-bold uppercase text-primary hover:text-foreground transition-colors"
                >
                  Apply now <ArrowUpRight size={20} />
                </Link>
              </div>
            </motion.section>

            <section className="mb-20">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
                <div>
                  <div className="text-xs font-mono uppercase tracking-[0.35em] text-foreground/60 mb-3">Signal Feed</div>
                  <h2 className="text-5xl md:text-6xl font-display font-black uppercase">Latest Drops</h2>
                </div>
                <div className="inline-flex items-center gap-3 border-2 border-border bg-card px-4 py-2 text-xs font-mono uppercase tracking-[0.2em]">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Last 60 days
                </div>
              </div>

              {updates.length === 0 ? (
                <div className="border-4 border-border bg-card p-8 neo-shadow">
                  No additional stories yet. Publish the first update to get this feed moving.
                </div>
              ) : (
                <div className="relative border-4 border-black bg-[linear-gradient(135deg,_rgba(0,0,0,0.03)_0%,_rgba(0,0,0,0)_55%)] p-6 md:p-10 neo-shadow-lg">
                  <div className="absolute -top-6 right-6 rotate-3 border-2 border-black bg-secondary px-4 py-2 text-xs font-mono uppercase tracking-[0.3em]">
                    Noise & Notes
                  </div>
                  <ul className="space-y-6">
                    {updates.map((item, index) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.08 }}
                        className="grid gap-6 md:grid-cols-[120px_1fr] items-start"
                      >
                        <div className="flex md:flex-col md:items-center md:gap-3 gap-4">
                          <div className="text-4xl font-display font-black text-primary">0{index + 1}</div>
                          <div className="h-px md:h-16 md:w-px w-full bg-black/20" />
                          <div className="text-xs font-mono uppercase tracking-[0.25em] text-foreground/70">
                            {item.tag}
                          </div>
                        </div>

                        <article className="relative border-4 border-border bg-card p-6 md:p-8 shadow-[6px_6px_0_0_#000]">
                          <div className="absolute -top-3 left-6 bg-primary text-foreground px-3 py-1 text-xs font-bold uppercase">
                            {item.category}
                          </div>
                          <div className="flex items-center gap-2 text-sm font-mono uppercase text-foreground/70 mb-4">
                            <Calendar size={14} />
                            {item.date}
                          </div>
                          <h3 className="text-3xl md:text-4xl font-display font-black uppercase mb-3">
                            {item.title}
                          </h3>
                          <p className="text-lg opacity-80 mb-6">{item.summary}</p>
                          <Link
                            href={`/news/${item.slug}`}
                            className="inline-flex items-center gap-2 text-sm font-bold uppercase text-foreground hover:text-primary transition-colors"
                          >
                            Read <ArrowUpRight size={18} />
                          </Link>
                          <div className="absolute -right-4 bottom-6 rotate-6 border-2 border-black bg-background px-3 py-1 text-[10px] font-mono uppercase tracking-[0.3em]">
                            {item.read_time ?? "Fresh"}
                          </div>
                        </article>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
