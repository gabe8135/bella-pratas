"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const LOGO_URL =
  "https://vjjcrivjvwaqjvmbfueq.supabase.co/storage/v1/object/public/produtos/Imagens-do-site/logo.webp";

export default function Footer() {
  return (
    <motion.footer
      id="contato"
      className="mt-20 border-t border-[#d7c8b6] bg-[#1f1714] text-[#f7efe3]"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.24 }}
          transition={{ duration: 0.45, delay: 0.04 }}
        >
          <Link href="/#inicio" className="inline-flex">
            <motion.img
              src={LOGO_URL}
              alt="Bella Pratas"
              className="h-14 w-auto"
              whileHover={{ y: -2, scale: 1.03 }}
              transition={{ duration: 0.2 }}
            />
          </Link>
          <p className="mt-3 max-w-sm text-sm text-[#d8c7b2]">
            Curadoria de pecas em prata para quem busca brilho, estilo e compra
            com atendimento rapido.
          </p>
        </motion.div>

        <motion.div
          className="sm:text-right"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.24 }}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          <motion.a
            href="https://wa.me/5513997033980"
            target="_blank"
            rel="noopener"
            className="inline-flex rounded-full border border-[#b18a5b] bg-[#2a1f1a] px-5 py-2 text-sm font-medium text-[#f7efe3] hover:bg-[#382922]"
            whileHover={{ y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            Fale no WhatsApp
          </motion.a>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#d8c7b2] sm:justify-end">
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/#inicio" className="hover:text-white">
                Inicio
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/#destaques" className="hover:text-white">
                Destaques
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }}>
              <Link href="/#catalogo" className="hover:text-white">
                Catalogo
              </Link>
            </motion.div>
            <motion.a
              href="https://instagram.com/bellapratas.br"
              target="_blank"
              rel="noopener"
              className="hover:text-white"
              whileHover={{ y: -2 }}
            >
              Instagram
            </motion.a>
          </div>
        </motion.div>
      </div>

      <div className="border-t border-[#3c3028] px-4 py-4 text-center text-xs text-[#baa892]">
        Bella Pratas © {new Date().getFullYear()} - Todos os direitos
        reservados.
      </div>
    </motion.footer>
  );
}
