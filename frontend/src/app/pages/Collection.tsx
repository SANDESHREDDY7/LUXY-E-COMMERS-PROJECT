import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { motion } from "motion/react";
import { ProductCard } from "../components/ProductCard";
import { Product } from "../data/products";
import { fetchApi } from "../../utils/api";
import { Filter } from "lucide-react";

export function Collection() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<string[]>(["All"]);

  useEffect(() => {
    // Initial collection from query param
    const collectionParam = searchParams.get("collections") || searchParams.get("collection");
    if (collectionParam) {
      setSelectedCollection(collectionParam);
    }

    // Fetch products
    fetchApi('/products')
      .then((data: Product[]) => setProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
      
    // Fetch dynamic collections
    fetchApi('/collections')
      .then((data: { name: string }[]) => {
        const names = data.map(c => c.name);
        setCollections(["All", ...names]);
      })
      .catch(err => console.error("Failed to fetch collections:", err));
  }, [searchParams]);

  const filteredProducts = products.filter((p) => {
    const matchesCollection = selectedCollection === "All" || p.collections === selectedCollection;
    const matchesQuery = !query || 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) || 
      (p.collections?.toLowerCase().includes(query));
    return matchesCollection && matchesQuery;
  });

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
            Explore
          </motion.p>
          <h1 className="text-6xl md:text-7xl font-light text-white mb-4">
            {query ? `Results for "${query}"` : "Our Collection"}
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            {query ? `Discovering bags matching your search` : `Discover timeless pieces crafted with precision and passion`}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-white/60" />
              <span className="text-white/60 text-sm">Filter by:</span>
            </div>
            <span className="text-white/60 text-sm">
              {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {collections.map((collection) => (
              <motion.button
                key={collection}
                className={`px-6 py-3 text-sm tracking-wider uppercase transition-all ${
                  selectedCollection === collection
                    ? "bg-amber-400 text-black"
                    : "border border-white/20 text-white/60 hover:border-amber-400 hover:text-white"
                }`}
                onClick={() => setSelectedCollection(collection)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {collection}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          layout
        >
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-white/60 text-lg">No items found in this collection</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
