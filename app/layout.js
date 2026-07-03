import { CartProvider } from "../lib/CartContext";

export const metadata = {
  title: "Nama Bisnis Kamu",
  description: "Produk handmade & workshop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: "#f5f5f7",
          minHeight: "100vh",
        }}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
