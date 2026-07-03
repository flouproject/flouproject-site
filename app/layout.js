import "./globals.css";
import { CartProvider } from "../lib/CartContext";

export const metadata = {
  title: "Flou Project",
  description:
    "Flou Project — produk handmade dan workshop kriya untuk belajar membuat karya dengan tangan sendiri.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Poppins:wght@300;400;500;600;700;800&family=Fuzzy+Bubbles:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
