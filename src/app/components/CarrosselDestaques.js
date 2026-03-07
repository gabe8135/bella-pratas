"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function CarrosselDestaques({
  destaques: destaquesRecebidos = [],
}) {
  const [destaques, setDestaques] = useState(destaquesRecebidos);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    setDestaques(destaquesRecebidos);
  }, [destaquesRecebidos]);

  useEffect(() => {
    if (destaquesRecebidos.length > 0) {
      return;
    }

    async function fetchDestaques() {
      const { data } = await supabase
        .from("produtos")
        .select("*, categorias(nome)")
        .eq("destaque", true)
        .eq("disponivel", true)
        .order("id", { ascending: false });
      setDestaques(data || []);
    }

    fetchDestaques();
  }, [destaquesRecebidos.length]);

  function handlePointerDown(e) {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    setIsDragging(true);
    setStartX(e.type === "touchstart" ? e.touches[0].pageX : e.pageX);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = "grabbing";
    container.style.scrollBehavior = "auto";
  }

  function handlePointerMove(e) {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (!isDragging) return;

    const x = e.type === "touchmove" ? e.touches[0].pageX : e.pageX;
    const walk = startX - x;
    container.scrollLeft = scrollLeft + walk;
  }

  function handlePointerUp() {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    setIsDragging(false);
    container.style.cursor = "grab";
    container.style.scrollBehavior = "smooth";
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container || destaques.length <= 1) {
      return undefined;
    }

    let frame;
    const speed = 0.45;

    function animate() {
      if (!isDragging) {
        container.scrollLeft += speed;

        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }

      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [isDragging, destaques]);

  function scrollToProduto(id) {
    const el = document.getElementById(`produto-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  if (destaques.length === 0) {
    return (
      <div className="luxury-surface rounded-[1.6rem] p-6 text-sm text-[#5f4a3f]">
        Nenhum produto em destaque no momento.
      </div>
    );
  }

  const cards = destaques.length > 1 ? [...destaques, ...destaques] : destaques;

  return (
    <motion.section
      className="mb-3"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={containerRef}
        className="scrollbar-hide overflow-x-auto pb-3 pt-1 select-none"
        style={{
          minHeight: 290,
          WebkitOverflowScrolling: "touch",
          cursor: "grab",
        }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <div
          className="flex gap-4"
          style={{
            width: `${cards.length * 258}px`,
          }}
        >
          {cards.map((produto, idx) => (
            <motion.div
              key={produto.id + "-" + idx}
              className="group relative flex h-64 min-w-[244px] cursor-pointer items-end overflow-hidden rounded-[1.4rem] border border-[#d8cab8] bg-[#201711] shadow-[0_10px_28px_rgba(33,19,12,0.2)] transition hover:-translate-y-0.5"
              onClick={() => scrollToProduto(produto.id)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.32, delay: (idx % 6) * 0.045 }}
              whileHover={{
                y: -7,
                scale: 1.02,
                boxShadow: "0 20px 44px rgba(18,10,6,0.35)",
              }}
              whileTap={{ scale: 0.985 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={produto.imagem_url}
                alt={produto.nome}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                <span className="luxury-soft-shimmer absolute inset-y-0 -left-1/2 w-1/2" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#150e0b] via-[#150e0b]/35 to-transparent" />

              <div className="relative w-full p-4 text-[#f8efe2]">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-[#dec9ad]">
                  {produto.categorias?.nome || "Destaque"}
                </p>
                <h3 className="luxury-title text-3xl font-semibold leading-[0.95]">
                  {produto.nome}
                </h3>
                <p className="mt-2 text-sm font-semibold text-[#f4e3cf]">
                  R$ {produto.preco}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
