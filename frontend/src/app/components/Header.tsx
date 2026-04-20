import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Menu, X, Search, Heart, ArrowLeft } from "lucide-react";
import { fetchApi, getSessionId } from "../../utils/api";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminPage = location.pathname === "/admin";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collection?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAdminPage) return;
    const sessionId = getSessionId();
    fetchApi(`/cart?sessionId=${sessionId}`)
      .then(cart => {
        const count = cart?.cart?.items?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 0;
        setCartCount(count);
      })
      .catch(() => setCartCount(0));

    fetchApi(`/wishlist?sessionId=${sessionId}`)
      .then(data => {
        setWishlistCount(data?.count || 0);
      })
      .catch(() => setWishlistCount(0));
  }, [location]);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Collection", path: "/collection" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  // ── Admin Header — clean, minimal, no public nav ─────────────
  if (isAdminPage) {
    return (
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "bg-black/95 backdrop-blur-md py-4" : "bg-black/80 backdrop-blur-sm py-5"
        } border-b border-white/[0.06]`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-light tracking-[0.3em] text-white">LUXÉ</span>
            <div className="h-5 w-px bg-white/20" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400/80 font-medium">
              Admin Console
            </span>
          </div>

          <Link to="/">
            <motion.div
              className="flex items-center gap-2 text-white/40 hover:text-white text-xs tracking-wider uppercase transition-colors"
              whileHover={{ x: -3 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Store
            </motion.div>
          </Link>
        </div>
      </motion.header>
    );
  }

  // ── Public Header ─────────────────────────────────────────────
  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-black/95 backdrop-blur-md py-4" : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              className="text-2xl font-light tracking-[0.3em] text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              LUXÉ
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path}>
                <motion.div
                  className={`text-sm tracking-wider uppercase ${
                    location.pathname === item.path
                      ? "text-amber-400"
                      : "text-white/80 hover:text-white"
                  } transition-colors`}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.div>
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <motion.button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`transition-colors ${isSearchOpen ? "text-amber-400" : "text-white/80 hover:text-white"}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="w-5 h-5" />
            </motion.button>

            <Link to="/wishlist">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </motion.div>
            </Link>

            <Link to="/cart">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/10 overflow-hidden"
            >
              <div className="container mx-auto px-6 py-4">
                <form onSubmit={handleSearch} className="relative flex items-center max-w-2xl mx-auto">
                  <Search className="absolute left-4 w-5 h-5 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search collection..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-full py-3 pl-12 pr-12 text-white focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-colors"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 text-white/50 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              className="md:hidden mt-6 pt-6 border-t border-white/10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navItems.map((item, index) => (
                <Link key={item.name} to={item.path}>
                  <motion.div
                    className={`py-3 text-sm tracking-wider uppercase ${
                      location.pathname === item.path ? "text-amber-400" : "text-white/80"
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
