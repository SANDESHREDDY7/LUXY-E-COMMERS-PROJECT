import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function FAQ() {
  const faqs = [
    {
      question: "Are your handbags authentic?",
      answer: "Every single item at LUXÉ undergoes a rigorous 20-point authentication process by our in-house experts. Each purchase includes a signed Certificate of Authenticity and our lifetime authenticity guarantee."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries via DHL Express. All international orders are sent 'Duties & Taxes Paid' (DDP), meaning the price you see at checkout is the final price you pay."
    },
    {
      question: "Can I source a specific rare bag through LUXÉ?",
      answer: "Our Personal Sourcing service is dedicated to finding 'the impossible.' Please contact our concierge team to start a search for specific vintage or limited-edition pieces."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 14-day return window for items in their original condition with security tags attached. Please see our Shipping & Returns page for full details."
    },
    {
      question: "How do I book a private viewing?",
      answer: "Private viewings can be scheduled through the 'Book Appointment' link on our navigation bar. We offer both in-person sessions at our showroom and virtual high-definition viewings."
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
          <HelpCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
          <h1 className="text-6xl md:text-7xl font-light text-white mb-6">Concierge FAQs</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Find answers to common questions about our curation process, shipping, and exclusive services.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>

        <motion.div
          className="mt-20 text-center p-12 border border-white/10 rounded-2xl bg-zinc-900/20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl text-white mb-4">Still have questions?</h3>
          <p className="text-white/60 mb-8">Our dedicated concierge team is available 24/7 to assist you.</p>
          <motion.a 
            href="/contact"
            className="inline-block bg-white text-black px-10 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-amber-400 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Concierge
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}

function FAQItem({ faq, index }: { faq: { question: string, answer: string }, index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      className="border border-white/10 rounded-xl overflow-hidden bg-zinc-900/10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <span className="text-white font-light text-lg">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className={`w-5 h-5 ${isOpen ? "text-amber-400" : "text-white/40"}`} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 pt-0 text-white/50 leading-relaxed border-t border-white/5">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
