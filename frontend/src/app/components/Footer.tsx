import { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Instagram, Facebook, Twitter, Mail } from "lucide-react";
import { fetchApi } from "../../utils/api";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("submitting");
    fetchApi("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email })
    })
      .then((res: any) => {
        setStatus("success");
        setMessage(res.message || "Thank you for subscribing!");
        setEmail("");
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 5000);
      })
      .catch(() => {
        setStatus("error");
        setMessage("Subscription failed. Please try again.");
      });
  };

  return (
    <footer className="bg-black border-t border-white/10 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/">
              <h3 className="text-2xl font-light tracking-[0.3em] text-white mb-4 hover:text-amber-400 transition-colors">
                LUXÉ
              </h3>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Curating ultra-luxury handbags for the modern connoisseur since 2026.
            </p>
          </motion.div>

          {/* Shop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-white text-sm tracking-wider uppercase mb-4">Shop</h4>
            <ul className="space-y-2">
              {[
                { name: "New Arrivals", path: "/new-arrivals" },
                { name: "Best Sellers", path: "/best-sellers" },
                { name: "Collections", path: "/collections" },
                { name: "Gift Cards", path: "/gift-cards" }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-white/60 text-sm hover:text-amber-400 transition-colors block"
                  >
                    <motion.span whileHover={{ x: 5 }} className="block">
                      {item.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-white text-sm tracking-wider uppercase mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                { name: "Contact Us", path: "/contact" },
                { name: "Shipping & Returns", path: "/shipping" },
                { name: "Care Guide", path: "/care-guide" },
                { name: "FAQ", path: "/faq" }
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-white/60 text-sm hover:text-amber-400 transition-colors block"
                  >
                    <motion.span whileHover={{ x: 5 }} className="block">
                      {item.name}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-white text-sm tracking-wider uppercase mb-4">Newsletter</h4>
            <p className="text-white/60 text-sm mb-4">
              Subscribe for exclusive offers and updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  disabled={status === "submitting" || status === "success"}
                  className="flex-1 bg-white/10 border border-white/20 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  disabled={status === "submitting" || status === "success"}
                  className="bg-amber-400 px-4 py-2 disabled:bg-amber-400/50"
                  whileHover={status === "idle" || status === "error" ? { scale: 1.05 } : {}}
                  whileTap={status === "idle" || status === "error" ? { scale: 0.95 } : {}}
                >
                  <Mail className="w-4 h-4 text-black" />
                </motion.button>
              </div>
              {message && (
                <p className={`text-xs ${status === "success" ? "text-green-400" : "text-amber-500"}`}>
                  {message}
                </p>
              )}
            </form>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-white/40 text-sm">
            © 2026 LUXÉ. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            {[
              { Icon: Instagram, url: "https://instagram.com" },
              { Icon: Facebook, url: "https://facebook.com" },
              { Icon: Twitter, url: "https://twitter.com" }
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-amber-400 hover:border-amber-400 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <social.Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
