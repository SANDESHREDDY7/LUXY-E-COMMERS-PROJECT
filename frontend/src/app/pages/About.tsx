import { motion } from "motion/react";
import { Award, Globe, Heart, Users } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-24">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.p
            className="text-amber-400 tracking-[0.3em] text-sm uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            About Us
          </motion.p>
          <h1 className="text-6xl md:text-7xl font-light text-white mb-6">
            Crafting Luxury,
            <br />
            <span className="italic">Defining Excellence</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Since 2026, LUXÉ has been at the forefront of ultra-luxury handbag curation,
            bringing together the world's finest craftsmanship and timeless design.
          </p>
        </motion.div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            className="relative aspect-square bg-zinc-900 overflow-hidden"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src="https://images.unsplash.com/photo-1678723357379-d87f2a0ec8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBsdXh1cnklMjBmYXNoaW9ufGVufDF8fHx8MTc3NTExMTEwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Our Story"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-4xl font-light text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-white/70 leading-relaxed">
              <p>
                LUXÉ was born from a passion for exceptional craftsmanship and an unwavering
                commitment to quality. We scour the globe to bring you the most exquisite
                handbags, each one a masterpiece of design and artistry.
              </p>
              <p>
                Our curators have decades of combined experience in luxury fashion, ensuring
                that every piece in our collection meets the highest standards of excellence.
                From the finest Italian leathers to precious metal hardware, every detail
                is scrutinized.
              </p>
              <p>
                We believe that a luxury handbag is more than an accessory—it's an investment
                in timeless elegance, a statement of personal style, and a piece of wearable art
                that will be treasured for generations.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gradient-to-b from-black to-zinc-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl font-light text-white mb-4">Our Values</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: "Excellence",
                description: "We accept nothing but the finest quality in every piece"
              },
              {
                icon: Globe,
                title: "Global Curation",
                description: "Sourcing the world's most exceptional handbags"
              },
              {
                icon: Heart,
                title: "Passion",
                description: "Driven by our love for luxury craftsmanship"
              },
              {
                icon: Users,
                title: "Service",
                description: "Dedicated to providing an unparalleled experience"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-amber-400/30 mb-6"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <value.icon className="w-10 h-10 text-amber-400" />
                </motion.div>
                <h3 className="text-white text-xl mb-3">{value.title}</h3>
                <p className="text-white/60 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Satisfied Clients" },
              { number: "500+", label: "Exclusive Pieces" },
              { number: "50+", label: "Countries Worldwide" },
              { number: "100%", label: "Authentic Guarantee" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center py-8 border border-white/10"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ borderColor: "rgba(251, 191, 36, 0.5)" }}
              >
                <motion.div
                  className="text-5xl font-light text-amber-400 mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                <p className="text-white/60 text-sm tracking-wider uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
