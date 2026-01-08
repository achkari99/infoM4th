import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ArrowUpRight, Calendar, ChevronLeft, Quote } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
);

interface NewsSection {
  heading: string;
  body: string;
}

interface NewsArticle {
  slug: string;
  title: string;
  date: string;
  category: string;
  tag: string;
  summary: string;
  read_time: string | null;
  sections: NewsSection[] | null;
  pull_quote: string | null;
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", params.slug)
    .is("archived_at", null)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const article = data as NewsArticle;
  const sections = article.sections ?? [];

  return (
    <div className="min-h-screen bg-background pt-28 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.25em] text-foreground/70 hover:text-primary transition-colors"
        >
          <ChevronLeft size={16} />
          Back to News
        </Link>

        <div className="mt-10 border-4 border-black bg-foreground text-background p-10 md:p-12 neo-shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 border-4 border-primary rotate-12" />
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-[0.3em] text-background/70">
            <span className="bg-primary text-foreground px-3 py-1 font-bold">{article.category}</span>
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {article.date}
            </span>
            <span>{article.read_time ?? ""}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black uppercase leading-tight mt-6">
            {article.title}
          </h1>
          <p className="text-lg md:text-xl opacity-80 mt-6 max-w-3xl">{article.summary}</p>
          <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold uppercase text-primary">
            {article.tag} <ArrowUpRight size={16} />
          </div>
        </div>

        <div className="mt-12 border-4 border-black bg-white neo-shadow relative overflow-hidden">
          <div className="absolute -left-16 top-12 h-full w-28 border-r-4 border-black/20" />
          <div className="absolute -right-6 top-10 h-24 w-24 border-4 border-primary rotate-6" />

          <div className="p-8 md:p-12 relative">
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-foreground/60 mb-6">
              Longform
              <span className="h-px w-10 bg-black/30" />
              Journal Entry
            </div>

            <div className="space-y-10 text-lg leading-relaxed">
              {sections.length === 0 ? (
                <p className="opacity-80">Full story text is coming soon.</p>
              ) : (
                sections.map((section) => (
                  <div key={section.heading} className="grid gap-3">
                    <h2 className="text-3xl md:text-4xl font-display font-black uppercase">{section.heading}</h2>
                    <p className="opacity-80">{section.body}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-10 flex items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] text-foreground/60">
              End of entry
              <span className="h-px w-16 bg-black/30" />
            </div>
          </div>
        </div>

        {article.pull_quote && (
          <div className="mt-12 border-4 border-black bg-secondary p-10 neo-shadow-lg flex flex-col md:flex-row gap-8 items-center">
            <div className="flex items-center justify-center w-16 h-16 border-4 border-black bg-white">
              <Quote size={28} className="text-primary" />
            </div>
            <p className="text-2xl md:text-3xl font-display font-black uppercase">{article.pull_quote}</p>
          </div>
        )}

        <div className="mt-12 border-4 border-black bg-white p-8 md:p-10 neo-shadow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-foreground/70 mb-2">Read more</div>
            <h3 className="text-3xl font-display font-black uppercase">Explore the full news feed</h3>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-lg font-bold uppercase text-primary hover:text-foreground transition-colors"
          >
            Back to latest <ArrowUpRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
