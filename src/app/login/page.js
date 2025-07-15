'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    setLoading(false);
    if (error) {
      setMensagem('Usuário ou senha inválidos.');
    } else {
      setMensagem('Login realizado com sucesso!');
      setTimeout(() => router.push('/painel'), 1200);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7b1e3a] font-serif">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-gray-300 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
          className="w-full px-4 py-2 rounded border border-gray-300 focus:border-[#7b1e3a] focus:ring-2 focus:ring-[#7b1e3a]/30 outline-none transition"
        />
        <button
          type="submit"
          className="w-full bg-[#7b1e3a] text-white px-5 py-2 rounded font-semibold hover:bg-black transition"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {mensagem && <p className="mt-4 text-center text-green-600 font-semibold">{mensagem}</p>}
    </div>
  );
}