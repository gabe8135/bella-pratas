"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function CarrosselDestaques({
  destaques: destaquesRecebidos = [],
}) {
  const [destaques, setDestaques] = useState(destaquesRecebidos);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [autoScrollAtivo, setAutoScrollAtivo] = useState(false);
  const [autoScrollVelocidade, setAutoScrollVelocidade] = useState(0.26);
  const [retomarAutoScrollMs, setRetomarAutoScrollMs] = useState(1100);
  const containerRef = useRef(null);
  const retomarAutoScrollRef = useRef(0);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      setAutoScrollAtivo(false);
      return undefined;
    }

    const motionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMedia = window.matchMedia("(min-width: 1024px)");
    const tabletMedia = window.matchMedia(
      "(min-width: 640px) and (max-width: 1023px)",
    );

    function atualizarAutoScroll() {
      // On browsers without prefers-reduced-motion support, `matches` stays false.
      const reduzirMovimento = motionMedia.matches;

      if (desktopMedia.matches) {
        setAutoScrollAtivo(!reduzirMovimento);
        setAutoScrollVelocidade(0.44);
        setRetomarAutoScrollMs(700);
        return;
      }

      if (tabletMedia.matches) {
        setAutoScrollAtivo(!reduzirMovimento);
        setAutoScrollVelocidade(0.32);
        setRetomarAutoScrollMs(900);
        return;
      }

      // Mobile: mais suave para nao competir com swipe/touch.
      setAutoScrollAtivo(!reduzirMovimento);
      setAutoScrollVelocidade(0.24);
      setRetomarAutoScrollMs(1200);
    }

    function registrarListener(mediaQueryList, callback) {
      if (typeof mediaQueryList.addEventListener === "function") {
        mediaQueryList.addEventListener("change", callback);
        return () => mediaQueryList.removeEventListener("change", callback);
      }

      // Safari iOS versions still expose addListener/removeListener.
      if (typeof mediaQueryList.addListener === "function") {
        mediaQueryList.addListener(callback);
        return () => mediaQueryList.removeListener(callback);
      }

      return () => {};
    }

    atualizarAutoScroll();

    const removerMotionListener = registrarListener(
      motionMedia,
      atualizarAutoScroll,
    );
    const removerDesktopListener = registrarListener(
      desktopMedia,
      atualizarAutoScroll,
    );
    const removerTabletListener = registrarListener(
      tabletMedia,
      atualizarAutoScroll,
    );

    return () => {
      removerMotionListener();
      removerDesktopListener();
      removerTabletListener();
    };
  }, []);

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
    retomarAutoScrollRef.current = performance.now() + retomarAutoScrollMs;
    container.style.cursor = "grab";
    container.style.scrollBehavior = "auto";
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!container || destaques.length <= 1 || !autoScrollAtivo) {
      return undefined;
    }

    let frame;
    let ultimoFrameTime = 0;

    function animate(now) {
      if (!ultimoFrameTime) {
        ultimoFrameTime = now;
      }

      const delta = now - ultimoFrameTime;
      ultimoFrameTime = now;
      const podeAutoScroll = !isDragging && now >= retomarAutoScrollRef.current;

      if (podeAutoScroll) {
        // Normaliza velocidade para comportar igual em 60hz/120hz.
        const deslocamento = (autoScrollVelocidade * delta) / (1000 / 60);
        container.scrollLeft += deslocamento;

        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft -= container.scrollWidth / 2;
        }
      }

      frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [isDragging, destaques, autoScrollAtivo, autoScrollVelocidade]);

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
    <section className="mb-3">
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
            <div
              key={produto.id + "-" + idx}
              className="group relative flex h-64 min-w-[244px] cursor-pointer items-end overflow-hidden rounded-[1.4rem] border border-[#d8cab8] bg-[#201711] shadow-[0_10px_28px_rgba(33,19,12,0.2)] transition hover:-translate-y-0.5"
              onClick={() => scrollToProduto(produto.id)}
            >
              <Image
                src={produto.imagem_url}
                alt={produto.nome}
                fill
                sizes="(max-width: 768px) 70vw, 244px"
                quality={55}
                loading="lazy"
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
