import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Hero } from "../components/Hero";
import { ProductCard } from "../components/ProductCard";
import { fetchApi } from "../../utils/api";
import { Product } from "../data/products";
import { Sparkles, Shield, Truck } from "lucide-react";

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApi('/products')
      .then((data: Product[]) => setFeaturedProducts(data.slice(0, 6)))
      .catch(err => console.error("Failed to load featured products:", err));
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <Hero />

      {/* Features Section */}
      <section className="py-24 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Sparkles,
                title: "Handcrafted Excellence",
                description: "Each piece meticulously crafted by master artisans"
              },
              {
                icon: Shield,
                title: "Authenticity Guaranteed",
                description: "100% authentic luxury bags with certificate"
              },
              {
                icon: Truck,
                title: "White Glove Delivery",
                description: "Complimentary worldwide shipping and insurance"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full border border-amber-400/30 mb-6"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <feature.icon className="w-8 h-8 text-amber-400" />
                </motion.div>
                <h3 className="text-white text-xl mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.p
              className="text-amber-400 tracking-[0.3em] text-sm uppercase mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Discover
            </motion.p>
            <h2 className="text-5xl md:text-6xl font-light text-white mb-4">
              Featured Collection
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Explore our handpicked selection of the finest luxury handbags
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={() => navigate('/collection')}
              className="px-12 py-4 border border-white/20 text-white text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              View All Collection
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Luxury Banner */}
      <section className="relative py-32 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1774653252770-677bd5930d05?auto=format&fit=crop&q=70&w=1200')`
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-light text-white mb-6 italic">
              Bespoke Service
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
              Experience personalized luxury with our exclusive made-to-order service. 
              Create your perfect bag with our design consultants.
            </p>
            <motion.button
              onClick={() => navigate('/contact?book=true')}
              className="px-12 py-4 bg-amber-400 text-black text-sm tracking-wider uppercase font-medium"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(251, 191, 36, 0.5)" }}
              whileTap={{ scale: 0.98 }}
            >
              Book Consultation
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
