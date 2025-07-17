'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CarrosselDestaques from './components/CarrosselDestaques';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');

  useEffect(() => {
    fetchCategorias();
    fetchDestaques();
    fetchProdutos();
  }, [categoriaFiltro]);

  async function fetchCategorias() {
    const { data } = await supabase.from('categorias').select('*').order('nome');
    setCategorias(data || []);
  }

  async function fetchDestaques() {
    const { data } = await supabase
      .from('produtos')
      .select('*, categorias(nome)')
      .eq('destaque', true)
      .eq('disponivel', true)
      .order('id', { ascending: false });
    setDestaques(data || []);
  }

  async function fetchProdutos() {
    let query = supabase
      .from('produtos')
      .select('*, categorias(nome)')
      .eq('disponivel', true)
      .order('id', { ascending: false });
    if (categoriaFiltro) {
      query = query.eq('categoria_id', categoriaFiltro);
    }
    const { data } = await query;
    setProdutos(data || []);
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 bg-white">
      {/* <header className="mb-10 flex flex-col items-center">
        <p className="text-2xl text-[#7b1e3a] text-center font-serif">
          Joias e acessórios em prata com elegância e brilho para você!
        </p>
      </header> */}

      {/* Carrossel de destaques */}
      <CarrosselDestaques />

      {/* Filtro de categorias */}
      <Tabs defaultValue={categoriaFiltro || "todas"} className="w-full mb-8">
        <TabsList className="flex justify-start gap-2">
          <TabsTrigger value="todas" onClick={() => setCategoriaFiltro("")}>
            Todas
          </TabsTrigger>
          {categorias.map(cat => (
            <TabsTrigger
              key={cat.id}
              value={String(cat.id)}
              onClick={() => setCategoriaFiltro(String(cat.id))}
            >
              {cat.nome}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Catálogo */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-[#7b1e3a] font-bodoni">Catálogo</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {produtos.map(produto => (
            <div
              key={produto.id}
              id={`produto-${produto.id}`}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-start hover:scale-[1.03] transition-transform"
            >
              <div className="mb-1 text-xs text-gray-500">🏷️ {produto.categorias?.nome}</div>
              <div className="w-full aspect-square mb-2">
                <img
                  src={produto.imagem_url}
                  alt={produto.nome}
                  className="w-full h-full object-cover rounded-lg "
                  style={{ background: '#f8f8f8' }}
                />
              </div>
              <h3 className="text-xl font-bold text-[#7b1e3a] font-bodoni">{produto.nome}</h3>
              <p className="text-gray-400 text-sm font-sans text-base">{produto.descricao}</p>
              <div className="font-bold text-[#7b1e3a] text-lg font-sans">{`R$ ${produto.preco}`}</div>
              <a
                href={`https://wa.me/5513997033980?text=Oi%20gostaria%20de%20saber%20mais%20sobre%20${encodeURIComponent(produto.nome)}`}
                target="_blank"
                rel="noopener"
                className="bg-[#7b1e3a] text-white px-4 py-2 rounded hover:bg-black transition mt-1 text-sm font-semibold"
              >
                <span>Comprar</span>
              </a>
            </div>
          ))}
        </div>
        {produtos.length === 0 && (
          <p className="mt-12 text-lg text-gray-500">Nenhum produto disponível nesta categoria.</p>
        )}
      </section>
    </div>
  );
}
