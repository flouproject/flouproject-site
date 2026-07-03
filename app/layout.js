import "./globals.css";
import { CartProvider } from "../lib/CartContext";

export const metadata = {
  title: "Nama Bisnis Kamu",
  description: "Produk handmade & workshop",
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
