import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?auto=format&fit=crop&q=70&w=1200')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.p
            className="text-amber-400 tracking-[0.3em] text-sm uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Spring 2026 Collection
          </motion.p>

          <motion.h1
            className="text-6xl md:text-8xl font-light text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Timeless
            <br />
            <span className="italic">Elegance</span>
          </motion.h1>

          <motion.p
            className="text-white/70 text-lg max-w-2xl mx-auto mb-12 font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Discover our curated collection of ultra-luxury handbags, 
            meticulously crafted for the discerning individual
          </motion.p>

          <motion.button
            className="group relative px-12 py-4 bg-white text-black tracking-wider text-sm uppercase overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/collection')}
          >
            <motion.span
              className="absolute inset-0 bg-amber-400"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10">Explore Collection</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.5, duration: 0.8 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }}
      >
        <ChevronDown className="w-6 h-6 text-white/50" />
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-1/4 left-12 w-32 h-32 border border-amber-400/20 rotate-45"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: 45 }}
        transition={{ duration: 1.5, delay: 1 }}
      />
      <motion.div
        className="absolute bottom-1/4 right-12 w-24 h-24 border border-amber-400/20 rotate-12"
        initial={{ opacity: 0, rotate: 0 }}
        animate={{ opacity: 1, rotate: 12 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
    </section>
  );
}
