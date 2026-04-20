import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Mail, CreditCard, Sparkles } from "lucide-react";

export function GiftCards() {
  const [amount, setAmount] = useState<number | string>(1000);
  const amounts = [500, 1000, 2500, 5000, 10000];

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Visual Representation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[1.6/1] bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-2xl border border-white/10 p-12 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden group">
              {/* Dynamic Design Background */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-400 blur-[100px] rounded-full -ml-32 -mb-32" />
              </div>

              <div className="relative h-full flex flex-col justify-between">
                <div>
                  <p className="text-amber-400 tracking-[0.4em] text-[10px] uppercase mb-4">Maison de LUXÉ</p>
                  <h2 className="text-4xl text-white font-light tracking-widest">GIFT CARD</h2>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <p className="text-white/20 text-[10px] uppercase tracking-widest">Amount</p>
                    <p className="text-3xl text-white font-mono">${amount.toLocaleString()}</p>
                  </div>
                  <Gift className="w-12 h-12 text-amber-400/40" />
                </div>
              </div>
            </div>

            <motion.div 
              className="mt-12 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium mb-1">Instant Elegance</h4>
                  <p className="text-white/40 text-xs">Digital delivery within minutes, perfectly timed for any occasion.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white text-sm font-medium mb-1">Personalized Message</h4>
                  <p className="text-white/40 text-xs">Include a custom note to be delivered with the digital certificate.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-zinc-900/40 p-10 rounded-3xl border border-white/5 backdrop-blur-sm"
          >
            <h1 className="text-4xl text-white font-light mb-4">Give Choice</h1>
            <p className="text-white/40 mb-10">Select an amount to bestow the luxury of selection upon someone truly special.</p>

            <div className="space-y-8">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-widest mb-4">Select Denomination</p>
                <div className="grid grid-cols-3 gap-3">
                  {amounts.map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`py-4 rounded-lg border text-sm font-mono transition-all ${
                        amount === val 
                        ? "bg-amber-400 border-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.2)]" 
                        : "border-white/10 text-white/60 hover:border-white/30"
                      }`}
                    >
                      ${val.toLocaleString()}
                    </button>
                  ))}
                  <div className="relative group">
                    <input 
                      type="number" 
                      placeholder="Other"
                      onChange={(e) => setAmount(Number(e.target.value) || 0)}
                      className="w-full h-full py-4 bg-transparent border border-white/10 rounded-lg text-sm text-center text-white placeholder:text-white/30 focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-white/60 text-xs uppercase tracking-widest">Recipient Details</p>
                <input 
                  type="email" 
                  placeholder="Recipient's Email"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
                />
                <textarea 
                  placeholder="Your Personal Message"
                  rows={4}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-amber-400 transition-colors resize-none"
                />
              </div>

              <motion.button
                className="w-full py-5 bg-white text-black text-sm uppercase font-bold tracking-[0.2em] hover:bg-amber-400 transition-colors shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Purchase Gift Card
              </motion.button>

              <div className="flex items-center justify-center gap-6 opacity-30">
                <CreditCard className="w-5 h-5 text-white" />
                <span className="text-[10px] uppercase tracking-widest text-white">Encrypted & Secure Transaction</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
