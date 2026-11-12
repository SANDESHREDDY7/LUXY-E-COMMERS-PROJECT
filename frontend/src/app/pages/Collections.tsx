import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function Collections() {
  const collections = [
    {
      title: "The Heritage Series",
      subtitle: "Vintage Icons",
      description: "Timeless silhouettes that defined eras, meticulously restored and authenticated.",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=70&w=1200",
      link: "/collection?collection=Handbags"
    },
    {
      title: "Exotic Curations",
      subtitle: "Rare Skins",
      description: "Exceptional textures and bold statements crafted from the world's finest materials.",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=70&w=1200",
      link: "/collection?collection=Tote"
    },
    {
      title: "Evening Éclat",
      subtitle: "After Hours",
      description: "Compact masterpieces designed for transition from sunset to starlight.",
      image: "https://images.unsplash.com/photo-1566150905458-1bf1fd111c36?auto=format&fit=crop&q=70&w=1200",
      link: "/collection?collection=Evening"
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-amber-400 tracking-[0.4em] text-xs uppercase mb-4">Curations</p>
          <h1 className="text-6xl md:text-8xl font-light text-white mb-6">Our Collections</h1>
          <p className="text-white/40 max-w-2xl text-lg leading-relaxed">
            Discover our curated worlds of luxury, where every piece tells a story of heritage, art, and uncompromising quality.
          </p>
        </motion.div>

        <div className="space-y-32">
          {collections.map((col, index) => (
            <motion.section
              key={index}
              className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-12 items-center`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
            >
              <div className="w-full md:w-1/2 aspect-[4/5] overflow-hidden rounded-sm group relative">
                <motion.img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
              </div>

              <div className="w-full md:w-1/2 space-y-8">
                <div>
                  <motion.p
                    className="text-amber-400 text-sm tracking-widest uppercase mb-2"
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {col.subtitle}
                  </motion.p>
                  <h2 className="text-4xl md:text-5xl text-white font-light mb-4">{col.title}</h2>
                  <p className="text-white/60 text-lg leading-relaxed">{col.description}</p>
                </div>

                <Link to={col.link}>
                  <motion.button
                    className="flex items-center gap-3 text-white border-b border-amber-400/50 pb-2 group hover:border-amber-400 transition-colors"
                    whileHover={{ x: 10 }}
                  >
                    <span className="uppercase tracking-[0.2em] text-sm">Explore Collection</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </motion.button>
                </Link>
              </div>
            </motion.section>
          ))}
        </div>

        <motion.div
          className="mt-40 text-center py-32 border-t border-white/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl text-white font-light italic mb-8 italic">"Luxury is not a trend, it's a legacy."</h2>
          <Link
            to="/collection"
            className="inline-block px-12 py-5 border border-white/20 text-white text-sm tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all"
          >
            View All Series
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
