import { motion } from "motion/react";
import { Award, TrendingUp, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function BestSellers() {
  const bestSellers = [
    {
      id: 1,
      name: "Hermès Constance 18",
      stats: "Most Coveted",
      description: "Epsom Leather, Palladium Hardware, Etoupe",
      image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 2,
      name: "Dior Saddle Bag",
      stats: "Trending Globally",
      description: "Blue Dior Oblique Jacquard",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 3,
      name: "Gucci Jackie 1961",
      stats: "Collector's Choice",
      description: "Black Leather, Gold Hardware",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: 4,
      name: "Saint Laurent Loulou",
      stats: "Evening Favorite",
      description: "Quilted Leather, Silver Hardware",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1000"
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <p className="text-amber-400 tracking-[0.5em] text-[10px] uppercase mb-6 flex items-center justify-center gap-2">
            <Award className="w-4 h-4" /> The Collection of Excellence
          </p>
          <h1 className="text-7xl md:text-9xl font-light text-white mb-8">Best Sellers</h1>
          <p className="text-white/30 max-w-2xl mx-auto text-lg leading-relaxed italic">
            "These are the pieces that define the LUXÉ aesthetic. Unrivaled demand, timeless desirability."
          </p>
        </motion.div>

        {/* Featured Best Seller */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-0 mb-32 border border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="aspect-square bg-zinc-950 overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?auto=format&fit=crop&q=80&w=1000" 
              alt="Elite Choice" 
              className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
            />
            <div className="absolute top-10 left-10">
              <div className="bg-amber-400 text-black px-4 py-1 text-[10px] font-bold uppercase tracking-widest">Masterpiece</div>
            </div>
          </div>
          <div className="p-16 flex flex-col justify-center space-y-8 bg-zinc-900/20 backdrop-blur-xl">
            <div className="flex items-center gap-3 text-amber-400">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs uppercase tracking-[0.3em]">Trending Now</span>
            </div>
            <h2 className="text-4xl text-white font-light uppercase">The Birkin 25 <span className="text-white/20 italic">Curated Edition</span></h2>
            <p className="text-white/50 leading-relaxed text-sm">
              Consistently our most sought-after piece. A symbol of status and craftsmanship that remains at the pinnacle of luxury handbag investment.
            </p>
            <Link to="/collection" className="inline-flex items-center gap-4 text-white uppercase tracking-widest text-xs border border-white/20 px-8 py-4 hover:border-amber-400 transition-all w-fit">
              Order From Reserve <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* Grid Collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestSellers.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative aspect-[3/4] overflow-hidden group border border-white/5"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-amber-400 mb-2">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="text-[9px] uppercase tracking-tighter">{item.stats}</span>
                  </div>
                  <h3 className="text-white font-light text-lg mb-1">{item.name}</h3>
                  <p className="text-white/40 text-[10px] uppercase mb-4 opacity-0 group-hover:opacity-100 transition-opacity">{item.description}</p>
                  <Link to="/collection" className="text-white text-[10px] uppercase tracking-widest border-b border-amber-400/50 pb-1 opacity-0 group-hover:opacity-100 transition-opacity">Discover</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
