'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CarrosselDestaques() {
  const [destaques, setDestaques] = useState([]);

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

  if (destaques.length === 0) return null;

  // Duplicar os cards para efeito de loop infinito
  const cards = [...destaques, ...destaques];

  // Função para rolar até o produto no catálogo
  function scrollToProduto(id) {
    const el = document.getElementById(`produto-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4 text-center text-[#7b1e3a]">Produtos em Destaque</h2>
      <div className="overflow-x-hidden pb-2" style={{ minHeight: 260 }}>
        <div
          className="flex gap-6 animate-marquee"
          style={{
            width: `${cards.length * 240}px`,
            animation: `marquee ${cards.length * 3}s linear infinite`,
          }}
        >
          {cards.map((produto, idx) => (
            <div
              key={produto.id + '-' + idx}
              className="min-w-[220px] h-56 rounded-xl shadow-lg border border-gray-200 relative cursor-pointer overflow-hidden flex items-end transition hover:scale-105"
              style={{
                backgroundImage: ` url(${produto.imagem_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 1px 4px 0 rgba(23,23,23,0.04)', // sombra bem fraquinha
              }}
              onClick={() => scrollToProduto(produto.id)}
            >
              <div className="p-2 w-full">
                <h3 className="text-lg font-bold text-white drop-shadow">{produto.nome}</h3>
                <div className="text-xs text-gray-200 ">{produto.categorias?.nome}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}