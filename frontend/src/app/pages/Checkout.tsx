import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronRight, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ShoppingBag, 
  ChevronLeft,
  ShieldCheck,
  Truck,
  X
} from "lucide-react";
import { fetchApi, getSessionId } from "../../utils/api";
import { loadStripe } from "@stripe/stripe-js";
import { 
  Elements, 
  useStripe, 
  useElements, 
  CardElement 
} from "@stripe/react-stripe-js";

type Step = "shipping" | "payment" | "review" | "success";

const stripePromise = loadStripe("pk_test_PLACEHOLDER"); // User will update or I will fetch

export function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  );
}

function CheckoutContent() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("shipping");
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderResponse, setOrderResponse] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "United States",
    paymentMethod: "Credit Card"
  });

  useEffect(() => {
    const sessionId = getSessionId();
    fetchApi(`/cart?sessionId=${sessionId}`)
      .then(data => {
        setCart(data);
        if (!data?.cart?.items || data.cart.items.length === 0) {
          navigate("/cart");
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        navigate("/cart");
      });
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Stripe Logic ──────────────────────────────────────────
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handlePlaceOrder = async () => {
    if (loading) return;
    setLoading(true);
    setIsProcessingPayment(true);
    setError(null);

    const sessionId = getSessionId();

    try {
      let paymentIntentId = "mock_payment";

      if (formData.paymentMethod === "Credit Card") {
        if (!stripe || !elements) {
          throw new Error("Stripe has not loaded correctly.");
        }

        // 1. Create Payment Intent
        const { clientSecret } = await fetchApi("/payments/create-intent", {
          method: "POST",
          body: JSON.stringify({ sessionId })
        });

        // 2. Confirm Payment
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error("Card element not found.");

        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address,
                city: formData.city,
                postal_code: formData.zip,
                country: "US" // Mapping simplified for demo
              }
            }
          }
        });

        if (result.error) {
          throw new Error(result.error.message);
        }

        if (result.paymentIntent?.status === "succeeded") {
          paymentIntentId = result.paymentIntent.id;
        } else {
          throw new Error("Payment was not successful.");
        }
      }

      // 3. Place Order in Backend
      const order = await fetchApi("/orders/place", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          sessionId,
          paymentIntentId // We'll update the backend to accept this
        })
      });

      setOrderResponse(order);
      setCurrentStep("success");
      setError(null);
    } catch (err: any) {
      console.error("Order process failed:", err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
      setIsProcessingPayment(false);
    }
  };

  if (loading && currentStep !== "success" && !isProcessingPayment) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-amber-400 border-t-transparent rounded-full mb-4"
        />
        <p className="text-amber-400 tracking-widest uppercase text-sm">Securing your session...</p>
      </div>
    );
  }

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: "shipping", label: "Shipping", icon: MapPin },
    { id: "payment", label: "Payment", icon: CreditCard },
    { id: "review", label: "Review", icon: ShoppingBag }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-24 text-white">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {currentStep !== "success" && (
          <>
            {/* Checkout Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8">
              <div>
                <h1 className="text-4xl font-light mb-2 tracking-tight">Checkout</h1>
                <p className="text-white/40 text-sm">Please complete your details to finish your order.</p>
              </div>

              {/* Progress Tracker */}
              <div className="flex items-center gap-4">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = currentStep === step.id;
                  const isCompleted = steps.findIndex(s => s.id === currentStep) > idx;

                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex flex-col items-center gap-2 ${isActive ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-white/20'}`}>
                        <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${isActive ? 'border-amber-400 bg-amber-400/10' : isCompleted ? 'border-white bg-white/10' : 'border-white/10'}`}>
                          {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <span className="text-[10px] uppercase tracking-tighter hidden sm:block">{step.label}</span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={`w-8 h-[1px] mx-2 mb-6 ${isCompleted ? 'bg-white/40' : 'bg-white/10'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Main Form Area */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {currentStep === "shipping" && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                    >
                      <div className="bg-zinc-900/50 border border-white/5 p-8">
                        <h3 className="text-xl font-light mb-8 flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-amber-400" />
                          Delivery Information
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">First Name</label>
                            <input 
                              type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-amber-400 outline-none transition-colors"
                              placeholder="John"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">Last Name</label>
                            <input 
                              type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-amber-400 outline-none transition-colors"
                              placeholder="Doe"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">Email Address</label>
                            <input 
                              type="email" name="email" value={formData.email} onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-amber-400 outline-none transition-colors"
                              placeholder="john@example.com"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">Shipping Address</label>
                            <input 
                              type="text" name="address" value={formData.address} onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-amber-400 outline-none transition-colors"
                              placeholder="711 5th Avenue"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">City</label>
                            <input 
                              type="text" name="city" value={formData.city} onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-amber-400 outline-none transition-colors"
                              placeholder="New York"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-white/40">ZIP / Postcode</label>
                            <input 
                              type="text" name="zip" value={formData.zip} onChange={handleInputChange}
                              className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-amber-400 outline-none transition-colors"
                              placeholder="10022"
                            />
                          </div>
                        </div>

                        <div className="mt-12 flex justify-end">
                          <button 
                            onClick={() => setCurrentStep("payment")}
                            disabled={!formData.firstName || !formData.address || !formData.email}
                            className="px-12 py-4 bg-amber-400 text-black text-sm tracking-wider uppercase font-medium hover:bg-amber-300 transition-colors disabled:opacity-50"
                          >
                            Continue to Payment
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === "payment" && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                    >
                      <div className="bg-zinc-900/50 border border-white/5 p-8">
                        <h3 className="text-xl font-light mb-8 flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-amber-400" />
                          Payment Method
                        </h3>

                        <div className="space-y-4">
                          {[
                            { id: "Credit Card", label: "Credit or Debit Card", sub: "Visa, Mastercard, Amex" },
                            { id: "PayPal", label: "PayPal", sub: "Fast and secure checkout" }
                          ].map(method => (
                            <div 
                              key={method.id}
                              onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                              className={`p-6 border cursor-pointer transition-all ${formData.paymentMethod === method.id ? 'border-amber-400 bg-amber-400/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]' : 'border-white/10 hover:border-white/20'}`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">{method.label}</p>
                                  <p className="text-xs text-white/40 mt-1">{method.sub}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.paymentMethod === method.id ? 'border-amber-400' : 'border-white/20'}`}>
                                  {formData.paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {formData.paymentMethod === "Credit Card" && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-8 pt-8 border-t border-white/5 space-y-6"
                          >
                            <div className="space-y-4">
                              <label className="text-xs uppercase tracking-widest text-white/40">Secure Card Entry</label>
                              <div className="bg-white/5 border border-white/10 px-4 py-4 focus-within:border-amber-400 transition-colors">
                                <CardElement options={{
                                  style: {
                                    base: {
                                      fontSize: '14px',
                                      color: '#ffffff',
                                      letterSpacing: '0.025em',
                                      '::placeholder': { color: '#aab7c4' },
                                    },
                                    invalid: { color: '#ef4444' },
                                  },
                                }} />
                              </div>
                              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3" />
                                Encrypted by Stripe Secure
                              </p>
                            </div>
                          </motion.div>
                        )}

                        <div className="mt-12 flex justify-between items-center">
                          <button 
                            onClick={() => setCurrentStep("shipping")}
                            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase tracking-widest text-xs"
                          >
                            <ChevronLeft className="w-4 h-4" /> Back to Shipping
                          </button>
                          <button 
                            onClick={() => setCurrentStep("review")}
                            className="px-12 py-4 bg-amber-400 text-black text-sm tracking-wider uppercase font-medium hover:bg-amber-300 transition-colors"
                          >
                            Review Order
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === "review" && (
                    <motion.div
                      key="review"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-8"
                    >
                      <div className="bg-zinc-900/50 border border-white/5 p-8">
                        <h3 className="text-xl font-light mb-8 flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-amber-400" />
                          Review Your Order
                        </h3>

                        {error && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 p-4 mb-8 text-red-400 text-sm flex items-center gap-3"
                          >
                            <X className="w-5 h-5" />
                            {error}
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div className="space-y-6">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Shipping To</p>
                              <p className="text-sm">{formData.firstName} {formData.lastName}</p>
                              <p className="text-sm text-white/60">{formData.address}</p>
                              <p className="text-sm text-white/60">{formData.city}, {formData.zip}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Contact</p>
                              <p className="text-sm">{formData.email}</p>
                            </div>
                          </div>
                          <div className="space-y-6">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Payment Method</p>
                              <p className="text-sm flex items-center gap-2 italic">
                                <CreditCard className="w-4 h-4 text-amber-400" />
                                {formData.paymentMethod}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Delivery Service</p>
                              <p className="text-sm flex items-center gap-2">
                                <Truck className="w-4 h-4 text-amber-400" />
                                Complimentary White Glove
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-12 pt-12 border-t border-white/5 flex justify-between items-center">
                          <button 
                            onClick={() => setCurrentStep("payment")}
                            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase tracking-widest text-xs"
                          >
                            <ChevronLeft className="w-4 h-4" /> Back to Payment
                          </button>
                          <button 
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="px-12 py-4 bg-amber-400 text-black text-sm tracking-wider uppercase font-medium hover:bg-amber-300 transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)]"
                          >
                            Place Luxury Order
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sidebar Summary */}
              <div className="lg:sticky lg:top-32 space-y-6">
                <div className="bg-zinc-900 border border-white/5 p-6">
                  <h4 className="text-xs uppercase tracking-[0.3em] font-medium mb-6">Order Summary</h4>
                  <div className="space-y-4 mb-8">
                    {cart?.cart?.items?.map((item: any) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-black flex-shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover opacity-80" />
                        </div>
                        <div className="flex-grow pt-1">
                          <h5 className="text-[11px] uppercase tracking-wider">{item.product.name}</h5>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[10px] text-white/40">Qty: {item.quantity}</span>
                            <span className="text-xs font-light">${item.product.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 pt-6 border-t border-white/10">
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 uppercase tracking-widest">Subtotal</span>
                      <span>${cart?.total?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/40 uppercase tracking-widest">Shipping</span>
                      <span className="text-amber-400">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-lg font-light pt-3 mt-3 border-t border-white/5">
                      <span className="uppercase tracking-widest text-xs pt-1.5 text-white/60">Total</span>
                      <span className="text-amber-400">${cart?.total?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-white/10 flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-amber-400/40" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-white/80">Secure Checkout</p>
                    <p className="text-[9px] text-white/40">SSL Encrypted Transaction</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Success View */}
        {currentStep === "success" && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl mx-auto text-center py-20"
          >
            <div className="w-24 h-24 rounded-full border border-amber-400 flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(251,191,36,0.2)]">
              <CheckCircle2 className="w-12 h-12 text-amber-400" />
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-amber-400 tracking-[0.4em] uppercase text-xs mb-4"
            >
              Order Confirmed
            </motion.p>
            
            <h2 className="text-5xl font-light mb-8 italic">Thank you for your purchase</h2>
            
            <div className="bg-zinc-900 border border-white/5 p-8 mb-12 text-left space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">Order ID:</span>
                <span className="text-amber-400 font-mono tracking-wider">#LUXE-{orderResponse?.id || '28374'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/40">Total Paid:</span>
                <span className="font-light">${orderResponse?.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-xs text-white/50 leading-relaxed">
                  A confirmation email has been sent to <span className="text-white">{formData.email}</span>. 
                  Our concierge team will reach out shortly regarding white-glove delivery arrangements.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/collection" className="px-10 py-4 border border-white/20 text-white text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all">
                Continue Shopping
              </Link>
              <Link to="/" className="px-10 py-4 bg-amber-400 text-black text-xs tracking-[0.2em] uppercase font-bold hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all">
                Back to Home
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
