import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";
import { ShoppingBag, Heart } from "lucide-react";
import { Product } from "../data/products";
import { fetchApi, getSessionId } from "../../utils/api";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const sessionId = getSessionId();
    fetchApi(`/wishlist/check/${product.id}?sessionId=${sessionId}`)
      .then(data => setIsWishlisted(data?.inWishlist === true))
      .catch(() => {});
  }, [product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sessionId = getSessionId();
    const colorsArray = Array.isArray(product.colorList) 
      ? product.colorList 
      : Array.isArray(product.colors) 
        ? product.colors 
        : typeof product.colors === 'string' 
          ? (product.colors as any).split(',') 
          : [];
    const defaultColor = colorsArray.length > 0 ? colorsArray[0] : "";

    fetchApi(`/cart/add?sessionId=${sessionId}`, {
      method: "POST",
      body: JSON.stringify({
        productId: product.id,
        quantity: 1,
        selectedColor: defaultColor
      })
    })
    .then(() => navigate("/cart"))
    .catch(err => console.error("Error adding to cart:", err));
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const sessionId = getSessionId();
    fetchApi(`/wishlist/toggle?sessionId=${sessionId}`, {
      method: "POST",
      body: JSON.stringify({ productId: product.id })
    })
    .then(() => setIsWishlisted(!isWishlisted))
    .catch(err => console.error("Error toggling wishlist:", err));
  };

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900 mb-4">
          {/* Image */}
          <img
            src={`${product.image}${product.image.includes('?') ? '&' : '?'}auto=format&fit=crop&q=70&w=600`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />

          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              onClick={handleAddToCart}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <ShoppingBag className="w-5 h-5 text-black" />
            </motion.button>

            <motion.button
              onClick={handleToggleWishlist}
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-black'}`} />
            </motion.button>
          </motion.div>

          {/* Collection Badge */}
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2">
            <span className="text-xs text-amber-400 tracking-wider uppercase">
              {product.collections}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl text-white font-light tracking-wide group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>
          <p className="text-white/60 text-sm line-clamp-2">{product.description}</p>
          
          {/* Colors */}
          <div className="flex gap-2 pt-2">
            {Array.isArray(product.colorList) || Array.isArray(product.colors) ? (product.colorList || product.colors as any).map((color: string, i: number) => (
              <motion.div
                key={i}
                className="w-6 h-6 rounded-full border border-white/20"
                style={{
                  backgroundColor: color.toLowerCase().includes("black")
                    ? "#000"
                    : color.toLowerCase().includes("white") || color.toLowerCase().includes("ivory")
                    ? "#fff"
                    : color.toLowerCase().includes("beige") || color.toLowerCase().includes("cream") || color.toLowerCase().includes("sand")
                    ? "#d4c5b9"
                    : color.toLowerCase().includes("brown") || color.toLowerCase().includes("cognac") || color.toLowerCase().includes("chocolate")
                    ? "#5d4037"
                    : color.toLowerCase().includes("red") || color.toLowerCase().includes("burgundy")
                    ? "#c62828"
                    : color.toLowerCase().includes("blue")
                    ? "#1a237e"
                    : color.toLowerCase().includes("camel")
                    ? "#c19a6b"
                    : "#999"
                }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              />
            )) : typeof product.colors === 'string' ? (product.colors as any).split(',').map((color: string, i: number) => (
              <motion.div
                key={i}
                className="w-6 h-6 rounded-full border border-white/20"
                style={{
                  backgroundColor: color.toLowerCase().includes("black")
                    ? "#000"
                    : color.toLowerCase().includes("white") || color.toLowerCase().includes("ivory")
                    ? "#fff"
                    : color.toLowerCase().includes("beige") || color.toLowerCase().includes("cream") || color.toLowerCase().includes("sand")
                    ? "#d4c5b9"
                    : color.toLowerCase().includes("brown") || color.toLowerCase().includes("cognac") || color.toLowerCase().includes("chocolate")
                    ? "#5d4037"
                    : color.toLowerCase().includes("red") || color.toLowerCase().includes("burgundy")
                    ? "#c62828"
                    : color.toLowerCase().includes("blue")
                    ? "#1a237e"
                    : color.toLowerCase().includes("camel")
                    ? "#c19a6b"
                    : "#999"
                }}
              />
            )) : null}
          </div>

          <p className="text-2xl text-white font-light pt-2">
            ${product.price.toLocaleString()}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
