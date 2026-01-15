"use client";

import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  focus: string;
}

const teamMembers: TeamMember[] = [
  { name: "Alex Chen", role: "President", focus: "Algorithms & Systems" },
  { name: "Jordan Silva", role: "VP Operations", focus: "Web Development" },
  { name: "Morgan Lee", role: "Curriculum Lead", focus: "Mathematics & Theory" },
  { name: "Casey Patel", role: "Events Coordinator", focus: "Community Building" },
  { name: "Taylor Martinez", role: "Tech Lead", focus: "Full-Stack Development" },
  { name: "River Johnson", role: "Content Creator", focus: "Documentation & Tutorials" }
];

export default function Team() {
  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[10vw] font-display font-black uppercase leading-none mb-16 text-center"
        >
          The Team
        </motion.h1>

        {/* Intro */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto text-center mb-20 border-4 border-border bg-card p-8 neo-shadow"
        >
          <p className="text-2xl font-bold leading-relaxed">
            A diverse group of students dedicated to building an exceptional learning community. Each member brings unique perspectives and expertise.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="border-4 border-border bg-card p-8 neo-shadow hover:neo-shadow-hover group relative overflow-hidden"
            >
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Avatar Placeholder */}
                <div className="w-20 h-20 bg-foreground border-3 border-black mb-6 flex items-center justify-center text-white font-bold text-2xl">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>

                <h3 className="text-3xl font-display font-black uppercase mb-2 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                
                <p className="text-lg font-bold text-primary uppercase mb-3">
                  {member.role}
                </p>

                <p className="text-sm opacity-70">
                  Focus: <span className="font-semibold">{member.focus}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Join Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-foreground text-background p-12 md:p-16 border-4 border-black neo-shadow-lg"
        >
          <h2 className="text-5xl md:text-6xl font-display font-black uppercase mb-6 leading-tight">
            Join Our Team
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            We're always looking for passionate students to help lead workshops, organize events, and grow the community. Reach out if you're interested in getting more involved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
