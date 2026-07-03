import "./globals.css";
import { CartProvider } from "../lib/CartContext";

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
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
