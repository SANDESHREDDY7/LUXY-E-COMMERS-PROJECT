import { products as staticProducts, Product } from "../app/data/products";

const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '');
export const API_BASE_URL = `${rawBaseUrl}/api`;

export function getSessionId(): string {
  let id = localStorage.getItem('luxe_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('luxe_session_id', id);
  }
  return id;
}

const DEMO_CART_KEY = 'luxe_demo_cart';
const DEMO_WISHLIST_KEY = 'luxe_demo_wishlist';

function getDemoCart() {
  try {
    const raw = localStorage.getItem(DEMO_CART_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { items: [], totalAmount: 0 };
}

function saveDemoCart(cart: { items: any[]; totalAmount: number }) {
  cart.totalAmount = cart.items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  localStorage.setItem(DEMO_CART_KEY, JSON.stringify(cart));
  return cart;
}

function getDemoWishlist(): number[] {
  try {
    const raw = localStorage.getItem(DEMO_WISHLIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

function saveDemoWishlist(ids: number[]) {
  localStorage.setItem(DEMO_WISHLIST_KEY, JSON.stringify(ids));
}

function handleStaticFallback(endpoint: string, options: RequestInit = {}): any {
  const method = (options.method || 'GET').toUpperCase();
  const path = endpoint.split('?')[0];
  const body = options.body ? JSON.parse(String(options.body)) : {};

  if (method === 'GET' && path === '/products') {
    return staticProducts;
  }

  const productMatch = path.match(/^\/products\/(\d+)$/);
  if (method === 'GET' && productMatch) {
    const id = Number(productMatch[1]);
    return staticProducts.find((p: Product) => p.id === id) || null;
  }

  if (method === 'GET' && path === '/collections') {
    const unique = Array.from(new Set(staticProducts.map((p) => p.collections)));
    return unique.map((name, idx) => ({ id: idx + 1, name }));
  }

  if (method === 'GET' && path.startsWith('/reviews/product/')) {
    return [];
  }

  // Demo Cart fallback
  if (path === '/cart' && method === 'GET') {
    return getDemoCart();
  }
  if (path === '/cart/add' && method === 'POST') {
    const cart = getDemoCart();
    const product = staticProducts.find((p) => p.id === Number(body.productId));
    if (product) {
      const existing = cart.items.find(
        (i: any) => i.product?.id === product.id && i.selectedColor === body.selectedColor
      );
      if (existing) {
        existing.quantity += body.quantity || 1;
      } else {
        cart.items.push({
          id: Date.now(),
          product,
          quantity: body.quantity || 1,
          selectedColor: body.selectedColor || (Array.isArray(product.colors) ? product.colors[0] : 'Default'),
        });
      }
    }
    return saveDemoCart(cart);
  }
  const cartItemMatch = path.match(/^\/cart\/item\/(\d+)$/);
  if (cartItemMatch) {
    const itemId = Number(cartItemMatch[1]);
    const cart = getDemoCart();
    if (method === 'PUT') {
      const item = cart.items.find((i: any) => i.id === itemId);
      if (item) item.quantity = body.quantity;
    } else if (method === 'DELETE') {
      cart.items = cart.items.filter((i: any) => i.id !== itemId);
    }
    return saveDemoCart(cart);
  }
  if (path === '/cart/clear' && method === 'DELETE') {
    return saveDemoCart({ items: [], totalAmount: 0 });
  }

  // Demo Wishlist fallback
  if (path === '/wishlist' && method === 'GET') {
    const ids = getDemoWishlist();
    return {
      items: ids
        .map((id) => staticProducts.find((p) => p.id === id))
        .filter(Boolean)
        .map((product) => ({ product })),
    };
  }
  const wishlistCheckMatch = path.match(/^\/wishlist\/check\/(\d+)$/);
  if (wishlistCheckMatch && method === 'GET') {
    const id = Number(wishlistCheckMatch[1]);
    return { wishlisted: getDemoWishlist().includes(id) };
  }
  if (path === '/wishlist/toggle' && method === 'POST') {
    const id = Number(body.productId);
    const ids = getDemoWishlist();
    const exists = ids.includes(id);
    const next = exists ? ids.filter((x) => x !== id) : [...ids, id];
    saveDemoWishlist(next);
    return { wishlisted: !exists };
  }
  const wishlistRemoveMatch = path.match(/^\/wishlist\/remove\/(\d+)$/);
  if (wishlistRemoveMatch && method === 'DELETE') {
    const id = Number(wishlistRemoveMatch[1]);
    saveDemoWishlist(getDemoWishlist().filter((x) => x !== id));
    return { success: true };
  }

  return undefined;
}

/**
 * Standard fetch wrapper that handles JSON and falls back to static demo data
 * when no backend server is reachable (e.g. static Netlify preview without VITE_API_BASE_URL).
 */
export async function fetchApi(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, { ...options, headers });
    const contentType = response.headers.get('content-type') || '';

    // On static hosts with SPA fallback, /api/* returns text/html (index.html)
    if (!response.ok || !contentType.includes('application/json')) {
      if (response.status === 204) return null;
      const fallback = handleStaticFallback(endpoint, options);
      if (fallback !== undefined) return fallback;

      let errorMessage = 'An error occurred while fetching the data.';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (err) {
    const fallback = handleStaticFallback(endpoint, options);
    if (fallback !== undefined) return fallback;
    throw err;
  }
}
