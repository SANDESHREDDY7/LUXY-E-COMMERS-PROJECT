
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle, Reply, Mail, Users, Calendar, ShoppingBag,
  X, TrendingUp, Clock, AlertCircle, Eye, Trash2, RefreshCw,
  LogOut, MessageSquare, Package, ChevronRight, LayoutDashboard, Plus, Upload, ImageIcon
} from "lucide-react";
import { fetchApi } from "../../utils/api";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell 
} from 'recharts';


type ContactMessage = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
};

type NewsletterSubscriber = {
  id: number;
  email: string;
  status: string;
  subscribedAt: string;
};

type Appointment = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  interestCollections: string;
  notes: string;
  status: string;
  createdAt: string;
};

type OrderItem = {
  id: number;
  productName: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

type Product = {
  id?: number;
  name: string;
  price: number;
  collections: string;
  image: string;
  description: string;
  colors: string;
  details: string;
  createdAt?: string;
};

type Collection = {
  id: number;
  name: string;
};

type Tab = "overview" | "contacts" | "newsletter" | "appointments" | "orders" | "inventory" | "analytics" | "collections";

const statusStyles: Record<string, string> = {
  PENDING:    "bg-amber-400/15 text-amber-400 border border-amber-400/30",
  READ:       "bg-blue-400/15 text-blue-400 border border-blue-400/30",
  REPLIED:    "bg-green-400/15 text-green-400 border border-green-400/30",
  CONFIRMED:  "bg-blue-400/15 text-blue-400 border border-blue-400/30",
  CANCELLED:  "bg-red-400/15 text-red-400 border border-red-400/30",
  COMPLETED:  "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30",
  ACTIVE:     "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30",
  PAID:       "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30",
  SHIPPED:    "bg-blue-400/15 text-blue-400 border border-blue-400/30",
  DELIVERED:  "bg-emerald-400/15 text-emerald-400 border border-emerald-400/30",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2.5 py-1 text-[10px] font-semibold tracking-widest rounded-sm uppercase ${statusStyles[status] || "bg-white/10 text-white/60"}`}>
      {status}
    </span>
  );
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
  return (
    <tr>
      <td colSpan={10} className="py-20 text-center">
        <Icon className="w-10 h-10 text-white/10 mx-auto mb-3" />
        <p className="text-white/30 text-sm">{message}</p>
      </td>
    </tr>
  );
}

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [editCollectionName, setEditCollectionName] = useState("");
  const [loading, setLoading] = useState(false);

  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  // Product UI State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Product>({
    name: "", price: 0, collections: "", image: "", description: "", colors: "", details: ""
  });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        alert("Please select an image file.");
        return;
    }

    // Limit file size (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please select an image under 2MB.");
        return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
        setProductForm(prev => ({ ...prev, image: reader.result as string }));
        setIsUploading(false);
    };
    reader.onerror = () => {
        alert("Failed to read file.");
        setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const fetchCollections = async () => {
    try {
      const data = await fetchApi("/collections");
      setCollections(data);
      if (data.length > 0 && !productForm.collections) {
        setProductForm(prev => ({ ...prev, collection: data[0].name }));
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const addCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    try {
      await fetchApi("/collections", {
        method: "POST",
        body: JSON.stringify({ name: newCollectionName })
      });
      setNewCollectionName("");
      fetchCollections();
    } catch (error) {
      console.error("Error adding collection:", error);
    }
  };

  const deleteCollection = async (id: number) => {
    if (!window.confirm("Are you sure? This may affect products using this collection.")) return;
    try {
      await fetchApi(`/collections/${id}`, { method: "DELETE" });
      fetchCollections();
    } catch (error) {
      console.error("Error deleting collection:", error);
    }
  };

  const updateCollection = async (id: number) => {
    if (!editCollectionName.trim()) return;
    try {
      await fetchApi(`/collections/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editCollectionName })
      });
      setEditingCollection(null);
      fetchCollections();
    } catch (error) {
      console.error("Error updating collection:", error);
    }
  };

  const fetchAll = () => {
    setLoading(true);
    Promise.all([
      fetchApi("/contact/messages").then(setContacts).catch(() => setContacts([])),
      fetchApi("/newsletter/subscribers").then(setSubscribers).catch(() => setSubscribers([])),
      fetchApi("/appointments").then(setAppointments).catch(() => setAppointments([])),
      fetchApi("/orders").then(setOrders).catch(() => setOrders([])),
      fetchApi("/products").then(res => setProducts(res.sort((a: any, b: any) => (b.id || 0) - (a.id || 0)))).catch(() => setProducts([])),
      fetchApi("/analytics/summary").then(setAnalyticsData).catch(() => setAnalyticsData(null)),
      fetchApi("/collections").then(setCollections).catch(() => setCollections([])),
    ]).finally(() => setLoading(false));
  };

  const fetchTab = (tab: Tab) => {
    if (tab === "overview") { fetchAll(); return; }
    const endpoints: Record<string, string> = {
      contacts:     "/contact/messages",
      newsletter:   "/newsletter/subscribers",
      appointments: "/appointments",
      orders:       "/orders",
      inventory:    "/products",
      analytics:    "/analytics/summary",
      collections:  "/collections",
    };
    const setters: Record<string, any> = {
      contacts: setContacts, newsletter: setSubscribers,
      appointments: setAppointments, orders: setOrders,
      inventory: setProducts, analytics: setAnalyticsData,
      collections: setCollections,
    };
    setLoading(true);
    fetchApi(endpoints[tab])
      .then(res => {
        if (tab === "inventory") {
          setters[tab](res.sort((a: any, b: any) => (b.id || 0) - (a.id || 0)));
        } else {
          setters[tab](res);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) fetchTab(activeTab);
  }, [isAuthenticated, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "luxeadmin") {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password. Please try again.");
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetchApi(`/contact/messages/${id}/read`, { method: "PUT" });
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status: "READ" } : c));
    } catch (e) { console.error(e); }
  };

  const deleteContact = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await fetchApi(`/contact/messages/${id}`, { method: "DELETE" });
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (e) { console.error(e); }
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyingTo || !replyText.trim()) return;
    setIsSendingReply(true);
    try {
      await fetchApi(`/contact/messages/${replyingTo}/reply`, {
        method: "PUT",
        body: JSON.stringify({ replyText })
      });
      setContacts(prev => prev.map(c => c.id === replyingTo ? { ...c, status: "REPLIED" } : c));
      setReplyingTo(null);
      setReplyText("");
    } catch { alert("Failed to send reply"); }
    finally { setIsSendingReply(false); }
  };

  const handleAppointmentAction = async (id: number, action: "confirm" | "cancel" | "complete") => {
    try {
      const updated = await fetchApi(`/appointments/${id}/${action}`, { method: "PUT" });
      setAppointments(prev => prev.map(a => a.id === id ? updated : a));
    } catch { alert(`Failed to ${action} appointment`); }
  };

  const handleOrderAction = async (id: number, status: string) => {
    try {
      const updated = await fetchApi(`/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      setOrders(prev => prev.map(o => o.id === id ? updated : o));
    } catch { alert(`Failed to update order status to ${status}`); }
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProduct(true);
    try {
      const method = editingProduct ? "PUT" : "POST";
      const endpoint = editingProduct ? `/products/${editingProduct.id}` : "/products";
      
      // Sanitize payload
      const payload = { ...productForm };
      delete (payload as any).createdAt;
      if (!editingProduct) delete (payload as any).id;

      const result = await fetchApi(endpoint, {
        method,
        body: JSON.stringify(payload)
      });
      
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === result.id ? result : p).sort((a: any, b: any) => (b.id || 0) - (a.id || 0)));
      } else {
        setProducts(prev => [result, ...prev]);
      }
      
      setIsProductModalOpen(false);
      setEditingProduct(null);
      setProductForm({ name: "", price: 0, collection: "", image: "", description: "", colors: "", details: "" });
    } catch (err) {
      alert("Failed to save product. Please check all fields.");
    } finally {
      setIsSavingProduct(false);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await fetchApi(`/products/${id}`, { method: "DELETE" });
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteConfirmId(null);
    } catch { alert("Failed to delete product"); }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", price: 0, collection: "", image: "", description: "", colors: "", details: "" });
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({ ...product });
    setIsProductModalOpen(true);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try { return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return dateStr; }
  };

  const formatDateTime = (dateStr: string): { date: string; time: string } => {
    if (!dateStr) return { date: "—", time: "" };
    try {
      const d = new Date(dateStr);
      const date = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
      return { date, time };
    } catch { return { date: dateStr, time: "" }; }
  };

  // ── Stats ──────────────────────────────────────────────────
  const pendingContacts    = contacts.filter(c => c.status === "PENDING").length;
  const pendingAppts       = appointments.filter(a => a.status === "PENDING").length;
  const totalRevenue       = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const activeSubscribers  = subscribers.filter(s => s.status === "ACTIVE").length;

  // ── Login ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-light text-white tracking-[0.3em] mb-2">LUXÉ</h1>
            <p className="text-white/40 text-xs tracking-widest uppercase">Admin Portal</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white/[0.03] border border-white/10 p-8 backdrop-blur-sm shadow-2xl">
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-3 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
              className="w-full bg-white/5 border border-white/10 px-4 py-3.5 text-white mb-2 focus:outline-none focus:border-amber-400 transition-all"
              autoFocus
            />
            {loginError && (
              <p className="text-red-400 text-[10px] mb-4 flex items-center gap-1.5 uppercase font-medium">
                <AlertCircle className="w-3 h-3" /> {loginError}
              </p>
            )}
            <motion.button
              type="submit"
              className="w-full mt-4 bg-amber-400 text-black py-4 font-bold tracking-[0.2em] text-xs hover:bg-white transition-all shadow-lg shadow-amber-400/5 uppercase"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ACCESS DASHBOARD
            </motion.button>
          </form>
        </motion.div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any; count?: number }[] = [
    { id: "overview",     label: "Overview",      icon: LayoutDashboard },
    { id: "inventory",    label: "Inventory",     icon: ShoppingBag,   count: products.length },
    { id: "contacts",     label: "Enquiries",     icon: MessageSquare, count: contacts.length },
    { id: "newsletter",   label: "Newsletter",    icon: Mail,          count: subscribers.length },
    { id: "appointments", label: "Appointments",  icon: Calendar,      count: appointments.length },
    { id: "orders",       label: "Orders",        icon: Package,       count: orders.length },
    { id: "analytics",    label: "Analytics",     icon: TrendingUp },
    { id: "collections",  label: "Collections",   icon: LayoutDashboard, count: collections.length },
  ];

  return (
    <div className="min-h-screen bg-[#080808] pt-28 pb-20 text-white">
      <div className="max-w-screen-xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-light tracking-widest">Dashboard Console</h1>
            <p className="text-white/30 text-xs mt-1 tracking-wider">Luxé Admin — Internal Management</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => fetchTab(activeTab)}
              className="flex items-center gap-2 text-white/40 hover:text-amber-400 transition-colors text-xs tracking-wider"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 text-white/40 hover:text-red-400 transition-colors text-xs tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-10 bg-white/[0.03] border border-white/10 p-1 w-fit rounded-sm">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 text-[10px] tracking-[0.15em] uppercase font-bold transition-all rounded-sm ${
                  activeTab === tab.id
                    ? "bg-amber-400 text-black shadow-lg shadow-amber-400/10"
                    : "text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-black/20 text-black" : "bg-white/10 text-white/40"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >

            {/* ── OVERVIEW ──────────────────────────────────── */}
            {activeTab === "overview" && (
              <div>
                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                  {[
                    { label: "Total Revenue",       value: `$${totalRevenue.toLocaleString()}`, sub: `${orders.length} orders`,       icon: TrendingUp,  color: "text-amber-400",   bg: "bg-amber-400/10" },
                    { label: "Inventory",           value: products.length,                     sub: "Luxury Items",                  icon: ShoppingBag, color: "text-amber-400",   bg: "bg-amber-400/10" },
                    { label: "Pending Enquiries",    value: pendingContacts,                     sub: `${contacts.length} messages`,   icon: Mail,        color: "text-purple-400",  bg: "bg-purple-400/10" },
                    { label: "Pending Appointments", value: pendingAppts,                        sub: `${appointments.length} booked`, icon: Calendar,    color: "text-green-400",   bg: "bg-green-400/10" },
                  ].map((card, i) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-white/[0.03] border border-white/10 p-6 hover:border-white/20 transition-colors"
                    >
                      <div className={`w-10 h-10 ${card.bg} rounded-sm flex items-center justify-center mb-4`}>
                        <card.icon className={`w-5 h-5 ${card.color}`} />
                      </div>
                      <p className="text-3xl font-light mb-1">{card.value}</p>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-medium">{card.label}</p>
                      <p className="text-[10px] text-white/20 mt-1">{card.sub}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Orders */}
                  <div className="bg-white/[0.03] border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-2"><Package className="w-4 h-4" />Recent Orders</h3>
                      <button onClick={() => setActiveTab("orders")} className="text-amber-400 text-[10px] tracking-widest uppercase flex items-center gap-1 hover:gap-2 transition-all">View All <ChevronRight className="w-3 h-3" /></button>
                    </div>
                    {orders.length === 0 ? <p className="text-white/30 text-xs py-10 text-center">No orders yet.</p> : (
                      <div className="space-y-3">
                        {orders.slice(0, 5).map(o => (
                          <div key={o.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                            <div>
                              <p className="text-sm">{o.firstName} {o.lastName}</p>
                              <p className="text-[10px] text-white/40">#{`LUXE-${o.id}`} · {formatDate(o.createdAt)}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-amber-400 text-sm font-medium">${o.totalAmount?.toLocaleString()}</p>
                              <StatusBadge status={o.status} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Inventory */}
                  <div className="bg-white/[0.03] border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-bold flex items-center gap-2"><ShoppingBag className="w-4 h-4" />New Additions</h3>
                      <button onClick={() => setActiveTab("inventory")} className="text-amber-400 text-[10px] tracking-widest uppercase flex items-center gap-1 hover:gap-2 transition-all">Manage <ChevronRight className="w-3 h-3" /></button>
                    </div>
                    {products.length === 0 ? <p className="text-white/30 text-xs py-10 text-center">Empty portfolio.</p> : (
                      <div className="space-y-3">
                        {products.slice(0, 5).map(p => (
                          <div key={p.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                            <div className="flex items-center gap-3">
                                <img src={p.image} className="w-8 h-8 object-cover border border-white/10" alt="" />
                                <div>
                                    <p className="text-sm">{p.name}</p>
                                    <p className="text-[10px] text-white/40 uppercase">{p.collections}</p>
                                </div>
                            </div>
                            <p className="text-amber-400 text-sm font-medium">${p.price.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── INVENTORY ──────────────────────────────────── */}
            {activeTab === "inventory" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-light tracking-wider">Product Inventory
                      <span className="ml-3 text-xs text-white/30">({products.length} items)</span>
                    </h2>
                  </div>
                  <button onClick={openAddProduct} className="bg-amber-400 text-black px-6 py-2.5 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-amber-300 transition-all flex items-center gap-2 shadow-lg shadow-amber-400/10">
                    <Plus className="w-4 h-4" /> New Asset
                  </button>
                </div>
                <div className="bg-white/[0.03] border border-white/10 overflow-hidden">
                  <div className="overflow-x-auto text-sm">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="px-6 py-5 text-left text-[10px] uppercase tracking-widest text-white/40 font-bold">Item & Composition</th>
                          <th className="px-6 py-5 text-left text-[10px] uppercase tracking-widest text-white/40 font-bold">Collection</th>
                          <th className="px-6 py-5 text-left text-[10px] uppercase tracking-widest text-white/40 font-bold">Price</th>
                          <th className="px-6 py-5 text-left text-[10px] uppercase tracking-widest text-white/40 font-bold">Registered</th>
                          <th className="px-6 py-5 text-right text-[10px] uppercase tracking-widest text-white/40 font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length === 0 && <EmptyState icon={ShoppingBag} message="Empty portfolio inventory." />}
                        {products.map(p => (
                          <tr key={p.id} className="border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden">
                                    <img src={p.image} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-white mb-0.5">{p.name}</p>
                                    <p className="text-[10px] text-white/30 uppercase truncate max-w-[200px]">{p.description}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5"><span className="text-[10px] uppercase tracking-[0.15em] text-white/60">{p.collections}</span></td>
                            <td className="px-6 py-5 font-medium text-amber-400">${p.price.toLocaleString()}</td>
                            <td className="px-6 py-5 text-white/30 text-[10px]">{p.createdAt ? formatDate(p.createdAt) : "—"}</td>
                            <td className="px-6 py-5">
                                <div className="flex items-center justify-end gap-3">
                                    <button onClick={() => openEditProduct(p)} title="Edit" className="p-2 text-white/30 hover:text-white hover:bg-white/5 rounded-full transition-all">
                                        <Eye className="w-4.5 h-4.5" />
                                    </button>
                                    <button onClick={() => setDeleteConfirmId(p.id!)} title="Delete" className="p-2 text-white/30 hover:text-red-400 hover:bg-red-400/5 rounded-full transition-all">
                                        <Trash2 className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── CONTACTS ──────────────────────────────────── */}
            {activeTab === "contacts" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-light tracking-wider">Contact Enquiries
                    <span className="ml-3 text-xs text-white/30">({contacts.length} total · {pendingContacts} pending)</span>
                  </h2>
                </div>
                <div className="bg-white/[0.03] border border-white/10 overflow-hidden text-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Status</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Name</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Email</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Subject</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Message</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Date</th>
                          <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-white/40 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.length === 0 && <EmptyState icon={MessageSquare} message="No contact enquiries found." />}
                        {contacts.map(msg => (
                          <tr key={msg.id} className={`border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors ${msg.status === "PENDING" ? "bg-amber-400/[0.02]" : ""}`}>
                            <td className="px-6 py-4"><StatusBadge status={msg.status} /></td>
                            <td className="px-6 py-4 font-medium whitespace-nowrap">{msg.firstName} {msg.lastName}</td>
                            <td className="px-6 py-4 text-white/60 text-xs">{msg.email}</td>
                            <td className="px-6 py-4 text-white/70 text-xs">{msg.subject || "—"}</td>
                            <td className="px-6 py-4 max-w-xs">
                              <p className="text-white/60 text-xs truncate" title={msg.message}>{msg.message}</p>
                            </td>
                            <td className="px-6 py-4 text-white/40 text-xs whitespace-nowrap">{formatDate(msg.createdAt)}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {msg.status === "PENDING" && (
                                  <button onClick={() => markAsRead(msg.id)}
                                    title="Mark as Read"
                                    className="p-1.5 text-white/30 hover:text-blue-400 hover:bg-blue-400/10 rounded transition-colors">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}
                                {msg.status !== "REPLIED" && (
                                  <button onClick={() => { setReplyingTo(msg.id); setReplyText(""); }}
                                    title="Reply"
                                    className="p-1.5 text-white/30 hover:text-green-400 hover:bg-green-400/10 rounded transition-colors">
                                    <Reply className="w-4 h-4" />
                                  </button>
                                )}
                                <button onClick={() => deleteContact(msg.id)}
                                  title="Delete"
                                  className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── NEWSLETTER ────────────────────────────────── */}
            {activeTab === "newsletter" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-light tracking-wider">Newsletter Subscribers
                    <span className="ml-3 text-xs text-white/30">({subscribers.length} total · {activeSubscribers} active)</span>
                  </h2>
                </div>
                <div className="bg-white/[0.03] border border-white/10 overflow-hidden text-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">#</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Email Address</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Subscribed On</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscribers.length === 0 && <EmptyState icon={Mail} message="No newsletter subscribers found." />}
                        {subscribers.map((sub, i) => (
                          <tr key={sub.id} className="border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors">
                            <td className="px-6 py-4 text-white/20 text-xs">{i + 1}</td>
                            <td className="px-6 py-4 font-medium">{sub.email}</td>
                            <td className="px-6 py-4 text-white/40 text-xs">{formatDate(sub.subscribedAt)}</td>
                            <td className="px-6 py-4"><StatusBadge status={sub.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── APPOINTMENTS ──────────────────────────────── */}
            {activeTab === "appointments" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-light tracking-wider">Appointments
                    <span className="ml-3 text-xs text-white/30">({appointments.length} total · {pendingAppts} pending)</span>
                  </h2>
                </div>
                <div className="bg-white/[0.03] border border-white/10 overflow-hidden text-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Status</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Customer</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Date & Time</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Collection</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Notes</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Booked</th>
                          <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-white/40 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.length === 0 && <EmptyState icon={Calendar} message="No appointments booked yet." />}
                        {appointments.map(appt => (
                          <tr key={appt.id} className={`border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors ${appt.status === "PENDING" ? "bg-amber-400/[0.02]" : ""}`}>
                            <td className="px-6 py-4"><StatusBadge status={appt.status} /></td>
                            <td className="px-6 py-4">
                              <p className="font-medium">{appt.firstName} {appt.lastName}</p>
                              <p className="text-xs text-white/40">{appt.email}</p>
                              {appt.phone && <p className="text-xs text-white/30">{appt.phone}</p>}
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-white/80">{formatDate(appt.preferredDate)}</p>
                              <p className="text-xs text-amber-400/70">{appt.preferredTime}</p>
                            </td>
                            <td className="px-6 py-4 text-xs text-white/60">{appt.interestCollections || "—"}</td>
                            <td className="px-6 py-4 max-w-xs">
                              <p className="text-xs text-white/40 truncate" title={appt.notes}>{appt.notes || "—"}</p>
                            </td>
                            <td className="px-6 py-4 text-white/40 text-xs whitespace-nowrap">{formatDate(appt.createdAt)}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {appt.status === "PENDING" && (
                                  <>
                                    <button onClick={() => handleAppointmentAction(appt.id, "confirm")}
                                      className="px-3 py-1.5 text-[10px] tracking-wider uppercase bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-sm transition-colors">
                                      Confirm
                                    </button>
                                    <button onClick={() => handleAppointmentAction(appt.id, "cancel")}
                                      className="px-3 py-1.5 text-[10px] tracking-wider uppercase bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-sm transition-colors">
                                      Cancel
                                    </button>
                                  </>
                                )}
                                {appt.status === "CONFIRMED" && (
                                  <button onClick={() => handleAppointmentAction(appt.id, "complete")}
                                    className="px-3 py-1.5 text-[10px] tracking-wider uppercase bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-sm transition-colors">
                                    Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── ORDERS ────────────────────────────────────── */}
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-light tracking-wider">Order History
                    <span className="ml-3 text-xs text-white/30">({orders.length} orders · ${totalRevenue.toLocaleString()} revenue)</span>
                  </h2>
                </div>
                <div className="bg-white/[0.03] border border-white/10 overflow-hidden text-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/[0.02]">
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Status</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Order ID</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Customer</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Shipping</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Items</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Total</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Payment</th>
                          <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest text-white/40 font-medium">Date</th>
                          <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-white/40 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length === 0 && <EmptyState icon={ShoppingBag} message="No orders placed yet." />}
                        {orders.map(order => (
                          <tr
                            key={order.id}
                            onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                            className="border-b border-white/[0.06] hover:bg-white/[0.04] transition-colors cursor-pointer"
                          >
                            <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                            <td className="px-6 py-4 font-mono text-xs text-amber-400">#LUXE-{order.id}</td>
                            <td className="px-6 py-4 font-medium">{order.firstName} {order.lastName}</td>
                            <td className="px-6 py-4 text-xs text-white/50">{order.city}, {order.address.slice(0, 15)}...</td>
                            <td className="px-6 py-4 text-xs text-white/60">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? "s" : ""}</td>
                            <td className="px-6 py-4 text-amber-400 font-medium">${order.totalAmount?.toLocaleString()}</td>
                            <td className="px-6 py-4 text-xs text-white/50 italic">{order.paymentMethod}</td>
                            <td className="px-6 py-4 text-xs text-white/40 whitespace-nowrap">
                              {(() => { const dt = formatDateTime(order.createdAt); return (<><p>{dt.date}</p><p className="text-white/25">{dt.time}</p></>); })()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                {order.status === "PAID" && (
                                  <button onClick={(e) => { e.stopPropagation(); handleOrderAction(order.id, "SHIPPED"); }}
                                    className="px-3 py-1.5 text-[10px] tracking-wider uppercase bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-sm transition-colors">
                                    Ship
                                  </button>
                                )}
                                {order.status === "SHIPPED" && (
                                  <button onClick={(e) => { e.stopPropagation(); handleOrderAction(order.id, "DELIVERED"); }}
                                    className="px-3 py-1.5 text-[10px] tracking-wider uppercase bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-sm transition-colors">
                                    Deliver
                                  </button>
                                )}
                                {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                                  <button onClick={(e) => { e.stopPropagation(); if(confirm("Cancel order?")) handleOrderAction(order.id, "CANCELLED"); }}
                                    className="px-3 py-1.5 text-[10px] tracking-wider uppercase bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-sm transition-colors">
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-light tracking-wider text-white">Business Intelligence</h2>
                </div>

                {!analyticsData ? (
                  <div className="py-20 text-center bg-white/[0.03] border border-white/10">
                    <TrendingUp className="w-10 h-10 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">Processing engine data...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Revenue Chart */}
                      <div className="bg-white/[0.03] border border-white/10 p-8 rounded-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-medium tracking-[0.2em]">Revenue Trajectory (USD)</h3>
                          <div className="text-right">
                            <p className="text-2xl font-light text-amber-400">${analyticsData.totalRevenue?.toLocaleString()}</p>
                            <p className="text-[8px] uppercase tracking-widest text-white/30">Total Gross Income</p>
                          </div>
                        </div>
                        <div className="h-[300px] w-full mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analyticsData.revenueChart}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                              <XAxis 
                                dataKey="date" 
                                stroke="rgba(255,255,255,0.3)" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                                tickFormatter={(str) => {
                                  const d = new Date(str);
                                  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
                                }}
                              />
                              <YAxis 
                                stroke="rgba(255,255,255,0.3)" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                                tickFormatter={(val) => `$${val}`}
                              />
                              <Tooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
                                itemStyle={{ color: '#fbbf24', fontSize: '10px' }}
                                labelStyle={{ color: '#fff', fontSize: '10px', marginBottom: '4px' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#fbbf24" 
                                strokeWidth={2} 
                                dot={{ fill: '#fbbf24', strokeWidth: 0, r: 3 }}
                                activeDot={{ r: 5, strokeWidth: 0, fill: '#fff' }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Best Sellers Chart */}
                      <div className="bg-white/[0.03] border border-white/10 p-8 rounded-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                          <h3 className="text-[10px] uppercase tracking-widest text-white/60 font-medium tracking-[0.2em]">Top Velocity Assets</h3>
                          <div className="text-right">
                            <p className="text-2xl font-light text-amber-400">{analyticsData.totalOrders || 0}</p>
                            <p className="text-[8px] uppercase tracking-widest text-white/30">Volume Transacted</p>
                          </div>
                        </div>
                        <div className="h-[300px] w-full mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.bestSellers} layout="vertical" margin={{ left: 10 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                              <XAxis type="number" hide />
                              <YAxis 
                                dataKey="name" 
                                type="category" 
                                stroke="rgba(255,255,255,0.3)" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                                width={120}
                              />
                              <Tooltip 
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}
                                itemStyle={{ color: '#fbbf24', fontSize: '10px' }}
                                labelStyle={{ color: '#fff', fontSize: '10px', marginBottom: '4px' }}
                              />
                              <Bar dataKey="sales" fill="#fbbf24" radius={[0, 4, 4, 0]} barSize={20}>
                                {analyticsData.bestSellers && analyticsData.bestSellers.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={index === 0 ? '#fbbf24' : '#fbbf2480'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-white/[0.03] border border-white/10 p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[8px] uppercase tracking-widest text-white/40 mb-2 font-bold">Average Transaction Value</p>
                            <p className="text-xl font-light">
                            ${analyticsData.totalOrders > 0 
                                ? (analyticsData.totalRevenue / analyticsData.totalOrders).toLocaleString(undefined, { maximumFractionDigits: 0 }) 
                                : '0'}
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-white/5" />
                      </div>
                      <div className="bg-white/[0.03] border border-white/10 p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[8px] uppercase tracking-widest text-white/40 mb-2 font-bold">Best Selling Product</p>
                            <p className="text-xl font-light truncate max-w-[180px]">
                            {analyticsData.bestSellers?.[0]?.name || "N/A"}
                            </p>
                        </div>
                        <ShoppingBag className="w-8 h-8 text-white/5" />
                      </div>
                      <div className="bg-white/[0.03] border border-white/10 p-6 flex items-center justify-between">
                        <div>
                            <p className="text-[8px] uppercase tracking-widest text-white/40 mb-2 font-bold">Data Integrity</p>
                            <p className="text-lg font-light text-emerald-400 flex items-center gap-2 tracking-widest uppercase">
                            <CheckCircle className="w-4 h-4" /> Synchronized
                            </p>
                        </div>
                        <RefreshCw className="w-8 h-8 text-white/5" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* collections Tab */}
            {activeTab === "collections" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-light tracking-widest uppercase">Manage Collections</h2>
                </div>

                {/* Add Collection Form */}
                <div className="bg-white/[0.03] border border-white/10 p-8 rounded-sm mb-12">
                  <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-6 font-bold">Add New Collection</h3>
                  <form onSubmit={addCollection} className="flex gap-4">
                    <input
                      type="text"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      placeholder="Collection Name (e.g. Travel, Accessories)"
                      className="flex-1 bg-white/5 border border-white/10 px-5 py-3 text-white focus:border-amber-400 focus:outline-none transition-all placeholder:text-white/10 text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-amber-400 text-black px-8 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-white transition-all"
                    >
                      Add Collection
                    </button>
                  </form>
                </div>

                {/* Collections Table */}
                <div className="bg-white/[0.03] border border-white/10 rounded-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold">Collection Name</th>
                        <th className="px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collections.length === 0 ? (
                        <EmptyState icon={LayoutDashboard} message="No collections found. Start by adding one above." />
                      ) : (
                        collections.map((collection) => (
                          <tr key={collection.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                              {editingCollection?.id === collection.id ? (
                                <input
                                  type="text"
                                  value={editCollectionName}
                                  onChange={(e) => setEditCollectionName(e.target.value)}
                                  className="bg-white/5 border border-amber-400/50 px-3 py-1 text-white focus:outline-none text-sm w-full max-w-xs"
                                  autoFocus
                                />
                              ) : (
                                <span className="text-sm font-light tracking-wide">{collection.name}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-3">
                                {editingCollection?.id === collection.id ? (
                                  <>
                                    <button
                                      onClick={() => updateCollection(collection.id)}
                                      className="text-[10px] uppercase tracking-widest text-emerald-400 hover:text-white transition-colors"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingCollection(null)}
                                      className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        setEditingCollection(collection);
                                        setEditCollectionName(collection.name);
                                      }}
                                      className="text-white/20 hover:text-amber-400 transition-colors"
                                      title="Edit Collection"
                                    >
                                      <RefreshCw className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteCollection(collection.id)}
                                      className="text-white/20 hover:text-red-400 transition-colors"
                                      title="Delete Collection"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── ASSET MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsProductModalOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-4xl bg-[#0f0f0f] border border-white/10 shadow-2xl rounded-sm overflow-hidden"
            >
              <div className="h-1.5 bg-amber-400" />
              <div className="p-10">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h3 className="text-3xl font-light text-white mb-2">
                      {editingProduct ? "Refine Portfolio Asset" : "Register New Acquisition"}
                    </h3>
                    <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase font-bold">Artisanal Specification Portal</p>
                  </div>
                  <button onClick={() => setIsProductModalOpen(false)} className="text-white/30 hover:text-white transition-colors">
                    <X className="w-7 h-7" />
                  </button>
                </div>

                <form onSubmit={saveProduct} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-bold">Label Name</label>
                        <input required type="text" value={productForm.name}
                          onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-5 py-4 text-white focus:border-amber-400 focus:outline-none transition-all placeholder:text-white/10 text-sm"
                          placeholder="e.g. Silk-Lined Midnight Clutch"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-bold">Value (USD)</label>
                          <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 text-sm">$</span>
                            <input required type="number" value={productForm.price || ''}
                                onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) })}
                                className="w-full bg-white/5 border border-white/10 pl-10 pr-5 py-4 text-white focus:border-amber-400 focus:outline-none transition-all placeholder:text-white/10 text-sm"
                                placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-bold">Collection</label>
                          <select value={productForm.collections}
                              onChange={e => setProductForm({ ...productForm, collections: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 px-5 py-4 text-white focus:border-amber-400 focus:outline-none transition-all appearance-none cursor-pointer text-sm"
                          >
                              {collections.length > 0 ? (
                                collections.map(coll => (
                                  <option key={coll.id} value={coll.name} className="bg-[#111]">{coll.name}</option>
                                ))
                              ) : (
                                <option value="" className="bg-[#111]">No Collections Available</option>
                              )}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-bold">Product Visual <span className="text-[8px] opacity-40 italic">(Link or Upload)</span></label>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input required type="text" value={productForm.image}
                                    onChange={e => setProductForm({ ...productForm, image: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 px-5 py-4 text-white focus:border-amber-400 focus:outline-none transition-all placeholder:text-white/10 text-xs"
                                    placeholder="Image URL..."
                                />
                            </div>
                            <label className="flex items-center justify-center px-6 border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group">
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                {isUploading ? (
                                    <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />
                                ) : (
                                    <div className="flex flex-col items-center gap-1">
                                        <Upload className="w-4 h-4 text-white/40 group-hover:text-amber-400 transition-colors" />
                                        <span className="text-[8px] uppercase tracking-widest text-white/40">Upload</span>
                                    </div>
                                )}
                            </label>
                        </div>
                        {productForm.image && (
                            <div className="mt-4 p-2 bg-black border border-white/5 inline-block group relative">
                                <img src={productForm.image} className="h-24 w-24 object-cover" alt="Preview" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-[8px] uppercase tracking-widest text-white font-bold">Preview</p>
                                </div>
                            </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-bold">Available Palettes <span className="text-[8px] opacity-40 italic">(CSV)</span></label>
                        <input type="text" value={productForm.colors} placeholder="Ruby Suede, Gold Silk"
                          onChange={e => setProductForm({ ...productForm, colors: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-5 py-4 text-white focus:border-amber-400 focus:outline-none transition-all placeholder:text-white/10 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-bold">Artisanal Narrative</label>
                        <textarea required rows={6} value={productForm.description}
                          onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-5 py-5 text-white focus:border-amber-400 focus:outline-none transition-all resize-none placeholder:text-white/10 text-sm leading-relaxed"
                          placeholder="Provide the background and craftsmanship details..."
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3 font-bold">Technical Specifications <span className="text-[8px] opacity-40 italic">(Piped)</span></label>
                        <textarea rows={6} value={productForm.details} placeholder="Premium Calfskin | 24k Gold Hardware | Suede Interior"
                          onChange={e => setProductForm({ ...productForm, details: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 px-5 py-5 text-white focus:border-amber-400 focus:outline-none transition-all resize-none placeholder:text-white/10 text-sm leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-6 mt-12 border-t border-white/10 pt-10">
                    <button
                      type="button"
                      onClick={() => setIsProductModalOpen(false)}
                      className="px-10 py-4 text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-white transition-colors"
                    >
                      ABORT
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProduct}
                      className="bg-amber-400 text-black px-16 py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-white transition-all disabled:opacity-50 shadow-xl shadow-amber-400/5 group"
                    >
                      {isSavingProduct ? "EXECUTING..." : (editingProduct ? "UPDATE ARCHIVE" : "REGISTER ASSET")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reply Modal */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-zinc-900 border border-white/10 p-8 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-light tracking-wider flex items-center gap-2">
                  <Reply className="w-4 h-4 text-amber-400" />
                  Compose Reply
                </h3>
                <button onClick={() => { setReplyingTo(null); setReplyText(""); }} className="text-white/30 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Show message context */}
              {(() => {
                const msg = contacts.find(c => c.id === replyingTo);
                return msg ? (
                  <div className="bg-white/5 border border-white/10 p-4 mb-6 text-xs text-white/50">
                    <p className="mb-1"><span className="text-white/30">From:</span> {msg.firstName} {msg.lastName} ({msg.email})</p>
                    <p><span className="text-white/30">Message:</span> {msg.message}</p>
                  </div>
                ) : null;
              })()}
              <form onSubmit={sendReply}>
                <textarea
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response to the customer here..."
                  className="w-full h-40 bg-black/50 border border-white/20 p-4 text-white text-sm focus:outline-none focus:border-amber-400 mb-6 resize-none transition-colors"
                  required
                  autoFocus
                />
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => { setReplyingTo(null); setReplyText(""); }}
                    className="px-6 py-2.5 text-sm text-white/50 hover:text-white border border-white/10 hover:border-white/20 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSendingReply || !replyText.trim()}
                    className="px-6 py-2.5 text-sm bg-amber-400 text-black hover:bg-amber-300 transition-colors disabled:opacity-50 font-medium">
                    {isSendingReply ? "Sending..." : "Send Reply"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirmId(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#1a1a1a] border border-white/10 p-10 max-w-sm w-full text-center rounded-sm shadow-2xl">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Trash2 className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-2xl font-light text-white mb-3">Delete Asset?</h3>
              <p className="text-white/40 text-sm mb-10 leading-relaxed font-light">This archival action is irreversible. The asset will be permanently expunged from the record.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-all font-bold">ABORT</button>
                <button onClick={() => deleteProduct(deleteConfirmId)} className="flex-1 bg-red-600 text-white px-6 py-4 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-red-500 transition-all shadow-lg shadow-red-600/10">CONFIRM</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
