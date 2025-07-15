'use client';
import { useRouter } from 'next/navigation';

export default function PaginaAdministrativa() {
  const router = useRouter();

  function navegar(rota) {
    router.push(rota);
  }

  return (
    <div className="max-w-lg mx-auto mt-16 p-8 bg-white rounded-xl shadow-lg flex flex-col gap-6 border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#7b1e3a] font-serif">Painel Administrativo</h2>
      <button
        className="bg-[#7b1e3a] text-white px-6 py-3 rounded font-semibold hover:bg-black transition"
        onClick={() => navegar('/cadastrar-produto')}
      >
        Cadastrar Novo Produto
      </button>
      <button
        className="bg-black text-white px-6 py-3 rounded font-semibold hover:bg-[#7b1e3a] transition"
        onClick={() => navegar('/painel/produtos')}
      >
        Gerenciar Produtos
      </button>
      <button
        className="bg-white text-[#7b1e3a] border border-[#7b1e3a] px-6 py-3 rounded font-semibold hover:bg-[#7b1e3a] hover:text-white transition"
        onClick={() => navegar('/painel/destaques')}
      >
        Gerenciar Destaques
      </button>
      <button
        className="bg-gray-100 text-[#7b1e3a] border border-gray-300 px-6 py-3 rounded font-semibold hover:bg-black hover:text-white transition"
        onClick={() => navegar('/painel/categorias')}
      >
        Gerenciar Categorias
      </button>
    </div>
  );
}