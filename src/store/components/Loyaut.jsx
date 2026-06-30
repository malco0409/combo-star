// src/components/Layout.jsx
import ScrollToTop from "./ScrollToTop";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}