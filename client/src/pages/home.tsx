import { motion } from "framer-motion";
import Marquee from "@/components/ui/marquee";
import { Link } from "wouter";
import { ArrowRight, Code2, Brain, Zap, Users, BookOpen, Sparkles } from "lucide-react";
import abstractImage from "@assets/generated_images/abstract_3d_geometric_shape_pop_art_style.png";
import abstractImage2 from "@assets/generated_images/abstract_3d_geometric_shape_pop_art_style_variant.png";

export default function Home() {
  const pillars = [
    {
      icon: Code2,
      title: "Build",
      description: "Code, solve, and ship real projects that matter. From web apps to algorithms, create with purpose."
    },
    {
      icon: Brain,
      title: "Think",
      description: "Dive deep into algorithms, math, and systems thinking. Understand the why behind the what."
    },
    {
      icon: Zap,
      title: "Connect",
      description: "Network with ambitious peers and industry professionals. Grow together, learn faster."
    }
  ];

  const highlights = [
    {
      icon: BookOpen,
      title: "Knowledge Library",
      description: "6+ structured learning paths covering web, algorithms, math, and tools"
    },
    {
      icon: Users,
      title: "Active Community",
      description: "150+ members collaborating on projects and tackling challenges"
    },
    {
      icon: Sparkles,
      title: "Monthly Events",
      description: "Workshops, hackathons, talks, and social hangouts for all levels"
    }
  ];

  const testimonials = [
    {
      text: "InfoM4th helped me transition from pure math to full-stack development. The library is incredible.",
      author: "Alex T.",
      role: "2nd Year CS Major"
    },
    {
      text: "The workshop quality is insane. You won't find this level of depth in a regular club.",
      author: "Jordan M.",
      role: "1st Year CS & Math Double Major"
    },
    {
      text: "Finally a space where I could ask deep theoretical questions AND ship code.",
      author: "Casey S.",
      role: "3rd Year Mathematics Major"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col justify-center items-center px-6 mb-20">
        
        {/* Floating Abstract Elements */}
        <motion.img 
          src={abstractImage} 
          alt="Abstract 3D Shape"
          className="absolute top-10 right-[10%] w-48 md:w-80 z-0 pointer-events-none mix-blend-multiply opacity-70"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 8, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut"
          }}
        />
        
        <motion.img 
          src={abstractImage2} 
          alt="Abstract 3D Shape"
          className="absolute bottom-10 left-[5%] w-40 md:w-60 z-0 pointer-events-none mix-blend-multiply opacity-70"
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -12, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 7,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <div className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="text-lg md:text-xl font-mono uppercase tracking-widest bg-secondary px-4 py-1 border-2 border-black inline-block">
              InfoM4th Club
            </span>
          </motion.div>

          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="text-[10vw] leading-[0.9] font-display font-black uppercase tracking-tighter text-foreground mb-4"
          >
            Where Code
            <br />
            <span className="text-stroke">Meets Thinking</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed"
          >
            A community for Computer Science and Mathematics students <span className="font-bold">building, learning, and solving</span> problems that matter.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex flex-col md:flex-row gap-6 justify-center items-center"
          >
            <Link href="/join" className="inline-block px-8 py-4 bg-primary text-white text-xl font-bold uppercase border-2 border-transparent hover:border-primary hover:bg-transparent hover:text-primary transition-all neo-shadow hover:neo-shadow-hover cursor-pointer">
              Join Us
            </Link>
            <Link href="/library" className="inline-block px-8 py-4 bg-white text-black text-xl font-bold uppercase border-2 border-black hover:bg-black hover:text-white transition-all neo-shadow hover:neo-shadow-hover cursor-pointer">
              Explore Library
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Marquee */}
      <div className="rotate-2 scale-105 mb-32 mix-blend-hard-light">
        <Marquee text="WORKSHOPS /// LEARNING /// COMMUNITY ///" duration={25} />
      </div>

      {/* Three Pillars */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="border-4 border-black bg-white p-8 neo-shadow hover:neo-shadow-hover group cursor-pointer"
              >
                <Icon className="w-16 h-16 mb-6 group-hover:text-primary transition-colors" strokeWidth={1.5} />
                <h3 className="text-4xl font-display font-bold uppercase mb-4 group-hover:text-primary transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-lg leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <h2 className="text-6xl md:text-7xl font-display font-black uppercase mb-12 border-b-4 border-black pb-4">
          Why Join?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-secondary border-4 border-black p-8 neo-shadow hover:neo-shadow-hover group"
              >
                <Icon size={40} className="mb-4 group-hover:text-primary transition-colors" />
                <h3 className="text-2xl font-display font-bold uppercase mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-lg opacity-90">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <h2 className="text-6xl md:text-7xl font-display font-black uppercase mb-12 text-center">What Members Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border-4 border-black bg-white p-8 neo-shadow"
            >
              <div className="text-5xl text-primary font-display mb-4">"</div>
              <p className="text-xl font-medium mb-6 leading-relaxed italic">
                {testimonial.text}
              </p>
              <div className="border-t-2 border-black pt-4">
                <p className="font-display font-bold text-lg">{testimonial.author}</p>
                <p className="text-sm opacity-60">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call Out Section */}
      <section className="bg-primary text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-display font-black uppercase leading-tight mb-8"
          >
            Level Up
          </motion.h2>
          <p className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto">
            Access exclusive workshops, recorded sessions, and curated learning paths built by and for ambitious students.
          </p>
          <Link href="/library" className="inline-block px-10 py-5 bg-white text-primary text-2xl font-bold uppercase border-2 border-white hover:bg-transparent hover:text-white transition-all neo-shadow hover:neo-shadow-hover cursor-pointer">
            Browse Library
          </Link>
        </div>
      </section>

      {/* Events CTA */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-accent border-4 border-black p-12 md:p-16 neo-shadow-lg"
        >
          <h2 className="text-5xl md:text-6xl font-display font-black uppercase mb-6 text-white">Upcoming Events</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl">
            From algorithm sprints to industry talks and hackathons. Check out our event calendar and join us!
          </p>
          <Link href="/events" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-accent font-bold uppercase border-2 border-white hover:bg-transparent hover:text-white transition-all neo-shadow hover:neo-shadow-hover cursor-pointer">
            View Events <ArrowRight size={24} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}