import { motion } from "framer-motion";
import Marquee from "@/components/ui/marquee";
import ProjectCard from "@/components/ui/project-card";
import abstractImage from "@assets/generated_images/abstract_3d_geometric_shape_pop_art_style.png";
import abstractImage2 from "@assets/generated_images/abstract_3d_geometric_shape_pop_art_style_variant.png";

export default function Home() {
  const projects = [
    { title: "Cyber Punk", category: "Web Design", color: "bg-secondary", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" },
    { title: "Neon Dreams", category: "Branding", color: "bg-white", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop" },
    { title: "Acid House", category: "Motion", color: "bg-accent", image: "https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=2670&auto=format&fit=crop" },
    { title: "Future Tech", category: "Product", color: "bg-white", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2670&auto=format&fit=crop" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-20 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col justify-center items-center px-6 mb-20">
        
        {/* Floating Abstract Elements */}
        <motion.img 
          src={abstractImage} 
          alt="Abstract 3D Shape"
          className="absolute top-10 right-[10%] w-64 md:w-96 z-0 pointer-events-none mix-blend-multiply opacity-90"
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, 10, 0]
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
          className="absolute bottom-20 left-[5%] w-48 md:w-72 z-0 pointer-events-none mix-blend-multiply opacity-90"
          animate={{ 
            y: [0, 40, 0],
            rotate: [0, -15, 0]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <div className="relative z-10 text-center">
          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="text-[12vw] leading-[0.85] font-display font-black uppercase tracking-tighter text-foreground"
          >
            Digital
            <br />
            <span className="text-stroke hover:text-primary transition-colors duration-300 cursor-default">Chaos</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-8 text-xl md:text-2xl max-w-2xl mx-auto font-medium"
          >
            We build digital experiences that <span className="bg-secondary px-2 border-2 border-black inline-block -rotate-2">scream</span>, not whisper.
          </motion.p>
        </div>
      </section>

      {/* Marquee Divider */}
      <div className="rotate-2 scale-105 mb-32 mix-blend-hard-light">
        <Marquee text="CREATIVE /// DISRUPTIVE /// LOUD ///" />
      </div>

      {/* Work Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto mb-32">
        <div className="flex justify-between items-end mb-12 border-b-4 border-black pb-4">
          <h2 className="text-6xl md:text-8xl font-display font-bold uppercase">Selected<br/>Work</h2>
          <span className="text-xl font-mono hidden md:block">(2023 — 2024)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={index % 2 === 1 ? "md:translate-y-24" : ""}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="bg-foreground text-background py-32 px-6 relative overflow-hidden">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
            <div>
               <h2 className="text-5xl md:text-7xl font-display font-bold uppercase mb-8 leading-none">
                 We don't do<br/>
                 <span className="text-primary italic">Generic.</span>
               </h2>
               <p className="text-xl opacity-80 max-w-md">
                 Our process is chaotic by design. We break grids, mix metaphors, and deliver work that sticks in your brain like a catchy pop song.
               </p>
            </div>
            
            <div className="space-y-8">
              {["Art Direction", "Web Design", "3D Motion", "Brand Strategy"].map((item, i) => (
                <motion.div 
                  key={item}
                  initial={{ x: 100, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-white/20 pb-4 hover:pl-8 transition-all cursor-pointer group"
                >
                  <h3 className="text-3xl md:text-4xl font-display font-bold uppercase flex justify-between items-center group-hover:text-secondary">
                    {item}
                    <span className="opacity-0 group-hover:opacity-100">→</span>
                  </h3>
                </motion.div>
              ))}
            </div>
         </div>
      </section>
    </div>
  );
}