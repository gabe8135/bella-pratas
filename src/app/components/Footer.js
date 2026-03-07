import Link from "next/link";
import Image from "next/image";

const LOGO_URL =
  "https://vjjcrivjvwaqjvmbfueq.supabase.co/storage/v1/object/public/produtos/Imagens-do-site/logo.webp";

export default function Footer() {
  return (
    <footer
      id="contato"
      className="mt-20 border-t border-[#d7c8b6] bg-[#1f1714] text-[#f7efe3]"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6">
        <div>
          <Link href="/#inicio" className="inline-flex">
            <Image
              src={LOGO_URL}
              alt="Bella Pratas"
              width={220}
              height={70}
              sizes="(max-width: 640px) 160px, 220px"
              quality={60}
              className="h-14 w-auto"
            />
          </Link>
          <p className="mt-3 max-w-sm text-sm text-[#d8c7b2]">
            Curadoria de pecas em prata para quem busca brilho, estilo e compra
            com atendimento rapido.
          </p>
        </div>

        <div className="sm:text-right">
          <a
            href="https://wa.me/5513997033980"
            target="_blank"
            rel="noopener"
            className="inline-flex rounded-full border border-[#b18a5b] bg-[#2a1f1a] px-5 py-2 text-sm font-medium text-[#f7efe3] hover:bg-[#382922]"
          >
            Fale no WhatsApp
          </a>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#d8c7b2] sm:justify-end">
            <Link href="/#inicio" className="hover:text-white">
              Inicio
            </Link>
            <Link href="/#destaques" className="hover:text-white">
              Destaques
            </Link>
            <Link href="/#catalogo" className="hover:text-white">
              Catalogo
            </Link>
            <a
              href="https://instagram.com/bellapratas.br"
              target="_blank"
              rel="noopener"
              className="hover:text-white"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#3c3028] px-4 py-4 text-center text-xs text-[#baa892]">
        Bella Pratas © {new Date().getFullYear()} - Todos os direitos
        reservados.
      </div>
    </footer>
  );
}
