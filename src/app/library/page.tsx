"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Lock, Code2, Calculator, GitBranch, Zap, Star, Users, BarChart3 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface LearningPath {
  id: string;
  title: string;
  category: string;
  description: string;
  modules: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  instructors: number | null;
  rating: number | null;
  students: number | null;
}

const categoryIconMap: Record<string, JSX.Element> = {
  Web: <Code2 size={32} />,
  "Core CS": <Zap size={32} />,
  Math: <Calculator size={32} />,
  Tools: <GitBranch size={32} />,
  Default: <BookOpen size={32} />,
};

export default function Library() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPaths = async () => {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("library_paths")
        .select("*")
        .is("archived_at", null)
        .order("title", { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
        setIsLoading(false);
        return;
      }

      setPaths((data as LearningPath[]) ?? []);
      setIsLoading(false);
    };

    loadPaths();
  }, []);

  const difficultyColor = {
    Beginner: "bg-secondary",
    Intermediate: "bg-primary",
    Advanced: "bg-accent",
  };

  const totalStats = useMemo(
    () => ({
      paths: paths.length,
      modules: paths.reduce((acc, p) => acc + p.modules, 0),
      students: paths.reduce((acc, p) => acc + (p.students || 0), 0),
      hours: 100,
    }),
    [paths],
  );

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-primary border-2 border-black">
              <BookOpen size={40} className="text-white" />
            </div>
            <h1 className="text-7xl md:text-8xl font-display font-black uppercase leading-none">
              Knowledge<br />Vault
            </h1>
          </div>
          <p className="text-2xl max-w-2xl mt-6">
            Exclusive learning paths built by InfoM4th members. Curated, structured, and designed for depth. All free for
            members.
          </p>
        </motion.div>

        {error && (
          <div className="border-4 border-border bg-card p-6 neo-shadow mb-10 text-lg">{error}</div>
        )}

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { icon: BookOpen, value: totalStats.paths, label: "Learning Paths" },
            { icon: BarChart3, value: totalStats.modules, label: "Modules" },
            { icon: Users, value: totalStats.students, label: "Learners" },
            { icon: Star, value: `${totalStats.hours}+`, label: "Hours" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className="bg-card border-3 border-border p-4 text-center neo-shadow"
              >
                <Icon size={24} className="mx-auto mb-2 text-primary" />
                <div className="text-3xl font-display font-bold">{stat.value}</div>
                <div className="text-xs font-mono uppercase opacity-60">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Filter/Info Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-foreground text-background p-6 border-4 border-black mb-12 flex justify-between items-center flex-wrap gap-4 neo-shadow"
        >
          <div>
            <p className="font-mono uppercase text-sm opacity-80">Members-Only Content</p>
            <p className="text-xl font-bold">{paths.length} Learning Paths Available</p>
          </div>
          <div className="flex gap-3">
            {Object.entries(difficultyColor).map(([level, color]) => (
              <div key={level} className="flex items-center gap-2">
                <div className={`w-3 h-3 ${color}`}></div>
                <span className="text-sm font-medium">{level}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="border-4 border-border bg-card p-8 neo-shadow animate-pulse">Loading library?</div>
        ) : paths.length === 0 ? (
          <div className="border-4 border-border bg-card p-8 neo-shadow">No paths yet. Check back soon.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {paths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="border-4 border-border p-8 neo-shadow hover:neo-shadow-hover group relative overflow-hidden transition-all duration-300 cursor-pointer bg-card"
              >
                {/* Difficulty Badge */}
                <div
                  className={`absolute top-4 right-4 px-3 py-1 ${difficultyColor[path.difficulty]} text-white text-xs font-bold uppercase rounded-full`}
                >
                  {path.difficulty}
                </div>

                {/* Icon */}
                <div className="mb-6 text-black opacity-80 group-hover:opacity-100 transition-opacity">
                  {categoryIconMap[path.category] ?? categoryIconMap.Default}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-display font-bold uppercase mb-3 leading-tight group-hover:text-primary transition-colors">
                  {path.title}
                </h3>

                <span className="text-xs font-mono uppercase tracking-widest opacity-60 mb-4 inline-block">
                  {path.category}
                </span>

                <p className="text-base leading-relaxed mb-6 font-medium">{path.description}</p>

                {/* Stats Row */}
                <div className="border-t-2 border-black pt-4 mb-4 flex gap-6 text-sm">
                  <div>
                    <span className="font-mono opacity-60">INSTRUCTORS</span>
                    <div className="font-bold">{path.instructors ?? 0}</div>
                  </div>
                  <div>
                    <span className="font-mono opacity-60">RATING</span>
                    <div className="font-bold">{path.rating ?? 0}?.</div>
                  </div>
                  <div>
                    <span className="font-mono opacity-60">STUDENTS</span>
                    <div className="font-bold">{path.students ?? 0}</div>
                  </div>
                </div>

                {/* Module Count */}
                <div className="border-t-2 border-black pt-4 flex justify-between items-center">
                  <span className="font-mono text-sm uppercase font-bold opacity-70">{path.modules} Modules</span>
                  <div className="w-6 h-6 border-2 border-black group-hover:bg-black transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Featured Section */}
        <section className="mb-20">
          <h2 className="text-5xl md:text-6xl font-display font-black uppercase mb-8">Featured This Month</h2>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-secondary border-4 border-black p-8 md:p-12 neo-shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-accent text-white px-4 py-2 border-2 border-black font-bold uppercase text-sm">
              NEW
            </div>
            <h3 className="text-4xl font-display font-bold uppercase mb-4">
              {paths[0]?.title ?? "Member Highlight"}
            </h3>
            <p className="text-lg mb-6 max-w-2xl leading-relaxed">
              {paths[0]?.description ??
                "A fresh path is coming into focus. Keep an eye on the vault for the next release."}
            </p>
            <div className="flex gap-4 flex-wrap">
              <span className="px-4 py-2 bg-card border-2 border-border font-bold uppercase">
                {paths[0]?.modules ?? 0} Modules
              </span>
              <span className="px-4 py-2 bg-card border-2 border-border font-bold uppercase">
                {paths[0]?.difficulty ?? "Upcoming"}
              </span>
              <span className="px-4 py-2 bg-card border-2 border-border font-bold uppercase">
                Instructors: {paths[0]?.instructors ?? 0}
              </span>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-primary text-primary-foreground p-12 md:p-16 border-4 border-black neo-shadow-lg text-center"
        >
          <Lock size={48} className="mx-auto mb-6" />
          <h2 className="text-5xl md:text-6xl font-display font-black uppercase mb-6">Exclusive Access</h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            All members get instant access to the complete Knowledge Vault, plus new learning paths added every semester.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
