import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { motion } from "motion/react";
import { Mail, Phone, MapPin, Clock, X, Calendar, Clock4 } from "lucide-react";
import { fetchApi } from "../../utils/api";
import { AnimatePresence } from "motion/react";

export function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });
  const [status, setStatus] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "10:00 AM",
    interestCollections: "Handbags",
    notes: ""
  });
  const [bookingStatus, setBookingStatus] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('book') === 'true') {
      setIsBookingModalOpen(true);
    }
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    fetchApi('/contact/submit', {
      method: "POST",
      body: JSON.stringify(formData)
    })
    .then(() => setStatus("success"))
    .catch(() => setStatus("error"));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStatus("submitting");
    fetchApi('/appointments/book', {
      method: "POST",
      body: JSON.stringify(bookingData)
    })
    .then(() => {
      setBookingStatus("success");
      setTimeout(() => {
        setIsBookingModalOpen(false);
        setBookingStatus("");
        setBookingData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          preferredDate: "",
          preferredTime: "10:00 AM",
          interestCollections: "Handbags",
          notes: ""
        });
      }, 3000);
    })
    .catch(() => setBookingStatus("error"));
  };
  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.p
            className="text-amber-400 tracking-[0.3em] text-sm uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Get in Touch
          </motion.p>
          <h1 className="text-6xl md:text-7xl font-light text-white mb-4">Contact Us</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Our team is here to assist you with any inquiries
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-3xl font-light text-white mb-8">Send us a Message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/60 text-sm mb-2 tracking-wider uppercase">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-2 tracking-wider uppercase">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 transition-colors"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 tracking-wider uppercase">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 tracking-wider uppercase">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 transition-colors"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 tracking-wider uppercase">
                  Subject
                </label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition-colors">
                  <option>General Inquiry</option>
                  <option>Product Question</option>
                  <option>Order Support</option>
                  <option>Bespoke Service</option>
                </select>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2 tracking-wider uppercase">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  placeholder="Tell us how we can help..."
                  required
                />
              </div>

              {status === "success" && <p className="text-green-400 text-sm">Message sent successfully!</p>}
              {status === "error" && <p className="text-red-400 text-sm">Failed to send message. Please try again.</p>}

              <motion.button
                type="submit"
                disabled={status === "submitting"}
                className={`w-full py-4 bg-amber-400 text-black text-sm tracking-wider uppercase ${status === 'submitting' ? 'opacity-70' : ''}`}
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(251, 191, 36, 0.4)" }}
                whileTap={{ scale: 0.98 }}
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-3xl font-light text-white mb-8">Contact Information</h2>

            <div className="space-y-8 mb-12">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  content: "contact@luxebags.com",
                  link: "mailto:contact@luxebags.com"
                },
                {
                  icon: Phone,
                  title: "Phone",
                  content: "+1 (555) 123-4567",
                  link: "tel:+15551234567"
                },
                {
                  icon: MapPin,
                  title: "Address",
                  content: "711 5th Avenue, New York, NY 10022"
                },
                {
                  icon: Clock,
                  title: "Hours",
                  content: "Mon - Sat: 10AM - 8PM EST"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-full border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white text-sm tracking-wider uppercase mb-1">
                      {item.title}
                    </h3>
                    {item.link ? (
                      <a
                        href={item.link}
                        className="text-white/70 hover:text-amber-400 transition-colors"
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-white/70">{item.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="aspect-video bg-zinc-900 border border-white/10 overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2537169430855!2d-73.97491092341885!3d40.76182573453303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258f000000001%3A0x67399435b0e5e04!2s711%205th%20Ave%2C%20New%20York%2C%20NY%2010022%2C%20USA!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }}
                allowFullScreen={true}
                loading="lazy"
                title="Google Maps Location"
              ></iframe>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              className="mt-8 p-6 border border-amber-400/20 bg-amber-400/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <h3 className="text-white text-lg mb-3">Schedule a Private Viewing</h3>
              <p className="text-white/70 text-sm mb-4">
                Book an appointment for an exclusive, personalized shopping experience
                at our flagship boutique.
              </p>
              <motion.button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-6 py-3 border border-amber-400 text-amber-400 text-sm tracking-wider uppercase hover:bg-amber-400 hover:text-black transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Appointment
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 p-8 overflow-y-auto max-h-[90vh]"
            >
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="mb-8">
                <h2 className="text-3xl font-light text-white mb-2 tracking-wide">Schedule a Viewing</h2>
                <p className="text-white/60 text-sm">Experience our collection in a private, guided setting.</p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/60 text-xs mb-2 tracking-wider uppercase">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={bookingData.firstName}
                      onChange={handleBookingChange}
                      className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-2 tracking-wider uppercase">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={bookingData.lastName}
                      onChange={handleBookingChange}
                      className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/60 text-xs mb-2 tracking-wider uppercase">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={bookingData.email}
                      onChange={handleBookingChange}
                      className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-2 tracking-wider uppercase">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingData.phone}
                      onChange={handleBookingChange}
                      className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/60 text-xs mb-2 tracking-wider uppercase">Preferred Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        name="preferredDate"
                        value={bookingData.preferredDate}
                        onChange={handleBookingChange}
                        className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-amber-400 [color-scheme:dark]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-2 tracking-wider uppercase">Preferred Time</label>
                    <select
                      name="preferredTime"
                      value={bookingData.preferredTime}
                      onChange={handleBookingChange}
                      className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                    >
                      {["10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"].map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-xs mb-2 tracking-wider uppercase">Interest Collection</label>
                  <select
                    name="interestCollections"
                    value={bookingData.interestCollections}
                    onChange={handleBookingChange}
                    className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                  >
                    {["Handbags", "Crossbody", "Evening", "Tote", "Statement", "General"].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/60 text-xs mb-2 tracking-wider uppercase">Special Notes</label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleBookingChange}
                    rows={3}
                    className="w-full bg-white/5 border border-white/20 px-4 py-3 text-white focus:outline-none focus:border-amber-400 resize-none"
                    placeholder="Any specific bags or requirements?"
                  />
                </div>

                {bookingStatus === "success" && (
                  <p className="text-green-400 text-sm text-center bg-green-400/10 py-3 border border-green-400/20">
                    Booking request sent successfully! We will contact you shortly.
                  </p>
                )}
                {bookingStatus === "error" && (
                  <p className="text-red-400 text-sm text-center bg-red-400/10 py-3 border border-red-400/20">
                    Something went wrong. Please try again.
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={bookingStatus === "submitting"}
                  className="w-full py-4 bg-amber-400 text-black text-sm tracking-wider uppercase font-medium disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {bookingStatus === "submitting" ? "Processing..." : "Confirm Booking Request"}
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
