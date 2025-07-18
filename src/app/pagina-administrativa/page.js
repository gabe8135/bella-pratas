'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';

export default function PaginaAdministrativa() {
  const router = useRouter();
  const [toast, setToast] = useState({ show: false, text: '', color: 'green' });

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  function navegar(rota) {
    router.push(rota);
  }

  return (
    <div className="max-w-2xl mt-12 mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7b1e3a] font-serif">Página Administrativa</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <button
          className="w-full bg-[#7b1e3a] text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-black transition"
          onClick={() => navegar('/cadastrar-produto')}
        >
          Cadastrar Novo Produto
        </button>
        <button
          className="w-full bg-[#7b1e3a] text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-black transition"
          onClick={() => navegar('/painel/produtos')}
        >
          Gerenciar Produtos
        </button>
        <button
          className="w-full bg-[#7b1e3a] text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-black transition"
          onClick={() => navegar('/painel/destaques')}
        >
          Gerenciar Destaques
        </button>
        <button
          className="w-full bg-[#7b1e3a] text-white px-6 py-3 rounded-full font-semibold shadow hover:bg-black transition"
          onClick={() => navegar('/painel/categorias')}
        >
          Gerenciar Categorias
        </button>
      </div>
      {/* Botão "Sair" pequeno e no canto inferior direito */}
      <div className="w-full flex justify-end mt-4">
        <button
          onClick={handleLogout}
          className="px-5 py-2 rounded-full font-semibold bg-red-600 text-white shadow hover:bg-black transition"
          style={{ minWidth: 100 }}
        >
          Sair
        </button>
      </div>
      {toast.show && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded shadow-lg bg-white border border-gray-300 text-center z-50 text-${toast.color}-600 font-semibold`}>
          {toast.text}
        </div>
      )}
    </div>
  );
}