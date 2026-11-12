import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { Collection } from "./pages/Collection";
import { ProductDetail } from "./pages/ProductDetail";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { NotFound } from "./pages/NotFound";
import { Cart } from "./pages/Cart";
import { Wishlist } from "./pages/Wishlist";
import { Admin } from "./pages/Admin";
import { Checkout } from "./pages/Checkout";
import { Shipping } from "./pages/Shipping";
import { CareGuide } from "./pages/CareGuide";
import { FAQ } from "./pages/FAQ";
import { Collections } from "./pages/Collections";
import { GiftCards } from "./pages/GiftCards";
import { NewArrivals } from "./pages/NewArrivals";
import { BestSellers } from "./pages/BestSellers";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "collection", Component: Collection },
      { path: "product/:id", Component: ProductDetail },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "cart", Component: Cart },
      { path: "wishlist", Component: Wishlist },
      { path: "admin", Component: Admin },
      { path: "checkout", Component: Checkout },
      { path: "shipping", Component: Shipping },
      { path: "care-guide", Component: CareGuide },
      { path: "faq", Component: FAQ },
      { path: "collections", Component: Collections },
      { path: "gift-cards", Component: GiftCards },
      { path: "new-arrivals", Component: NewArrivals },
      { path: "best-sellers", Component: BestSellers },
      { path: "*", Component: NotFound }
    ]
  }
]);
