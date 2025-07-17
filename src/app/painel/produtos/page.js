'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';

export default function ProdutosPainel() {
  const [produtos, setProdutos] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [toast, setToast] = useState({ show: false, text: '', color: 'green' });
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', imagem: null });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, produtoId: null });
  const router = useRouter();

  useEffect(() => {
    fetchProdutos();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
    else {
      setMensagem(!disponivel ? 'Produto marcado como disponível!' : 'Produto marcado como esgotado!');
      setToast({ show: true, text: !disponivel ? 'Produto marcado como disponível!' : 'Produto marcado como esgotado!', color: 'green' });
    }
    fetchProdutos();
  }

  async function alterarDestaque(id, destaque) {
    const { error } = await supabase
      .from('produtos')
      .update({ destaque: !destaque })
      .eq('id', id);
    if (error) setMensagem('Erro ao alterar destaque');
    else {
      setMensagem(!destaque ? 'Produto marcado como destaque!' : 'Produto removido dos destaques!');
      setToast({ show: true, text: !destaque ? 'Produto marcado como destaque!' : 'Produto removido dos destaques!', color: 'green' });
    }
    fetchProdutos();
  }

  async function excluirProduto(id) {
    const produto = produtos.find(p => p.id === id);
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      // Exclui imagem do Storage se existir
      if (produto?.imagem_url) {
        const filePath = produto.imagem_url.split('/').pop(); // pega o nome do arquivo
        await supabase.storage.from('produtos').remove([filePath]);
      }
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', id);
      if (error) {
        setToast({ show: true, text: 'Erro ao excluir produto: ' + error.message, color: 'red' });
      } else {
        setToast({ show: true, text: 'Produto excluído com sucesso!', color: 'green' });
        fetchProdutos();
      }
    }
  }

  function editarProduto(id) {
    router.push(`/painel/produtos/editar/${id}`);
  }

  // Função para limpar o nome do arquivo
  function sanitizeFileName(nome) {
    return nome
      .normalize('NFD') // remove acentos
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '') // remove caracteres especiais
      .toLowerCase();
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

  // Ao selecionar a imagem
  async function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const nomeLimpo = sanitizeFileName(form.nome || file.name.split('.')[0]);
    const fileName = `${Date.now()}-${nomeLimpo}.webp`;

    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      fileType: 'image/webp'
    };
    const compressedFile = await imageCompression(file, options);

    // Cria um novo File com nome limpo e tipo correto
    const webpFile = new File([compressedFile], fileName, { type: 'image/webp' });
    setForm({ ...form, imagem: webpFile });
  }

  // No handleSubmit, use o nome já sanitizado do arquivo salvo em form.imagem
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let imagem_url = '';
    if (form.imagem) {
      const fileName = form.imagem.name; // já sanitizado
      const { error } = await supabase.storage
        .from('produtos')
        .upload(fileName, form.imagem, { contentType: 'image/webp' });
      if (error) {
        setToast({ show: true, text: 'Erro ao enviar imagem: ' + error.message, color: 'red' });
        setLoading(false);
        return;
      }
      imagem_url = supabase.storage.from('produtos').getPublicUrl(fileName).data.publicUrl;
    }
    // ...restante do cadastro...
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7b1e3a] font-serif">Produtos</h2>
      {mensagem && <p className="mb-4 text-center text-green-600 font-semibold">{mensagem}</p>}
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg bg-white border border-gray-300 text-center z-50 text-${toast.color}-600 font-semibold`}>
          {toast.text}
        </div>
      )}
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
                onClick={() => setModal({ show: true, produtoId: produto.id })}
                className="px-4 py-2 rounded font-semibold bg-red-600 text-white hover:bg-black transition"
                title="Excluir produto"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
      {modal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full mx-4 max-w-sm text-center border border-gray-300">
            <h4 className="text-lg font-bold mb-2 text-[#7b1e3a]">Confirmar exclusão</h4>
            <p className="mb-4">Tem certeza que deseja excluir este produto?</p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-black transition"
                onClick={async () => {
                  await excluirProduto(modal.produtoId);
                  setModal({ show: false, produtoId: null });
                }}
              >
                Sim, excluir
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 text-[#7b1e3a] font-semibold hover:bg-black hover:text-white transition"
                onClick={() => setModal({ show: false, produtoId: null })}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}