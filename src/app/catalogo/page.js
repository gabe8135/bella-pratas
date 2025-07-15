'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Catalogo() {
  const [produtos, setProdutos] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  useEffect(() => {
    fetchCategorias();
    fetchDestaques();
    fetchProdutos();
  }, [categoriaFiltro]);

  async function fetchCategorias() {
    const { data } = await supabase.from('categorias').select('*').order('nome');
    setCategorias(data || []);
  }

  async function fetchDestaques() {
    const { data } = await supabase
      .from('produtos')
      .select('*, categorias(nome)')
      .eq('destaque', true)
      .eq('disponivel', true)
      .order('id', { ascending: false });
    setDestaques(data || []);
  }

  async function fetchProdutos() {
    let query = supabase
      .from('produtos')
      .select('*, categorias(nome)')
      .eq('disponivel', true)
      .order('id', { ascending: false });
    if (categoriaFiltro) {
      query = query.eq('categoria_id', categoriaFiltro);
    }
    const { data } = await query;
    setProdutos(data || []);
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Catálogo Bella Pratas</h2>

      {/* Carrossel de destaques */}
      {destaques.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-center">Destaques</h3>
          <div className="flex gap-6 overflow-x-auto pb-2">
            {destaques.map(produto => (
              <div key={produto.id} className="min-w-[220px] bg-yellow-50 rounded-lg shadow p-4 flex flex-col items-center">
                <img src={produto.imagem_url} alt={produto.nome} className="w-40 h-40 object-cover rounded mb-2" />
                <h3 className="text-lg font-semibold mb-1">{produto.nome}</h3>
                <div className="mb-1 text-sm text-gray-500">{produto.categorias?.nome}</div>
                <div className="font-bold text-pink-700 text-lg mb-1">R$ {produto.preco}</div>
                <a href={`https://wa.me/5513997033980?text=Oi%20gostaria%20de%20saber%20mais%20sobre%20${encodeURIComponent(produto.nome)}`} target="_blank" rel="noopener" className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-2 mt-2">
                  <i className="fab fa-whatsapp"></i> Comprar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropdown de categorias */}
      <div className="flex justify-center mb-8">
        <select
          className="px-4 py-2 rounded border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={categoriaFiltro}
          onChange={e => setCategoriaFiltro(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
      </div>

      {/* Catálogo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {produtos.map(produto => (
          <div key={produto.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <img src={produto.imagem_url} alt={produto.nome} className="w-full h-56 object-cover rounded mb-4" />
            <h3 className="text-xl font-semibold mb-2">{produto.nome}</h3>
            <p className="mb-2 text-gray-600">{produto.descricao}</p>
            <div className="font-bold text-pink-700 text-lg mb-2">R$ {produto.preco}</div>
            <div className="mb-2 text-sm text-gray-500">🏷️ {produto.categorias?.nome}</div>
            <a href={`https://wa.me/5513997033980?text=Oi%20gostaria%20de%20saber%20mais%20sobre%20${encodeURIComponent(produto.nome)}`} target="_blank" rel="noopener" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center gap-2">
              <i className="fab fa-whatsapp"></i> Comprar
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}