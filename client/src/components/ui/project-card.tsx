import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  title: string;
  category: string;
  image?: string;
  color?: string;
}

export default function ProjectCard({ title, category, image, color = "bg-white" }: ProjectCardProps) {
  return (
    <motion.div 
      className={`group relative border-4 border-black ${color} p-4 neo-shadow hover:neo-shadow-hover cursor-pointer h-full flex flex-col`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="aspect-video bg-black/5 mb-4 border-2 border-black overflow-hidden relative">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="font-display font-bold text-4xl opacity-20 uppercase">{title[0]}</span>
          </div>
        )}
        
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white border-2 border-black p-3 rounded-full neo-shadow">
            <ArrowUpRight size={24} />
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest border border-black px-2 py-0.5 rounded-full mb-2 inline-block bg-white">
              {category}
            </span>
            <h3 className="text-2xl font-display font-bold leading-none uppercase group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
        </div>
      </div>
    </motion.div>
  );
}