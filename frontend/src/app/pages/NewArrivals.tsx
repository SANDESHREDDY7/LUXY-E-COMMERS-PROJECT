import { motion } from "motion/react";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function NewArrivals() {
  const newItems = [
    {
      id: 1,
      name: "Hermès Birkin 25",
      releaseDate: "Arrived Today",
      description: "Togo Leather, Gold Hardware, Noir",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 2,
      name: "Chanel Classic Flap",
      releaseDate: "Awaiting Pre-release",
      description: "Lambskin, Silver Hardware, Burgundy",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 3,
      name: "Dior Lady Dior",
      releaseDate: "Recently Curated",
      description: "Cannage Lambskin, Rose Gold Hardware",
      image: "https://images.unsplash.com/photo-1774259479601-69a44c70bed1?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-2xl">
            <p className="text-amber-400 tracking-[0.4em] text-xs uppercase mb-4 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Just In
            </p>
            <h1 className="text-6xl md:text-8xl font-light text-white mb-6">New Arrivals</h1>
            <p className="text-white/40 text-lg leading-relaxed">
              Explore the latest masterpieces to join our collection. Freshly curated from private collectors and luxury houses worldwide.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-32 h-px bg-white/20 mb-4" />
            <p className="text-white/20 text-xs uppercase tracking-widest">Spring Collection 2026</p>
          </div>
        </motion.div>

        {/* Hero Arrival */}
        <motion.div
          className="relative aspect-[21/9] rounded-sm overflow-hidden mb-32 group"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?auto=format&fit=crop&q=80&w=2000" 
            alt="New Arrival Showcase" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-12">
            <div className="max-w-xl">
              <h2 className="text-4xl text-white font-light italic mb-4 line-through decoration-amber-400/50">Modern Classics</h2>
              <p className="text-white/60 mb-8">Redefining the era of ultra-luxury through the lens of timeless design.</p>
              <Link to="/collection" className="inline-flex items-center gap-4 text-white uppercase tracking-widest text-sm border-b border-white/20 pb-2 hover:border-amber-400 transition-colors">
                Explore The Gallery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Arrival Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {newItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="space-y-6 group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="aspect-[3/4] overflow-hidden bg-zinc-900">
                <motion.img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <Calendar className="w-3 h-3" />
                  <span className="text-[10px] uppercase tracking-widest">{item.releaseDate}</span>
                </div>
                <h3 className="text-xl text-white font-light uppercase tracking-wider">{item.name}</h3>
                <p className="text-white/40 text-xs">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-32 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            to="/collection"
            className="px-16 py-6 bg-white text-black text-sm tracking-[0.4em] uppercase font-bold hover:bg-amber-400 transition-all shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
          >
            See All Discoveries
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
