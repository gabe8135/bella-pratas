'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CarrosselDestaques() {
  const [destaques, setDestaques] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    async function fetchDestaques() {
      const { data } = await supabase
        .from('produtos')
        .select('*, categorias(nome)')
        .eq('destaque', true)
        .eq('disponivel', true)
        .order('id', { ascending: false });
      setDestaques(data || []);
    }
    fetchDestaques();
  }, []);

  // Drag handlers
  function handlePointerDown(e) {
    setIsDragging(true);
    setStartX(e.type === 'touchstart' ? e.touches[0].pageX : e.pageX);
    setScrollLeft(containerRef.current.scrollLeft);
    containerRef.current.style.cursor = 'grabbing';
    containerRef.current.style.scrollBehavior = 'auto';
  }

  function handlePointerMove(e) {
    if (!isDragging) return;
    const x = e.type === 'touchmove' ? e.touches[0].pageX : e.pageX;
    const walk = (startX - x);
    containerRef.current.scrollLeft = scrollLeft + walk;
  }

  function handlePointerUp() {
    setIsDragging(false);
    containerRef.current.style.cursor = 'grab';
    // Volta para smooth para animação automática
    containerRef.current.style.scrollBehavior = 'smooth';
  }

  // Auto scroll animation (marquee)
  useEffect(() => {
    const container = containerRef.current;
    let frame;
    let speed = 0.5; // px por frame

    function animate() {
      if (!isDragging && container) {
        container.scrollLeft += speed;
        // Loop suave: volta para o início da duplicação
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
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  if (destaques.length === 0) return null;

  const cards = [...destaques, ...destaques];

  return (
    <section className="mb-3">
      <h2 className="text-2xl font-semibold mb-4 text-center text-[#7b1e3a]">Produtos em Destaque</h2>
      <div
        ref={containerRef}
        className="overflow-x-auto pb-2 cursor-grab select-none scrollbar-hide"
        style={{ minHeight: 260, WebkitOverflowScrolling: 'touch' }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        <div
          className="flex gap-6"
          style={{
            width: `${cards.length * 240}px`,
          }}
        >
          {cards.map((produto, idx) => (
            <div
              key={produto.id + '-' + idx}
              className="min-w-[220px] h-56 rounded-xl shadow-lg border border-gray-200 relative cursor-pointer overflow-hidden flex items-end transition hover:scale-105"
              style={{
                backgroundImage: `url(${produto.imagem_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 1px 4px 0 rgba(23,23,23,0.04)',
              }}
              onClick={() => scrollToProduto(produto.id)}
            >
              <div className="p-2 w-full">
                <h3 className="text-lg font-bold text-white drop-shadow">{produto.nome}</h3>
                <div className="text-xs text-gray-200">{produto.categorias?.nome}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}