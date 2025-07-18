'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function CategoriasPainel() {
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    const { data } = await supabase.from('categorias').select('*').order('nome');
    setCategorias(data || []);
  }

  async function adicionarCategoria(e) {
    e.preventDefault();
    const { error } = await supabase.from('categorias').insert([{ nome: novaCategoria }]);
    if (error) {
      setMensagem('Erro: ' + error.message);
    } else {
      setMensagem('Categoria adicionada!');
      setNovaCategoria('');
      fetchCategorias();
    }
  }

  async function excluirCategoria(id) {
    await supabase.from('categorias').delete().eq('id', id);
    fetchCategorias();
  }

  return (
    <div className="max-w-xl mx-auto mt-14 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-8 text-center text-[#7b1e3a] font-serif tracking-tight">Gerenciar Categorias</h2>
      <form onSubmit={adicionarCategoria} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={novaCategoria}
          onChange={e => setNovaCategoria(e.target.value)}
          placeholder="Nova categoria"
          required
          className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition font-medium bg-gray-50"
        />
        <button
          type="submit"
          className="bg-[#7b1e3a] text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-black transition w-full sm:w-auto"
        >
          + Adicionar
        </button>
      </form>
      {mensagem && (
        <div className={`mb-6 px-4 py-3 rounded-full text-center font-semibold shadow transition ${mensagem.startsWith('Erro') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
          {mensagem}
        </div>
      )}
      <ul>
        {categorias.map(cat => (
          <li
            key={cat.id}
            className="mb-3 flex justify-between items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow hover:shadow-lg transition"
          >
            <span className="text-[#7b1e3a] font-medium text-base">{cat.nome}</span>
            <button
              onClick={() => excluirCategoria(cat.id)}
              className="flex items-center gap-1 text-red-600 hover:text-white hover:bg-red-600 px-4 py-2 rounded-full font-semibold transition text-sm shadow border-none"
              title="Excluir categoria"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Excluir
            </button>
          </li>
        ))}
        {categorias.length === 0 && (
          <li className="text-center text-gray-400 py-8">Nenhuma categoria cadastrada.</li>
        )}
      </ul>
    </div>
  );
}