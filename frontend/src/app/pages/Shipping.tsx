import { motion } from "motion/react";
import { Truck, RotateCcw, ShieldCheck, Globe } from "lucide-react";

export function Shipping() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-amber-400 tracking-[0.3em] text-sm uppercase mb-4">Service</p>
          <h1 className="text-6xl md:text-7xl font-light text-white mb-6">Shipping & Returns</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Experience our signature white-glove delivery service, ensuring your luxury pieces arrive with the care they deserve.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <motion.div
            className="p-8 border border-white/10 bg-zinc-900/30 rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Truck className="w-12 h-12 text-amber-400 mb-6" />
            <h2 className="text-2xl text-white mb-4">White-Glove Shipping</h2>
            <div className="space-y-4 text-white/60">
              <p>• Complimentary express shipping on all orders over $5,000.</p>
              <p>• Fully insured transit with real-time tracking and signature requirement.</p>
              <p>• Specialized packaging designed to protect delicate leathers and exotic skins.</p>
              <p>• Delivery within 3-5 business days for domestic orders.</p>
            </div>
          </motion.div>

          <motion.div
            className="p-8 border border-white/10 bg-zinc-900/30 rounded-lg"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <RotateCcw className="w-12 h-12 text-amber-400 mb-6" />
            <h2 className="text-2xl text-white mb-4">Seamless Returns</h2>
            <div className="space-y-4 text-white/60">
              <p>• 14-day complimentary return window for all unused items.</p>
              <p>• Security tags must remain attached and intact.</p>
              <p>• Original packaging, dust bags, and authentication cards required.</p>
              <p>• Refund processed within 7 business days of quality inspection.</p>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="bg-zinc-900/50 p-12 rounded-lg border border-amber-400/20 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Globe className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h2 className="text-3xl text-white mb-4">International Delivery</h2>
          <p className="text-white/60 max-w-3xl mx-auto mb-8">
            LUXÉ ships to over 50 countries worldwide. International orders are shipped via DHL Express and include all duties and taxes pre-paid for your convenience. Delivery times vary by region, typically ranging from 5-10 business days.
          </p>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2 text-white/40">
              <ShieldCheck className="w-5 h-5" />
              <span>Full Insurance</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
