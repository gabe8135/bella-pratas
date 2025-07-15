'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    if (error) {
      setMensagem('Email ou senha inválidos');
    } else {
      setMensagem('Login realizado!');
      window.location.href = '/pagina-administrativa'; // Redireciona para a página principal
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login da Dona</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="input" />
        <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required className="input" />
        <button type="submit" className="btn">Entrar</button>
      </form>
      {mensagem && <p className="mt-2 text-red-500">{mensagem}</p>}
    </div>
  );
}