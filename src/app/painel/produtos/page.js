'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function ProdutosPainel() {
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    const { data } = await supabase
      .from('produtos')
      .select('*, categorias(nome)')
      .order('id', { ascending: false });
    setProdutos(data || []);
  }

  async function alterarDisponibilidade(id, disponivel) {
    const { error } = await supabase
      .from('produtos')
      .update({ disponivel: !disponivel })
      .eq('id', id);
    if (error) setMensagem('Erro ao alterar disponibilidade');
    else setMensagem(!disponivel ? 'Produto marcado como disponível!' : 'Produto marcado como esgotado!');
    fetchProdutos();
  }

  async function alterarDestaque(id, destaque) {
    const { error } = await supabase
      .from('produtos')
      .update({ destaque: !destaque })
      .eq('id', id);
    if (error) setMensagem('Erro ao alterar destaque');
    else setMensagem(!destaque ? 'Produto marcado como destaque!' : 'Produto removido dos destaques!');
    fetchProdutos();
  }

  async function excluirProduto(id) {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);
      if (error) setMensagem('Erro ao excluir produto');
      else setMensagem('Produto excluído com sucesso!');
      fetchProdutos();
    }
  }

  function editarProduto(id) {
    router.push(`/painel/produtos/editar/${id}`);
  }

  // Switch estilizado
  function Switch({ checked, onChange, label }) {
    return (
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <span className="text-sm">{label}</span>
        <span className="relative inline-block w-10 h-6">
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="opacity-0 w-0 h-0 peer"
          />
          <span
            className={`absolute left-0 top-0 w-10 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-green-500' : 'bg-gray-300'}`}
          ></span>
          <span
            className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : ''}`}
          ></span>
        </span>
      </label>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7b1e3a] font-serif">Produtos</h2>
      {mensagem && <p className="mb-4 text-center text-green-600 font-semibold">{mensagem}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {produtos.map(produto => (
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
            <div className="flex gap-4 mt-2 items-center">
              <Switch
                checked={produto.disponivel}
                onChange={() => alterarDisponibilidade(produto.id, produto.disponivel)}
                label={produto.disponivel ? 'Disponível' : 'Esgotado'}
              />
              <Switch
                checked={produto.destaque}
                onChange={() => alterarDestaque(produto.id, produto.destaque)}
                label="Destaque"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => editarProduto(produto.id)}
                className="px-4 py-2 rounded font-semibold bg-[#7b1e3a] text-white hover:bg-black transition"
                title="Editar produto"
              >
                Editar
              </button>
              <button
                onClick={() => excluirProduto(produto.id)}
                className="px-4 py-2 rounded font-semibold bg-red-600 text-white hover:bg-black transition"
                title="Excluir produto"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}