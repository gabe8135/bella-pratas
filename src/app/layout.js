import Header from "./components/Header";
import Footer from "./components/Footer";
import localFont from "next/font/local";
import "./globals.css";
const outfit = localFont({
  src: "../../public/fonts/outfit-latin.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-outfit",
});
const cormorant = localFont({
  src: "../../public/fonts/cormorant-garamond-latin.woff2",
  weight: "300 700",
  display: "swap",
  variable: "--font-cormorant",
});
export const metadata = {
  title: "Bella Pratas | Detalhes que ficam",
  description: "Descubra joias cheias de significado na Bella Pratas. Encontre sua peça favorita e compre pelo WhatsApp.",
};
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.variable} ${cormorant.variable}`}>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
