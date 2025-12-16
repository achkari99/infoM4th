import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-secondary pt-32 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[10vw] font-display font-black uppercase leading-none mb-12 text-center"
        >
          Who Are We?
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white border-4 border-black p-8 neo-shadow-lg rotate-2">
            <p className="text-2xl font-bold leading-relaxed">
              We are a collective of designers, developers, and artists who decided that the internet had become too <span className="bg-primary text-white px-2">boring</span>.
            </p>
          </div>
          
          <div className="space-y-6">
             <p className="text-xl">
               Founded in 2024, Neo-Brutal Studio exists to challenge the sterile, minimalist aesthetic that has taken over the web. We believe in color, contrast, and personality.
             </p>
             <p className="text-xl">
               We don't use templates. We don't use AI to write our copy (mostly). We build bespoke digital playgrounds.
             </p>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Bold", "Loud", "Fast", "Real"].map((word, i) => (
            <motion.div 
              key={word}
              className="aspect-square bg-black flex items-center justify-center text-white border-4 border-transparent hover:border-white hover:bg-primary transition-colors"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="font-display font-bold text-2xl uppercase">{word}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}