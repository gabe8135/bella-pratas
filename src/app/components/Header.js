"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Bars3Icon, UserIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";

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
    <motion.header
      className="sticky top-0 z-50 border-b border-[#d8cab8]/70 bg-[#f8f3eb]/85 backdrop-blur-xl"
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-2 sm:px-6">
        <motion.div
          whileHover={{ y: -2, scale: 1.01 }}
          transition={{ duration: 0.22 }}
        >
          <Link
            href="/"
            onClick={fecharMenu}
            className="relative flex items-center"
          >
            <span className="absolute -inset-y-1 inset-x-0 rounded-[1.35rem] bg-gradient-to-br from-[#c59d6e]/50 via-[#7e3147]/24 to-[#2f2119]/40 blur-sm" />
            <span className="relative inline-flex items-center rounded-[1.25rem] border border-[#caa880]/60 bg-[#281d17]/82 px-4 py-[0.62rem] shadow-[0_12px_30px_rgba(34,18,10,0.26)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={LOGO_URL}
                alt="Bella Pratas"
                className="h-9 w-auto sm:h-10"
              />
            </span>
          </Link>
        </motion.div>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.32,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -2 }}
            >
              <Link
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#4a3931] hover:bg-[#e9ddcd]/80"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <motion.button
          onClick={handleAdminClick}
          className="hidden items-center gap-2 rounded-full border border-[#a47d4c]/50 bg-[#251b16] px-4 py-2 text-sm font-medium text-[#f8efe2] transition hover:bg-[#1a120f] md:inline-flex"
          aria-label="Acesso Administrativo"
          title="Acesso do dono do catalogo"
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.2 }}
        >
          <UserIcon className="h-4 w-4" />
          {autenticado ? "Painel do dono" : "Acesso do dono"}
        </motion.button>

        <motion.button
          type="button"
          className="ml-auto inline-flex rounded-full border border-[#bca387]/70 bg-white/70 p-2 text-[#46342b] md:hidden"
          onClick={() => setMenuAberto((prev) => !prev)}
          aria-expanded={menuAberto}
          aria-label="Abrir menu"
          whileTap={{ scale: 0.94 }}
        >
          {menuAberto ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {menuAberto && (
          <motion.div
            className="overflow-hidden border-t border-[#d8cab8]/70 bg-[#fbf7f1]/95 px-4 md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="mx-auto flex w-full max-w-7xl flex-col gap-2 pb-4 pt-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={fecharMenu}
                    className="rounded-xl px-4 py-3 text-sm font-medium text-[#4a3931] hover:bg-[#efe4d5]"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                type="button"
                onClick={handleAdminClick}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#251b16] px-4 py-3 text-sm font-semibold text-[#f8efe2]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2, delay: 0.08 }}
              >
                <UserIcon className="h-4 w-4" />
                {autenticado ? "Abrir painel do dono" : "Entrar como dono"}
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
