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
    <div className="max-w-xl mx-auto mt-14 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7b1e3a] font-serif">Gerenciar Categorias</h2>
      <form onSubmit={adicionarCategoria} className="flex flex-col sm:flex-row gap-2 mb-6">
        <input
          type="text"
          value={novaCategoria}
          onChange={e => setNovaCategoria(e.target.value)}
          placeholder="Nova categoria"
          required
          className="flex-1 px-4 py-2 rounded border border-gray-300 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition"
        />
        <button
          type="submit"
          className="bg-[#7b1e3a] text-white px-5 py-2 rounded font-semibold hover:bg-black transition w-full sm:w-auto"
        >
          Adicionar
        </button>
      </form>
      {mensagem && <p className="mb-4 text-center text-green-600 font-semibold">{mensagem}</p>}
      <ul>
        {categorias.map(cat => (
          <li
            key={cat.id}
            className="mb-2 flex justify-between items-center bg-gray-50 border border-gray-200 rounded px-4 py-2"
          >
            <span className="text-[#7b1e3a] font-medium">{cat.nome}</span>
            <button
              onClick={() => excluirCategoria(cat.id)}
              className="text-red-600 hover:text-white hover:bg-red-600 border border-red-200 px-3 py-1 rounded transition ml-4 text-sm font-semibold"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}