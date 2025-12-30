import { motion } from "framer-motion";
import { Zap, Trophy, Users, Lightbulb } from "lucide-react";

export default function About() {
  const values = [
    { icon: Lightbulb, label: "Rigor", description: "We don't settle for surface-level understanding. Deep dive or go home." },
    { icon: Zap, label: "Curiosity", description: "Questions lead us deeper than answers. We question everything, including ourselves." },
    { icon: Users, label: "Collaboration", description: "Great ideas emerge from diverse perspectives. We build together, stronger together." },
    { icon: Trophy, label: "Craft", description: "We care about how we build, not just what we build. Excellence in execution." }
  ];

  const journey = [
    { year: "2022", event: "Founded", description: "Idea sparked between a CS major and a Math major during lunch" },
    { year: "2023", event: "First Workshop", description: "50+ students attended our inaugural algorithms workshop" },
    { year: "2024", event: "Knowledge Library Launch", description: "Curated 6 learning paths, 100+ hours of content" },
    { year: "2025", event: "Community Growth", description: "150+ active members, 20+ events planned annually" }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[10vw] font-display font-black uppercase leading-none mb-16 text-center"
        >
          About<br/>InfoM4th
        </motion.h1>

        {/* Main Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-secondary border-4 border-black p-12 neo-shadow-lg -rotate-2"
          >
            <h2 className="text-5xl font-bold uppercase mb-6 leading-tight">
              Why We<br/>Exist
            </h2>
            <p className="text-xl leading-relaxed font-medium">
              Computer Science and Mathematics are not separate disciplines. They inform each other. A great engineer needs mathematical rigor. A great mathematician needs to implement and validate ideas through code. We exist to bridge this gap.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="border-4 border-black bg-white p-8 neo-shadow">
              <h3 className="text-3xl font-display font-bold uppercase mb-3">Founded on Connection</h3>
              <p className="text-lg opacity-80">
                InfoM4th bridges the gap between theory and practice. We bring together students passionate about both disciplines to learn, build, and grow together. It's not either/or. It's both.
              </p>
            </div>
            <div className="border-4 border-black bg-white p-8 neo-shadow">
              <h3 className="text-3xl font-display font-bold uppercase mb-3">Built by Students</h3>
              <p className="text-lg opacity-80">
                Everything we do is shaped by student voices. Our workshops, projects, and learning paths come from what we actually want to learn. We're not following a curriculum; we're creating one.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="mb-32">
          <h2 className="text-6xl md:text-8xl font-display font-black uppercase mb-12 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border-4 border-black bg-white p-8 neo-shadow hover:neo-shadow-hover group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="relative z-10">
                    <Icon size={40} className="mb-4 group-hover:text-primary transition-colors" />
                    <h3 className="text-4xl font-display font-black uppercase mb-4 group-hover:text-primary transition-colors">
                      {value.label}
                    </h3>
                    <p className="text-lg leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="mb-32">
          <h2 className="text-6xl md:text-8xl font-display font-black uppercase mb-12 text-center">Our Journey</h2>
          
          <div className="space-y-8">
            {journey.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border-4 border-black bg-white p-8 neo-shadow hover:neo-shadow-hover group"
              >
                <div className="flex items-start gap-8">
                  <div className="flex-shrink-0">
                    <span className="text-5xl font-display font-black text-primary">{item.year}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-display font-bold uppercase mb-2 group-hover:text-primary transition-colors">
                      {item.event}
                    </h3>
                    <p className="text-lg opacity-80">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-32 grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { number: "150+", label: "Active Members" },
            { number: "6", label: "Learning Paths" },
            { number: "20+", label: "Annual Events" },
            { number: "100+", label: "Hours of Content" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-primary text-white border-4 border-primary hover:bg-transparent hover:text-primary transition-all p-8 text-center neo-shadow hover:neo-shadow-hover"
            >
              <div className="text-5xl font-display font-black mb-2">{stat.number}</div>
              <div className="text-lg font-bold uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Final Statement */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          className="bg-foreground text-background p-12 md:p-16 border-4 border-black neo-shadow-lg"
        >
          <p className="text-2xl md:text-3xl font-bold leading-relaxed">
            We're building a community where ambitious students can explore Computer Science and Mathematics without compromising on either. <span className="text-primary">No gatekeeping.</span> <span className="text-accent">No pretense.</span> Just rigorous, collaborative learning.
          </p>
        </motion.div>
      </div>
    </div>
  );
}