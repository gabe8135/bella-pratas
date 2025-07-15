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
    nome: '', descricao: '', preco: '', categoria_id: '', imagem: null, destaque: false, disponivel: true
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

  async function handleImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const options = {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 800,
      useWebWorker: true,
      fileType: 'image/webp'
    };
    const compressedFile = await imageCompression(file, options);
    setForm({ ...form, imagem: compressedFile });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let imagem_url = form.imagem_url;

    // Se o usuário selecionou uma nova imagem, faz upload
    if (form.imagem) {
      const fileName = `${Date.now()}-${form.nome.replace(/\s/g, '')}.webp`;
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
          className="w-full px-4 py-2 rounded border border-gray-300 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition"
        />
        <input
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded border border-gray-300 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition"
        />
        <input
          name="preco"
          type="number"
          step="0.01"
          placeholder="Preço"
          value={form.preco}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded border border-gray-300 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition"
        />
        <select
          name="categoria_id"
          value={form.categoria_id}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 rounded border border-gray-300 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition"
        >
          <option value="">Selecione a categoria</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nome}</option>
          ))}
        </select>
        {form.imagem_url && (
          <img src={form.imagem_url} alt="Atual" className="w-32 h-32 object-cover rounded mb-2 border border-gray-300" />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="w-full px-4 py-2 rounded border border-gray-300 bg-gray-50 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition"
        />
        <label className="flex items-center gap-2">
          <input type="checkbox" name="destaque" checked={form.destaque} onChange={handleChange} />
          <span className="text-[#7b1e3a] font-medium">Destaque</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="disponivel" checked={form.disponivel} onChange={handleChange} />
          <span className="text-[#7b1e3a] font-medium">Disponível</span>
        </label>
        <button
          type="submit"
          className="w-full bg-[#7b1e3a] text-white px-5 py-2 rounded font-semibold hover:bg-black transition"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
      {mensagem && <p className="mt-4 text-center text-green-600 font-semibold">{mensagem}</p>}
    </div>
  );
}