'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import imageCompression from 'browser-image-compression';

export default function CadastrarProduto() {
  const [form, setForm] = useState({
    nome: '', descricao: '', preco: '', categoria_id: '', imagem: null, destaque: false, disponivel: true
  });
  const [categorias, setCategorias] = useState([]);
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [autenticado, setAutenticado] = useState(false);
  const [toast, setToast] = useState({ show: false, text: '', color: 'green' });

  useEffect(() => {
    async function verificarLogin() {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setAutenticado(true);
      else window.location.href = '/login';
    }
    async function fetchCategorias() {
      const { data } = await supabase.from('categorias').select('*').order('nome');
      setCategorias(data || []);
    }
    verificarLogin();
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!autenticado) return null;

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

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    let imagem_url = '';
    if (form.imagem) {
      // Remove caracteres especiais e acentos
      const nomeLimpo = form.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '');
      const fileName = `${Date.now()}-${nomeLimpo}.webp`;
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
    const { error: err } = await supabase
      .from('produtos')
      .insert([{
        nome: form.nome,
        descricao: form.descricao,
        preco: form.preco,
        categoria_id: form.categoria_id,
        imagem_url,
        destaque: form.destaque,
        disponivel: form.disponivel
      }]);
    setLoading(false);
    if (err) {
      setMensagem('Erro ao cadastrar: ' + err.message);
      setToast({ show: true, text: 'Erro ao cadastrar: ' + err.message, color: 'red' });
    } else {
      setMensagem('Produto cadastrado com sucesso! 💍');
      setToast({ show: true, text: 'Produto cadastrado com sucesso! 💍', color: 'green' });
      setForm({ nome: '', descricao: '', preco: '', categoria_id: '', imagem: null, destaque: false, disponivel: true });
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7b1e3a] font-serif">Cadastrar Produto</h2>
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
        {/* Campo de upload de foto estilizado */}
        <div className="flex flex-col items-center">
          <label
            htmlFor="imagem"
            className="flex items-center gap-2 px-6 py-3 bg-[#7b1e3a] text-white rounded-full font-semibold shadow hover:bg-black transition cursor-pointer"
            style={{ minWidth: 180 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Adicionar Foto
            <input
              id="imagem"
              type="file"
              accept="image/*"
              onChange={handleImage}
              required
              className="hidden"
            />
          </label>
          {form.imagem && (
            <img
              src={URL.createObjectURL(form.imagem)}
              alt="Prévia"
              className="mt-4 w-40 h-40 object-cover rounded-xl border border-gray-300 shadow"
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
        <button
          type="submit"
          className="w-full bg-[#7b1e3a] text-white px-6 py-3 rounded-full font-semibold hover:bg-black transition"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Cadastrar'}
        </button>
      </form>
      {toast.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 text-center border border-gray-200 max-w-sm w-full">
            <h4 className={`text-lg font-bold mb-2 ${toast.color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
              {toast.color === 'green' ? 'Sucesso!' : 'Erro'}
            </h4>
            <p className="mb-4">{toast.text}</p>
            <button
              className="bg-[#7b1e3a] text-white px-6 py-2 rounded-full font-semibold hover:bg-black transition"
              onClick={() => setToast({ ...toast, show: false })}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}