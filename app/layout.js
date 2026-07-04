import "./globals.css";
import { CartProvider } from "../lib/CartContext";
import Footer from "../components/Footer";

export const metadata = {
  title: "Flou Project",
  description:
    "Flou Project — kriya campuran (rajut, flanel, keramik, dan lainnya) buatan tangan, berbasis di Cianjur.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {/* Background langit — berlaku di semua halaman */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "url('/images/bg-langit.jpg') center/cover no-repeat",
            zIndex: -1,
          }}
        />
        <CartProvider>
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
