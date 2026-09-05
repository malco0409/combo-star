// App.jsx — yagona router: storefront ("/") + CRM ("/admin")
import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// ── Storefront ──
import Loading from "./store/components/Loading";
import Navbar from "./store/components/Navbar";
import Footer from "./store/components/Footer";
import ScrollToTop from "./store/components/ScrollToTop";
import Home from "./store/pages/home/home";
import About from "./store/pages/about/About";
import Catalog from "./store/pages/catalog/Catalog";
import Contact from "./store/pages/contact/Contact";
import ProductDetail from "./store/pages/products/ProductDetail";
import CartPage from "./store/pages/cart/CartPage";
import ProjectDetail from "./store/pages/project/ProjectDetail";
import MeasuringPage from "./store/pages/measuring/MeasuringPage";
import OrdersPage from "./store/pages/orders/OrdersPage";
import CollectionDetail from "./store/pages/colletion/CollectionDetail";
import NotFound from "./store/pages/NotFound";

// ── CRM (admin) ──
// Alohida bo'lakka ajratilgan: sayt mijozlari CRM kodini yuklab olmaydi.
const AdminApp = lazy(() => import("./admin/AdminApp"));

function StoreLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default function App() {
  // Loading ekranini faqat saytda va sessiyada bir marta ko'rsatamiz (CRM'da emas)
  const [loaded, setLoaded] = useState(() => {
    const isAdmin = window.location.pathname.startsWith("/admin");
    const seen = sessionStorage.getItem("introSeen");
    return isAdmin || seen === "1";
  });

  const finishLoading = () => {
    sessionStorage.setItem("introSeen", "1");
    setLoaded(true);
  };

  return (
    <BrowserRouter>
      {!loaded && <Loading onDone={finishLoading} />}
      <Routes>
        {/* Storefront */}
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/project" element={<ProjectDetail />} />
          <Route path="/measuring" element={<MeasuringPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/collection" element={<CollectionDetail />} />
          {/* Noma'lum manzil — bo'sh sahifa o'rniga 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* CRM — alohida login bilan */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div style={{ minHeight: "100vh", background: "#0f1117" }} />}>
              <AdminApp />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
