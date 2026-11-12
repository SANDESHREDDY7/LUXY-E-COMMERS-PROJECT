import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Trash2, ShoppingBag, ChevronLeft } from "lucide-react";
import { fetchApi, getSessionId } from "../../utils/api";

export function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadCart = () => {
    const sessionId = getSessionId();
    fetchApi(`/cart?sessionId=${sessionId}`)
      .then(data => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQuantity = (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    const sessionId = getSessionId();
    fetchApi(`/cart/item/${cartItemId}?sessionId=${sessionId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity })
    }).then(loadCart);
  };

  const removeItem = (cartItemId: number) => {
    const sessionId = getSessionId();
    fetchApi(`/cart/item/${cartItemId}?sessionId=${sessionId}`, {
      method: "DELETE"
    }).then(loadCart);
  };

  const clearCart = () => {
    const sessionId = getSessionId();
    fetchApi(`/cart/clear?sessionId=${sessionId}`, {
      method: "DELETE"
    }).then(loadCart);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  const items = cart?.cart?.items || [];
  const total = cart?.total || 0;

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-light">Shopping Bag</h1>
          <Link to="/collection" className="text-amber-400 text-sm hover:underline flex items-center">
            <ChevronLeft className="w-4 h-4 mr-1" /> Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-white/10">
            <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-6">Your shopping bag is empty</p>
            <Link to="/collection" className="px-8 py-3 bg-amber-400 text-black text-sm tracking-wider uppercase inline-block">
              Discover Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-8 mb-12">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-6 border-b border-white/10 pb-8">
                  <div className="w-32 h-32 bg-zinc-900 flex-shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-light">{item.product.name}</h3>
                        <p className="text-white/60 text-sm mt-1">Color: {item.selectedColor}</p>
                      </div>
                      <p className="text-lg">${item.product.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 border border-white/20 p-1">
                        <button className="w-6 h-6 flex items-center justify-center hover:bg-white/10" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button className="w-6 h-6 flex items-center justify-center hover:bg-white/10" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 p-8 flex flex-col items-end">
              <div className="flex justify-between w-full max-w-sm mb-4">
                <span className="text-white/60">Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-full max-w-sm mb-8 text-xl font-light">
                <span>Total</span>
                <span className="text-amber-400">${total.toLocaleString()}</span>
              </div>
              <div className="w-full justify-between flex items-center">
                 <button onClick={clearCart} className="text-white/40 hover:text-white text-sm">Clear Bag</button>
                  <Link
                    to="/checkout"
                    className="px-12 py-4 bg-amber-400 text-black text-sm tracking-wider uppercase inline-block text-center"
                  >
                    Checkout
                  </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
