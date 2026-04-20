import { motion } from "motion/react";
import { Droplet, Sun, Wind, Sparkles } from "lucide-react";

export function CareGuide() {
  const steps = [
    {
      icon: Droplet,
      title: "Moisture Protection",
      content: "Avoid exposing your luxury piece to rain or high humidity. If it gets wet, blot gently with a soft, lint-free cloth and allow to dry naturally away from heat sources."
    },
    {
      icon: Sun,
      title: "Light & Heat",
      content: "Prolonged exposure to direct sunlight or strong artificial light can cause colors to fade. Store your handbag in a cool, dark place when not in use."
    },
    {
      icon: Wind,
      title: "Daily Storage",
      content: "Stuff your bag with acid-free tissue paper to help maintain its original silhouette. Always store it inside the provided LUXÉ silk dust bag."
    },
    {
      icon: Sparkles,
      title: "Professional Cleaning",
      content: "We recommend professional cleaning once a year. Our concierge team can coordinate specialized leather restoration services for your collection."
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-amber-400 tracking-[0.3em] text-sm uppercase mb-4">Preservation</p>
          <h1 className="text-6xl md:text-7xl font-light text-white mb-6">Care Guide</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            A luxury handbag is an investment for generations. Follow our curation of preservation techniques to maintain the timeless beauty of your piece.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="p-10 border border-white/5 bg-gradient-to-br from-zinc-900/50 to-transparent rounded-2xl hover:border-amber-400/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <step.icon className="w-10 h-10 text-amber-400 mb-6" />
              <h3 className="text-2xl text-white mb-4">{step.title}</h3>
              <p className="text-white/50 leading-relaxed">{step.content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <img 
            src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=2000" 
            alt="Leather Crafting" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-center justify-center">
            <div className="text-center p-6">
              <h2 className="text-4xl text-white font-light italic mb-4">"The soul of luxury lies in the details."</h2>
              <p className="text-amber-400 text-sm tracking-widest uppercase">Master Craftsman, Florence</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
