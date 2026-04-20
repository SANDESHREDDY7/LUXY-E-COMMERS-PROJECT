import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Heart, ChevronLeft, Trash2 } from "lucide-react";
import { fetchApi, getSessionId } from "../../utils/api";
import { ProductCard } from "../components/ProductCard";
import { Product } from "../data/products";

export function Wishlist() {
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = () => {
    const sessionId = getSessionId();
    fetchApi(`/wishlist?sessionId=${sessionId}`)
      .then(data => {
        if (data && data.items) {
          setWishlistProducts(data.items.map((item: any) => item.product));
        } else {
          setWishlistProducts([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Wishlist error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeFromWishlist = (productId: number) => {
    const sessionId = getSessionId();
    fetchApi(`/wishlist/remove/${productId}?sessionId=${sessionId}`, {
      method: "DELETE"
    }).then(loadWishlist);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 text-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-light">My Wishlist</h1>
          <Link to="/collection" className="text-amber-400 text-sm hover:underline flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" /> Continue Shopping
          </Link>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-24 border border-white/10">
            <Heart className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-6">Your wishlist is empty</p>
            <Link to="/collection" className="px-8 py-3 bg-amber-400 text-black text-sm tracking-wider uppercase inline-block">
              Discover Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistProducts.map((product, index) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} index={index} />
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
