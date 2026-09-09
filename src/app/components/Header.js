"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import GlareButton from "@/components/GlareButton";
export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="announcement">
        PRATA, AFETO E HISTÓRIAS PARA LEVAR COM VOCÊ <span>✦</span>
      </div>
      <header className="header">
        <Link href="/" aria-label="Bella Pratas — início" className="brand">
          <Image
            src="/Imagens-do-site/logo.webp"
            alt="Bella Pratas"
            width={160}
            height={51}
            priority
          />
        </Link>
        <nav aria-label="Navegação principal" className="desktop-nav">
          <Link href="/#colecao">Coleção</Link>
          <Link href="/#essencia">Nossa essência</Link>
          <Link href="/#cuidado">Cuide da sua prata</Link>
        </nav>
        <GlareButton as={Link} href="/#colecao" className="header-cta">
          Encontre sua joia <ArrowUpRight size={16} />
        </GlareButton>
        <GlareButton
          className="menu-toggle icon-button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </GlareButton>
        {open && (
          <nav id="mobile-nav" className="mobile-nav" aria-label="Navegação móvel">
            {[
              ["Coleção", "colecao"],
              ["Nossa essência", "essencia"],
              ["Cuide da sua prata", "cuidado"],
            ].map(([label, id]) => (
              <Link key={id} href={`/#${id}`} onClick={() => setOpen(false)}>
                {label}
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
