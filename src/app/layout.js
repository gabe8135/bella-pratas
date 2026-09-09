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
// Set SITE_URL for a custom domain; supported hosts supply their production URL.
const siteUrl = process.env.SITE_URL || process.env.URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://bella-pratas.vercel.app');

export const metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Bella Pratas',
    title: 'Bella Pratas | Detalhes que ficam',
    description: 'Joias cheias de significado. Encontre sua próxima peça favorita na Bella Pratas.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bella Pratas | Detalhes que ficam',
    description: 'Joias cheias de significado. Encontre sua próxima peça favorita na Bella Pratas.',
    images: [{ url: '/opengraph-image', alt: 'Bella Pratas — Detalhes que ficam. Histórias que brilham.' }],
  },
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

