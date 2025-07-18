'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CarrosselDestaques from './components/CarrosselDestaques';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);

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
        <TabsList className="flex justify-start gap-2 overflow-x-auto scrollbar-hide bg-[#f8f8f8] rounded-full p-2">
          <TabsTrigger
            value="todas"
            onClick={() => setCategoriaFiltro("")}
            className="text-[#7b1e3a] data-[state=active]:bg-black data-[state=active]:text-white px-4 py-1 rounded-full font-semibold transition"
          >
            Todas
          </TabsTrigger>
          {categorias.map(cat => (
            <TabsTrigger
              key={cat.id}
              value={String(cat.id)}
              onClick={() => setCategoriaFiltro(String(cat.id))}
              className="text-[#7b1e3a] data-[state=active]:bg-black data-[state=active]:text-white px-4 py-1 rounded-full font-semibold transition"
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
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-start hover:scale-[1.03] transition-transform cursor-pointer"
              onClick={() => setProdutoSelecionado(produto)}
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
                className="bg-[#7b1e3a] text-white px-6 py-2 rounded-lg hover:bg-black transition mt-1 text-sm font-semibold"
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

      {/* Detalhes do produto selecionado */}
      <Dialog.Root open={!!produtoSelecionado} onOpenChange={setProdutoSelecionado}>
        <Dialog.Portal>
          <Dialog.Overlay
            className="fixed inset-0 bg-white/10 z-50"
            style={{ cursor: 'pointer' }}
          />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/70 backdrop-blur-md border border-white shadow-2xl rounded-4xl max-w-xl w-full max-h-[90vh] overflow-auto relative flex flex-col items-center px-3 py-6"
              onClick={e => e.stopPropagation()}
            >
              <Dialog.Close asChild>
                <button
                  className="absolute top-2 right-2 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold hover:bg-gray-400 transition"
                  aria-label="Fechar"
                  style={{ zIndex: 10 }}
                >
                  ✖
                </button>
              </Dialog.Close>
              {produtoSelecionado && (
                <>
                  <Dialog.Title asChild>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-8">{produtoSelecionado.nome}</h2>
                  </Dialog.Title>
                  <img src={produtoSelecionado.imagem_url} alt={produtoSelecionado.nome}
                    className="w-full max-h-[400px] object-contain rounded-xl mb-4" />
                  <div className="mb-1 text-xs text-gray-600">🏷️ {produtoSelecionado.categorias?.nome}</div>
                  <p className="text-base text-gray-700 mb-4">{produtoSelecionado.descricao}</p>
                  <div className="font-bold text-gray-800 text-lg mb-4">{`R$ ${produtoSelecionado.preco}`}</div>
                  <a
                    href={`https://wa.me/5513997033980?text=Oi%20gostaria%20de%20saber%20mais%20sobre%20${encodeURIComponent(produtoSelecionado.nome)}`}
                    target="_blank"
                    className="bg-[#7b1e3a] text-white px-8 py-3 rounded-full hover:bg-black mb-4"
                  >
                    Comprar
                  </a>
                </>
              )}
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
