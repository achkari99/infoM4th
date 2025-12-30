import { motion } from "framer-motion";
import { BookOpen, Lock, Code2, Calculator, GitBranch, Zap } from "lucide-react";

interface LearningPath {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  modules: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  color: string;
}

const libraryContent: LearningPath[] = [
  {
    id: "web-fundamentals",
    title: "Web Development Fundamentals",
    category: "Web",
    icon: <Code2 size={32} />,
    description: "HTML, CSS, JavaScript. Building blocks of the web. Learn the fundamentals with modern practices.",
    modules: 12,
    difficulty: "Beginner",
    color: "bg-blue-100 border-blue-400 hover:bg-blue-200"
  },
  {
    id: "algorithms-datastructures",
    title: "Algorithms & Data Structures",
    category: "Core CS",
    icon: <Zap size={32} />,
    description: "Master sorting, searching, trees, graphs, and algorithmic thinking. The foundation of great engineering.",
    modules: 15,
    difficulty: "Intermediate",
    color: "bg-purple-100 border-purple-400 hover:bg-purple-200"
  },
  {
    id: "discrete-math",
    title: "Discrete Mathematics",
    category: "Math",
    icon: <Calculator size={32} />,
    description: "Logic, sets, combinatorics, and graph theory. Essential for computer science.",
    modules: 10,
    difficulty: "Intermediate",
    color: "bg-green-100 border-green-400 hover:bg-green-200"
  },
  {
    id: "git-version-control",
    title: "Git & Version Control",
    category: "Tools",
    icon: <GitBranch size={32} />,
    description: "Collaborate effectively. Learn branching, merging, rebasing, and workflow best practices.",
    modules: 8,
    difficulty: "Beginner",
    color: "bg-orange-100 border-orange-400 hover:bg-orange-200"
  },
  {
    id: "linear-algebra",
    title: "Linear Algebra Essentials",
    category: "Math",
    icon: <Calculator size={32} />,
    description: "Vectors, matrices, eigenvectors. Critical for ML, graphics, and scientific computing.",
    modules: 12,
    difficulty: "Intermediate",
    color: "bg-pink-100 border-pink-400 hover:bg-pink-200"
  },
  {
    id: "advanced-react",
    title: "Advanced React Patterns",
    category: "Web",
    icon: <Code2 size={32} />,
    description: "Hooks, context, state management, performance optimization. Ship production-grade applications.",
    modules: 14,
    difficulty: "Advanced",
    color: "bg-cyan-100 border-cyan-400 hover:bg-cyan-200"
  }
];

export default function Library() {
  const difficultyColor = {
    Beginner: "bg-green-500",
    Intermediate: "bg-yellow-500",
    Advanced: "bg-red-500"
  };

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
            <h1 className="text-7xl md:text-8xl font-display font-black uppercase leading-none">Knowledge<br/>Vault</h1>
          </div>
          <p className="text-2xl max-w-2xl mt-6">
            Exclusive learning paths built by InfoM4th members. Curated, structured, and designed for depth.
          </p>
        </motion.div>

        {/* Filter/Info Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-foreground text-background p-6 border-4 border-black mb-12 flex justify-between items-center flex-wrap gap-4 neo-shadow"
        >
          <div>
            <p className="font-mono uppercase text-sm opacity-80">Members-Only Content</p>
            <p className="text-xl font-bold">
              {libraryContent.length} Learning Paths Available
            </p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {libraryContent.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`border-4 border-black p-8 neo-shadow hover:neo-shadow-hover group relative overflow-hidden cursor-pointer transition-all duration-300 ${path.color}`}
            >
              {/* Difficulty Badge */}
              <div className={`absolute top-4 right-4 px-3 py-1 ${difficultyColor[path.difficulty]} text-white text-xs font-bold uppercase rounded-full`}>
                {path.difficulty}
              </div>

              {/* Icon */}
              <div className="mb-6 text-black opacity-80 group-hover:opacity-100 transition-opacity">
                {path.icon}
              </div>

              {/* Content */}
              <h3 className="text-2xl font-display font-bold uppercase mb-3 leading-tight group-hover:text-primary transition-colors">
                {path.title}
              </h3>
              
              <span className="text-xs font-mono uppercase tracking-widest opacity-60 mb-4 inline-block">
                {path.category}
              </span>

              <p className="text-base leading-relaxed mb-6 font-medium">
                {path.description}
              </p>

              {/* Module Count */}
              <div className="border-t-2 border-black pt-4 flex justify-between items-center">
                <span className="font-mono text-sm uppercase font-bold opacity-70">
                  {path.modules} Modules
                </span>
                <div className="w-6 h-6 border-2 border-black group-hover:bg-black transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-secondary border-4 border-black p-12 md:p-16 neo-shadow-lg text-center"
        >
          <h2 className="text-5xl md:text-6xl font-display font-black uppercase mb-6 leading-tight">
            Ready to Learn?
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto font-medium">
            All members get access to the complete Knowledge Vault, plus new learning paths added every semester.
          </p>
        </motion.div>
      </div>
    </div>
  );
}