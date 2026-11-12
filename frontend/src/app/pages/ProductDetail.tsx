import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ShoppingBag, Heart, ChevronLeft, Star, Shield, Truck, RotateCcw } from "lucide-react";
import { Product } from "../data/products";
import { fetchApi, getSessionId } from "../../utils/api";

interface Review {
  id: number;
  userName: String;
  rating: number;
  comment: string;
  createdAt: string;
}


export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ userName: "", rating: 0, comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);


  useEffect(() => {
    setIsLoading(true);
    fetchApi(`/products/${id}`)
      .then((data: Product) => {
        setProduct(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setIsLoading(false);
      });

    const sessionId = getSessionId();
    fetchApi(`/wishlist/check/${id}?sessionId=${sessionId}`)
      .then(data => setIsWishlisted(data?.inWishlist === true))
      .catch(() => {});

    // Fetch reviews
    fetchApi(`/reviews/product/${id}`)
      .then(data => setReviews(data))
      .catch(err => console.error("Error fetching reviews:", err));
  }, [id]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.userName || !newReview.comment || newReview.rating === 0) return;

    setIsSubmittingReview(true);
    fetchApi(`/reviews`, {
      method: "POST",
      body: JSON.stringify({
        productId: product?.id,
        userName: newReview.userName,
        rating: newReview.rating,
        comment: newReview.comment
      })
    })
    .then((savedReview) => {
      setReviews([savedReview, ...reviews]);
      setNewReview({ userName: "", rating: 0, comment: "" });
      setIsSubmittingReview(false);
    })
    .catch(err => {
      console.error("Error submitting review:", err);
      setIsSubmittingReview(false);
    });
  };


  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl text-white mb-4">Product not found</h2>
          <Link to="/" className="text-amber-400 hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const colorsArray: string[] = Array.isArray(product.colorList) 
    ? product.colorList 
    : Array.isArray(product.colors) 
      ? product.colors 
      : typeof product.colors === 'string' 
        ? (product.colors as any).split(',') 
        : [];

  const detailsArray: string[] = product.detailList 
    ? product.detailList 
    : Array.isArray(product.details)
      ? product.details
      : typeof product.details === 'string'
        ? (product.details as any).split('|')
        : [];

  const handleAddToCart = () => {
    if (!product) return;
    const sessionId = getSessionId();
    fetchApi(`/cart/add?sessionId=${sessionId}`, {
      method: "POST",
      body: JSON.stringify({
        productId: product.id,
        quantity: quantity,
        selectedColor: colorsArray[selectedColor]
      })
    })
    .then(() => navigate("/cart"))
    .catch(err => console.error("Error adding to cart:", err));
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    const sessionId = getSessionId();
    fetchApi(`/wishlist/toggle?sessionId=${sessionId}`, {
      method: "POST",
      body: JSON.stringify({ productId: product.id })
    })
    .then(() => setIsWishlisted(!isWishlisted))
    .catch(err => console.error("Error toggling wishlist", err));
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl text-white mb-4">Product not found</h2>
          <Link to="/" className="text-amber-400 hover:underline">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-24">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/"
            className="inline-flex items-center text-white/60 hover:text-amber-400 transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Collection
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Image */}
          <motion.div
            className="relative aspect-square bg-zinc-900 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
            
            {/* Wishlist Button */}
            <motion.button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleWishlist}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-white'}`} />
            </motion.button>

            {/* Collection Badge */}
            <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-sm px-4 py-2">
              <span className="text-xs text-amber-400 tracking-wider uppercase">
                {product.collections}
              </span>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-white/60 text-sm">(127 reviews)</span>
            </div>

            <h1 className="text-5xl font-light text-white mb-4">{product.name}</h1>
            <p className="text-white/70 text-lg mb-8">{product.description}</p>

            <div className="flex items-baseline gap-4 mb-8">
              <span className="text-4xl text-white font-light">
                ${product.price.toLocaleString()}
              </span>
              <span className="text-white/40 text-sm">Tax included</span>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="text-white text-sm tracking-wider uppercase mb-4">
                Select Color
              </h3>
              <div className="flex gap-3">
                {colorsArray.map((color: string, i: number) => (
                  <motion.button
                    key={i}
                    className={`w-12 h-12 rounded-full border-2 ${
                      selectedColor === i ? "border-amber-400" : "border-white/20"
                    }`}
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
                    onClick={() => setSelectedColor(i)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="sr-only">{color}</span>
                  </motion.button>
                ))}
              </div>
              <p className="text-white/60 text-sm mt-2">{colorsArray[selectedColor]}</p>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-white text-sm tracking-wider uppercase mb-4">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  className="w-10 h-10 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="text-white text-lg w-12 text-center">{quantity}</span>
                <button
                  className="w-10 h-10 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <motion.button
              className="w-full py-5 bg-amber-400 text-black text-sm tracking-wider uppercase flex items-center justify-center gap-3 mb-4"
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(251, 191, 36, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Bag
            </motion.button>

            <motion.button
              className="w-full py-5 border border-white/20 text-white text-sm tracking-wider uppercase hover:bg-white hover:text-black transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Buy Now
            </motion.button>

            {/* Product Details */}
            <div className="mt-12 space-y-6">
              <h3 className="text-white text-xl font-light border-b border-white/10 pb-4">
                Product Details
              </h3>
              <ul className="space-y-3">
                {detailsArray.map((detail: string, i: number) => (
                  <motion.li
                    key={i}
                    className="flex items-start gap-3 text-white/70 text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                    {detail}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Service Icons */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { icon: Shield, text: "Authentic Guarantee" },
                { icon: Truck, text: "Free Shipping" },
                { icon: RotateCcw, text: "30-Day Returns" }
              ].map((service, i) => (
                <motion.div
                  key={i}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <service.icon className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-white/60 text-xs">{service.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-32 border-t border-white/10 pt-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Review Summary */}
            <div>
              <h2 className="text-3xl font-light text-white mb-6">Customer Reviews</h2>
              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl font-light text-white">
                  {reviews.length > 0 
                    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                    : "0.0"}
                </div>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-white/40 text-sm">Based on {reviews.length} reviews</p>
                </div>
              </div>

              {/* Review Form */}
              <form onSubmit={handleSubmitReview} className="space-y-6 bg-zinc-900/50 p-8 rounded-2xl border border-white/5">
                <h3 className="text-white text-lg font-light mb-4">Write a Review</h3>
                <div>
                  <label className="block text-white/60 text-xs uppercase tracking-widest mb-2">Name</label>
                  <input
                    type="text"
                    value={newReview.userName}
                    onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-400 transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-xs uppercase tracking-widest mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star className={`w-6 h-6 ${star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs uppercase tracking-widest mb-2">Comments</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-400 transition-colors min-h-[120px]"
                    placeholder="Share your experience..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingReview || newReview.rating === 0}
                  className="w-full py-4 bg-white text-black text-sm tracking-wider uppercase hover:bg-amber-400 transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmittingReview ? "Submitting..." : (newReview.rating === 0 ? "Select a Rating" : "Post Review")}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-12">
              {reviews.length === 0 ? (
                <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">
                  <p className="text-white/40 italic">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b border-white/5 pb-12"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-white font-medium mb-1">{review.userName}</h4>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-white/30 text-xs">
                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-white/70 leading-relaxed italic">"{review.comment}"</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
