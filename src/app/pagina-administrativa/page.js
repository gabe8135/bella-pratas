'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function PaginaAdministrativa() {
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/');
  }

  function navegar(rota) {
    router.push(rota);
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7b1e3a] font-serif">Página Administrativa</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <button
          className="w-full bg-[#7b1e3a] text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-black transition"
          onClick={() => navegar('/cadastrar-produto')}
        >
          Cadastrar Novo Produto
        </button>
        <button
          className="w-full bg-black text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-[#7b1e3a] transition"
          onClick={() => navegar('/painel/produtos')}
        >
          Gerenciar Produtos
        </button>
        <button
          className="w-full bg-white text-[#7b1e3a] border border-[#7b1e3a] px-6 py-3 rounded-xl font-semibold shadow hover:bg-[#7b1e3a] hover:text-white transition"
          onClick={() => navegar('/painel/destaques')}
        >
          Gerenciar Destaques
        </button>
        <button
          className="w-full bg-gray-100 text-[#7b1e3a] border border-gray-300 px-6 py-3 rounded-xl font-semibold shadow hover:bg-black hover:text-white transition"
          onClick={() => navegar('/painel/categorias')}
        >
          Gerenciar Categorias
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 w-full">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 rounded-xl font-semibold bg-red-600 text-white hover:bg-black transition"
        >
          Sair
        </button>
        
      </div>
    </div>
  );
}