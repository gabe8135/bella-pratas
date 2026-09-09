import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <Image src="/Imagens-do-site/logo.webp" alt="Bella Pratas" width={210} height={67} />
          <p>
            Detalhes que ficam.
            <br />
            Histórias que brilham.
          </p>
        </div>
        <div className="footer-links">
          <Link href="/#colecao">
            Explore a coleção <ArrowUpRight size={16} />
          </Link>
          <Link href="/#essencia">
            Nossa essência <ArrowUpRight size={16} />
          </Link>
          <Link href="/#cuidado">
            Cuidados com a prata <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Bella Pratas</span>
        <span>Detalhes que ficam. Histórias que brilham.</span>
        <Link href="#inicio">Voltar ao topo ↑</Link>
      </div>
    </footer>
  );
}
