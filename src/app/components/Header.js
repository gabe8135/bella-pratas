"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/solid";

const LOGO_URL =
  "https://vjjcrivjvwaqjvmbfueq.supabase.co/storage/v1/object/public/produtos/Imagens-do-site/logo.webp";

export default function Header() {
  const [autenticado, setAutenticado] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function verificarLogin() {
      const { data } = await supabase.auth.getUser();
      if (ativo) {
        setAutenticado(!!data?.user);
      }
    }

    verificarLogin();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (ativo) {
          setAutenticado(!!session?.user);
        }
      },
    );

    return () => {
      ativo = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  function handleAdminClick() {
    if (autenticado) {
      window.location.href = "/pagina-administrativa";
    } else {
      window.location.href = "/login";
    }
  }

  function fecharMenu() {
    setMenuAberto(false);
  }

  const navItems = [
    { href: "/#inicio", label: "Inicio" },
    { href: "/#destaques", label: "Destaques" },
    { href: "/#catalogo", label: "Catalogo" },
    { href: "/#contato", label: "Contato" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[#d8cab8]/70 bg-[#f8f3eb]/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-2 sm:px-6">
        <div className="transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01]">
          <Link
            href="/"
            onClick={fecharMenu}
            className="relative flex items-center"
          >
            <span className="absolute -inset-y-1 inset-x-0 rounded-[1.35rem] bg-gradient-to-br from-[#c59d6e]/50 via-[#7e3147]/24 to-[#2f2119]/40 blur-sm" />
            <span className="relative inline-flex items-center rounded-[1.25rem] border border-[#caa880]/60 bg-[#281d17]/82 px-4 py-[0.62rem] shadow-[0_12px_30px_rgba(34,18,10,0.26)]">
              <Image
                src={LOGO_URL}
                alt="Bella Pratas"
                width={220}
                height={70}
                priority
                sizes="(max-width: 640px) 160px, 220px"
                quality={60}
                className="h-9 w-auto sm:h-10"
              />
            </span>
          </Link>
        </div>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <div
              key={item.href}
              className="transition-transform duration-200 hover:-translate-y-0.5"
            >
              <Link
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#4a3931] hover:bg-[#e9ddcd]/80"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

        <button
          onClick={handleAdminClick}
          className="hidden items-center gap-2 rounded-full border border-[#a47d4c]/50 bg-[#251b16] px-4 py-2 text-sm font-medium text-[#f8efe2] transition hover:bg-[#1a120f] md:inline-flex"
          aria-label="Acesso Administrativo"
          title="Acesso do dono do catalogo"
        >
          <UserIcon className="h-4 w-4" />
          {autenticado ? "Painel do dono" : "Acesso do dono"}
        </button>

        <button
          type="button"
          className="ml-auto inline-flex rounded-full border border-[#bca387]/70 bg-white/70 p-2 text-[#46342b] md:hidden"
          onClick={() => setMenuAberto((prev) => !prev)}
          aria-expanded={menuAberto}
          aria-label="Abrir menu"
        >
          {menuAberto ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {menuAberto && (
        <div className="overflow-hidden border-t border-[#d8cab8]/70 bg-[#fbf7f1]/95 px-4 md:hidden">
          <nav className="mx-auto flex w-full max-w-7xl flex-col gap-2 pb-4 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={fecharMenu}
                className="rounded-xl px-4 py-3 text-sm font-medium text-[#4a3931] hover:bg-[#efe4d5]"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleAdminClick}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#251b16] px-4 py-3 text-sm font-semibold text-[#f8efe2]"
            >
              <UserIcon className="h-4 w-4" />
              {autenticado ? "Abrir painel do dono" : "Entrar como dono"}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
