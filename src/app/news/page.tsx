"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Megaphone, Newspaper, Sparkles } from "lucide-react";

export default function NewsPage() {
  const featured = {
    title: "InfoM4th Wins the 2025 Campus Impact Award",
    date: "Jan 18, 2026",
    category: "Highlights",
    summary:
      "Our club was recognized for building a cross-disciplinary learning community that pairs math rigor with real-world engineering practice.",
  };

  const updates = [
    {
      title: "Algorithmic Art Night: 120+ Students, 1 Massive Projection Wall",
      date: "Jan 12, 2026",
      category: "Events",
      summary:
        "We turned code into light. Members built generative visuals and live-coded patterns in front of a packed crowd.",
      tag: "Creative Coding",
    },
    {
      title: "Library 2.0 Drops Six New Paths",
      date: "Dec 21, 2025",
      category: "Library",
      summary:
        "Fresh tracks for data viz, discrete math, ML systems, and competitive programming now live in the knowledge library.",
      tag: "Learning",
    },
    {
      title: "New Partner: Math Society + InfoM4th",
      date: "Dec 02, 2025",
      category: "Community",
      summary:
        "Joint workshops and cross-club mentoring sessions begin this semester. Expect more problem jams.",
      tag: "Partnership",
    },
    {
      title: "Open Source Sprint: 9 Projects, 3 Launches",
      date: "Nov 18, 2025",
      category: "Projects",
      summary:
        "Teams shipped public repos for numerical analysis tooling, scheduling algorithms, and math note tagging.",
      tag: "Build",
    },
  ];

  const upcoming = [
    { label: "Feb 02", title: "Proofs & Pizzas: Induction Marathon" },
    { label: "Feb 15", title: "Systems + Statistics: Guest Lecture" },
    { label: "Mar 03", title: "Hack Night: Graphs in Motion" },
  ];

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
          <div className="border-4 border-black bg-white p-6 neo-shadow max-w-md">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/70 mb-2">
              Quick Pulse
            </div>
            <p className="text-lg font-bold">
              We just crossed <span className="text-primary">150 active members</span> and are expanding the leadership
              circle for Spring 2026.
            </p>
          </div>
        </motion.div>

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
              {featured.title}
            </h2>
            <p className="text-lg opacity-80 mb-8">{featured.summary}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold uppercase">
              <span className="bg-primary text-foreground px-3 py-1">{featured.category}</span>
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {featured.date}
              </span>
            </div>
          </div>

          <div className="border-4 border-black bg-white p-10 neo-shadow flex flex-col justify-between">
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
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-5xl md:text-6xl font-display font-black uppercase">Latest Drops</h2>
            <span className="text-sm font-mono uppercase tracking-[0.2em] text-foreground/70">Last 60 days</span>
          </div>

          <div className="grid gap-6">
            {updates.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="border-4 border-black bg-white p-8 md:p-10 neo-shadow hover:neo-shadow-hover transition-shadow group"
              >
                <div className="flex flex-wrap items-center gap-4 text-sm uppercase font-mono text-foreground/70 mb-4">
                  <span className="bg-primary text-foreground px-2 py-1 text-xs font-bold">{item.category}</span>
                  <span className="flex items-center gap-2">
                    <Calendar size={14} />
                    {item.date}
                  </span>
                  <span className="text-xs">{item.tag}</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h3 className="text-3xl md:text-4xl font-display font-black uppercase mb-3 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-lg opacity-80">{item.summary}</p>
                  </div>
                  <div className="flex items-center gap-2 text-lg font-bold uppercase text-foreground/70 group-hover:text-primary transition-colors">
                    Read <ArrowUpRight size={20} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-[1.1fr_0.9fr] gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="border-4 border-black bg-secondary p-10 neo-shadow-lg"
          >
            <h3 className="text-4xl font-display font-black uppercase mb-6">Upcoming Coverage</h3>
            <div className="space-y-4">
              {upcoming.map((item) => (
                <div key={item.title} className="flex items-center gap-6 border-2 border-black bg-white p-4">
                  <span className="text-xl font-display font-black text-primary">{item.label}</span>
                  <span className="text-lg font-bold">{item.title}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="border-4 border-black bg-foreground text-background p-10 neo-shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-background/60 mb-4">
                Signal Boost
              </div>
              <h3 className="text-4xl font-display font-black uppercase mb-4">Get the Digest</h3>
              <p className="text-lg opacity-80">
                Short weekly briefs: project launches, opportunities, and the best problems we are currently solving.
              </p>
            </div>
            <Link
              href="/join"
              className="mt-8 inline-flex items-center gap-2 text-lg font-bold uppercase text-primary hover:text-background transition-colors"
            >
              Subscribe <ArrowUpRight size={20} />
            </Link>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
