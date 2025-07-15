'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function DestaquesPainel() {
  const [destaques, setDestaques] = useState([]);

  useEffect(() => {
    fetchDestaques();
  }, []);

  async function fetchDestaques() {
    const { data } = await supabase
      .from('produtos')
      .select('*, categorias(nome)')
      .eq('destaque', true)
      .order('id', { ascending: false });
    setDestaques(data || []);
  }

  async function removerDestaque(id) {
    await supabase.from('produtos').update({ destaque: false }).eq('id', id);
    fetchDestaques();
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7b1e3a] font-serif">Produtos em Destaque</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {destaques.map(produto => (
          <div key={produto.id} className="bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col items-start">
            <img
              src={produto.imagem_url}
              alt={produto.nome}
              className="w-full h-40 object-cover rounded-lg border border-gray-300 mb-2"
              style={{ background: '#f8f8f8' }}
            />
            <h3 className="text-lg font-bold mb-1 text-[#7b1e3a] font-serif">{produto.nome}</h3>
            <div className="mb-1 text-xs text-gray-500">{produto.categorias?.nome}</div>
            <div className="mb-1 text-gray-700 font-sans">{produto.descricao}</div>
            <div className="font-bold text-[#7b1e3a] text-base mb-1">{`R$ ${produto.preco}`}</div>
            <button
              onClick={() => removerDestaque(produto.id)}
              className="px-4 py-2 rounded bg-red-600 text-white mt-2 hover:bg-black transition-colors font-semibold text-sm"
            >
              Remover Destaque
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}