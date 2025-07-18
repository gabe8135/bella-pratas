'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import imageCompression from 'browser-image-compression';

export default function EditarProduto() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [form, setForm] = useState({
    nome: '', descricao: '', preco: '', categoria_id: '', imagem: null, destaque: false, disponivel: true, imagem_url: ''
  });
  const [categorias, setCategorias] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategorias();
    fetchProduto();
    // eslint-disable-next-line
  }, []);

  async function fetchCategorias() {
    const { data } = await supabase.from('categorias').select('*').order('nome');
    setCategorias(data || []);
  }

  async function fetchProduto() {
    const { data } = await supabase.from('produtos').select('*').eq('id', id).single();
    if (data) {
      setForm({
        nome: data.nome,
        descricao: data.descricao,
        preco: data.preco,
        categoria_id: data.categoria_id,
        imagem: null,
        destaque: data.destaque,
        disponivel: data.disponivel,
        imagem_url: data.imagem_url
      });
    }
  }

  // Função para limpar o nome do arquivo
  function sanitizeFileName(nome) {
    return nome
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
  }

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

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let imagem_url = form.imagem_url;

    // Se o usuário selecionou uma nova imagem, faz upload com nome sanitizado
    if (form.imagem) {
      const fileName = form.imagem.name; // já sanitizado
      const { error } = await supabase.storage
        .from('produtos')
        .upload(fileName, form.imagem, { contentType: 'image/webp' });
      if (error) {
        setMensagem('Erro ao enviar imagem: ' + error.message);
        setLoading(false);
        return;
      }
      imagem_url = supabase.storage.from('produtos').getPublicUrl(fileName).data.publicUrl;
    }

    const { error } = await supabase
      .from('produtos')
      .update({
        nome: form.nome,
        descricao: form.descricao,
        preco: form.preco,
        categoria_id: form.categoria_id,
        imagem_url,
        destaque: form.destaque,
        disponivel: form.disponivel
      })
      .eq('id', id);

    setLoading(false);
    if (error) {
      setMensagem('Erro ao atualizar: ' + error.message);
    } else {
      setMensagem('Produto atualizado com sucesso!');
      setTimeout(() => router.push('/painel/produtos'), 1200);
    }
  }

  function handleCancel() {
    router.push('/painel/produtos');
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7b1e3a] font-serif">Editar Produto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition font-medium"
        />
        <input
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition font-medium"
        />
        <input
          name="preco"
          type="number"
          step="0.01"
          placeholder="Preço"
          value={form.preco}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition font-medium"
        />
        <select
          name="categoria_id"
          value={form.categoria_id}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition font-medium"
        >
          <option value="">Selecione a categoria</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
        {/* Campo de imagem estilizado */}
        <div className="flex flex-col items-center mb-2">
          {form.imagem_url && (
            <div className="relative mb-2">
              <img
                src={form.imagem_url}
                alt="Atual"
                className="w-32 h-32 object-cover rounded-xl border border-gray-300 shadow"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-black transition"
                title="Remover foto"
                onClick={() => setForm({ ...form, imagem_url: '', imagem: null })}
              >
                ✖
              </button>
            </div>
          )}
          <label
            htmlFor="imagem"
            className="flex items-center gap-2 px-6 py-3 bg-[#7b1e3a] text-white rounded-full font-semibold shadow hover:bg-black transition cursor-pointer"
            style={{ minWidth: 180 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            {form.imagem_url ? "Trocar Foto" : "Adicionar Foto"}
            <input
              id="imagem"
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
          </label>
          {form.imagem && (
            <img
              src={URL.createObjectURL(form.imagem)}
              alt="Prévia"
              className="mt-2 w-32 h-32 object-cover rounded-xl border border-gray-300 shadow"
            />
          )}
        </div>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} />
          <span className="text-[#7b1e3a] font-medium">Destaque</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="disponivel" checked={form.disponivel} onChange={handleChange} />
          <span className="text-[#7b1e3a] font-medium">Disponível</span>
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="w-full bg-[#7b1e3a] text-white px-5 py-3 rounded-full font-semibold hover:bg-black transition"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            type="button"
            className="w-full bg-gray-300 text-[#7b1e3a] px-5 py-3 rounded-full font-semibold hover:bg-black hover:text-white transition"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>
      {mensagem && (
        <div className={`mt-6 px-6 py-4 rounded-xl text-center font-semibold shadow transition ${mensagem.startsWith('Erro') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
          {mensagem}
        </div>
      )}
    </div>
  );
}