"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CarrosselDestaques from "./components/CarrosselDestaques";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowUp,
  ArrowUpRight,
  ChevronRight,
  Gem,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

const WHATSAPP_NUMBER = "5513997033980";
const animationEase = [0.22, 1, 0.36, 1];

const sectionVariants = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.68,
      ease: animationEase,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.56,
      ease: animationEase,
    },
  },
};

const inViewProps = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, amount: 0.18 },
};

const filterOverlayVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.24,
      ease: animationEase,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: animationEase,
    },
  },
};

const filterPanelVariants = {
  hidden: { opacity: 0, x: -28, y: 12, scale: 0.96 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.34,
      ease: animationEase,
      when: "beforeChildren",
      staggerChildren: 0.045,
      delayChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    x: -24,
    y: 10,
    scale: 0.96,
    transition: {
      duration: 0.2,
      ease: animationEase,
    },
  },
};

const filterItemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.26,
      ease: animationEase,
    },
  },
};

const ctaButtonMotion = {
  whileHover: { y: -3, scale: 1.02 },
  whileTap: { scale: 0.98 },
  transition: { duration: 0.25, ease: animationEase },
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function buildWhatsappLink(nomeProduto) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Oi! Gostaria de saber mais sobre ${nomeProduto}.`)}`;
}

function formatCurrency(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return `R$ ${value}`;
  }
  return currencyFormatter.format(numericValue);
}

export default function Home() {
  const [produtos, setProdutos] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [busca, setBusca] = useState("");
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [filtroLateralAberto, setFiltroLateralAberto] = useState(false);
  const [gridColumns, setGridColumns] = useState(1);

  useEffect(() => {
    function atualizarGridColumns() {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setGridColumns(3);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setGridColumns(2);
      } else {
        setGridColumns(1);
      }
    }

    atualizarGridColumns();
    window.addEventListener("resize", atualizarGridColumns);

    return () => {
      window.removeEventListener("resize", atualizarGridColumns);
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarBase() {
      const [resCategorias, resDestaques] = await Promise.all([
        supabase.from("categorias").select("*").order("nome"),
        supabase
          .from("produtos")
          .select("*, categorias(nome)")
          .eq("destaque", true)
          .eq("disponivel", true)
          .order("id", { ascending: false }),
      ]);

      if (!ativo) {
        return;
      }

      setCategorias(resCategorias.data || []);
      setDestaques(resDestaques.data || []);
    }

    carregarBase();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarProdutos() {
      setCarregandoProdutos(true);

      let query = supabase
        .from("produtos")
        .select("*, categorias(nome)")
        .eq("disponivel", true)
        .order("id", { ascending: false });

      if (categoriaFiltro) {
        query = query.eq("categoria_id", categoriaFiltro);
      }

      const { data } = await query;

      if (!ativo) {
        return;
      }

      setProdutos(data || []);
      setCarregandoProdutos(false);
    }

    carregarProdutos();

    return () => {
      ativo = false;
    };
  }, [categoriaFiltro]);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return produtos;
    }

    return produtos.filter((produto) =>
      [produto.nome, produto.descricao, produto.categorias?.nome]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(termo)),
    );
  }, [busca, produtos]);

  const nomeCategoriaAtiva = categorias.find(
    (categoria) => String(categoria.id) === categoriaFiltro,
  )?.nome;
  const resumoCategoria = nomeCategoriaAtiva
    ? `Agora voce esta navegando por ${nomeCategoriaAtiva}.`
    : "Todas as categorias liberadas para voce explorar sem limite.";

  function scrollToCatalog() {
    const secaoCatalogo = document.getElementById("catalogo");
    if (secaoCatalogo) {
      secaoCatalogo.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function aplicarCategoriaRapida(categoriaId) {
    setCategoriaFiltro(categoriaId);
    setFiltroLateralAberto(false);
    scrollToCatalog();
  }

  function alternarFiltroLateral() {
    setFiltroLateralAberto((prev) => !prev);
  }

  function getWaveDelay(index) {
    const totalColunas = Math.max(gridColumns, 1);
    const linha = Math.floor(index / totalColunas);
    const coluna = index % totalColunas;

    // Alterna a direção por linha para criar uma onda horizontal elegante.
    const colunaNaOnda = linha % 2 === 0 ? coluna : totalColunas - 1 - coluna;
    const delayLinha = linha * 0.13;
    const delayColuna = colunaNaOnda * 0.06;

    return delayLinha + delayColuna;
  }

  return (
    <div className="relative mx-auto w-full max-w-7xl px-4 pb-24 pt-8 sm:px-6">
      <motion.button
        type="button"
        onClick={alternarFiltroLateral}
        className="filter-triangle-trigger fixed left-0 top-1/2 z-50 flex h-24 w-14 -translate-y-1/2 items-center justify-center border-y border-r border-[#d8c2a6] text-[#4a362a]"
        initial={{ x: -24, opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          filter: filtroLateralAberto
            ? "drop-shadow(0 0 10px rgba(171,131,88,0.52))"
            : "drop-shadow(0 0 0 rgba(171,131,88,0))",
        }}
        whileHover={{ x: 4, scale: 1.04 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.26, ease: animationEase }}
        aria-label="Alternar filtro de categorias"
      >
        <motion.span
          className="filter-triangle-icon"
          animate={{
            rotate: filtroLateralAberto ? 180 : 0,
            x: filtroLateralAberto ? -2 : 0,
          }}
          transition={{ duration: 0.34, ease: animationEase }}
        >
          <ChevronRight className="h-6 w-6 drop-shadow-[0_2px_6px_rgba(28,15,7,0.35)]" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {filtroLateralAberto && (
          <>
            <motion.button
              variants={filterOverlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              type="button"
              onClick={() => setFiltroLateralAberto(false)}
              aria-label="Fechar painel de categorias"
              className="fixed inset-0 z-40 bg-[#130d09]/46 backdrop-blur-sm"
            />

            <motion.aside
              variants={filterPanelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="fixed z-50 overflow-hidden rounded-[1.5rem] border border-[#d6c2a8] bg-[#fdf7ee]/97 p-3 shadow-[0_26px_70px_rgba(34,18,10,0.32)] xl:left-4 xl:top-24 xl:w-60 max-xl:bottom-20 max-xl:left-3 max-xl:right-3"
            >
              <div className="luxury-soft-shimmer pointer-events-none absolute inset-x-0 top-0 h-[2px]" />
              <motion.div
                className="mb-2 flex items-center justify-between px-1"
                variants={filterItemVariants}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#70533b]">
                  Filtro rapido
                </p>
                <button
                  type="button"
                  onClick={() => setFiltroLateralAberto(false)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#d8c3a7] text-[#5a4336] hover:bg-white"
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>

              <div className="max-h-[50vh] space-y-1 overflow-y-auto pr-1 xl:max-h-[55vh]">
                <motion.button
                  layout
                  variants={filterItemVariants}
                  whileHover={{ scale: 1.012, x: 1 }}
                  whileTap={{ scale: 0.985 }}
                  type="button"
                  onClick={() => aplicarCategoriaRapida("")}
                  className="relative w-full overflow-hidden rounded-lg bg-white/85 px-3 py-2 text-left text-sm font-medium transition"
                >
                  {!categoriaFiltro && (
                    <motion.span
                      layoutId="categoria-filtro-ativo"
                      className="absolute inset-0 rounded-lg bg-[#251a15]"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 38,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${!categoriaFiltro ? "text-[#f8ecde]" : "text-[#5c4438]"}`}
                  >
                    Todas as categorias
                  </span>
                </motion.button>

                {categorias.map((categoria) => {
                  const ativo = String(categoria.id) === categoriaFiltro;

                  return (
                    <motion.button
                      key={categoria.id}
                      layout
                      variants={filterItemVariants}
                      whileHover={{ scale: 1.012, x: 1 }}
                      whileTap={{ scale: 0.985 }}
                      type="button"
                      onClick={() =>
                        aplicarCategoriaRapida(String(categoria.id))
                      }
                      className="relative w-full overflow-hidden rounded-lg bg-white/85 px-3 py-2 text-left text-sm font-medium transition"
                    >
                      {ativo && (
                        <motion.span
                          layoutId="categoria-filtro-ativo"
                          className="absolute inset-0 rounded-lg bg-[#251a15]"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 38,
                          }}
                        />
                      )}

                      <span
                        className={`relative z-10 ${ativo ? "text-[#f8ecde]" : "text-[#5c4438]"}`}
                      >
                        {categoria.nome}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <motion.p
                className="mt-3 px-1 text-[11px] leading-relaxed text-[#7d6352]"
                variants={filterItemVariants}
              >
                Selecione uma categoria e o catalogo sera reposicionado
                automaticamente.
              </motion.p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <motion.section
        id="inicio"
        className="luxury-surface relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10"
        variants={sectionVariants}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="pointer-events-none absolute -left-20 top-10 h-44 w-44 rounded-full bg-[#9b7544]/18 blur-3xl"
          animate={{ y: [0, -12, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 8.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#7e3147]/18 blur-3xl"
          animate={{ y: [0, 14, 0], scale: [1, 1.04, 1] }}
          transition={{
            duration: 9.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.35,
          }}
        />
        <motion.div
          className="pointer-events-none absolute left-[28%] top-[62%] h-44 w-44 rounded-full border border-[#b98f5c]/20"
          animate={{ rotate: [0, 8, 0], scale: [1, 1.03, 1] }}
          transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.div variants={itemVariants}>
            <span className="inline-flex rounded-full border border-[#b99260]/60 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#7a5b3d]">
              Curadoria premium em Prata 925
            </span>
            <h1 className="luxury-title mt-4 text-4xl font-semibold leading-[1.05] text-[#241b16] sm:text-6xl">
              Pratas que convertem no primeiro olhar.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#4d3b32] sm:text-lg">
              Escolha aneis, brincos, pulseiras e conjuntos em uma vitrine
              desenhada para encantar, gerar desejo e acelerar o pedido no
              WhatsApp.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <motion.a
                href="#catalogo"
                className="inline-flex items-center gap-2 rounded-full bg-[#221813] px-6 py-3 text-sm font-semibold text-[#faefe1] transition hover:bg-black"
                {...ctaButtonMotion}
              >
                Quero escolher minha peca
                <ArrowUpRight className="h-4 w-4" />
              </motion.a>
              <motion.a
                href="https://wa.me/5513997033980"
                target="_blank"
                rel="noopener"
                className="inline-flex items-center rounded-full border border-[#c2a27c] bg-white/70 px-6 py-3 text-sm font-semibold text-[#5a4438] transition hover:bg-white"
                {...ctaButtonMotion}
              >
                Falar com consultora
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1"
            variants={itemVariants}
          >
            <motion.div
              className="luxury-surface rounded-3xl p-4"
              variants={itemVariants}
              whileHover={{
                y: -6,
                scale: 1.015,
                boxShadow: "0 22px 38px rgba(40,22,8,0.16)",
              }}
              transition={{ duration: 0.26, ease: animationEase }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#7b5c42]">
                Pecas cadastradas
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#221813]">
                {produtos.length}
              </p>
              <p className="mt-1 text-sm text-[#5f4a3f]">
                Selecao pronta para compra imediata
              </p>
            </motion.div>
            <motion.div
              className="luxury-surface rounded-3xl p-4"
              variants={itemVariants}
              whileHover={{
                y: -6,
                scale: 1.015,
                boxShadow: "0 22px 38px rgba(40,22,8,0.16)",
              }}
              transition={{ duration: 0.26, ease: animationEase }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#7b5c42]">
                Categorias
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#221813]">
                {categorias.length}
              </p>
              <p className="mt-1 text-sm text-[#5f4a3f]">
                Navegacao rapida para achar sua peca ideal
              </p>
            </motion.div>
            <motion.div
              className="luxury-surface rounded-3xl p-4 sm:col-span-2 lg:col-span-1"
              variants={itemVariants}
              whileHover={{
                y: -6,
                scale: 1.015,
                boxShadow: "0 22px 38px rgba(40,22,8,0.16)",
              }}
              transition={{ duration: 0.26, ease: animationEase }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[#7b5c42]">
                Em destaque
              </p>
              <p className="mt-2 text-3xl font-semibold text-[#221813]">
                {destaques.length}
              </p>
              <p className="mt-1 text-sm text-[#5f4a3f]">
                As pecas mais pedidas pelas clientes
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        id="destaques"
        className="mt-14"
        variants={sectionVariants}
        {...inViewProps}
      >
        <motion.div
          className="mb-5 flex flex-wrap items-end justify-between gap-3"
          variants={itemVariants}
        >
          <div className="animate-float-in">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7e5e41]">
              Vitrine em movimento
            </p>
            <h2 className="luxury-title text-4xl font-semibold text-[#241b16]">
              Destaques da semana
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#5f4a3f]">
            Arraste para o lado e clique na peca que chamou sua atencao para
            abrir o detalhe em segundos.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <CarrosselDestaques destaques={destaques} />
        </motion.div>
      </motion.section>

      <motion.section
        id="categorias"
        className="luxury-surface mt-12 rounded-[1.8rem] p-4 sm:p-6"
        variants={sectionVariants}
        {...inViewProps}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <motion.div className="space-y-2" variants={itemVariants}>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7a5d43]">
              <Sparkles className="h-4 w-4" />
              Filtros inteligentes
            </p>
            <h2 className="luxury-title text-3xl font-semibold text-[#241b16]">
              Encontre a joia certa em instantes
            </h2>
            <p className="text-sm text-[#5f4a3f]">{resumoCategoria}</p>
          </motion.div>

          <motion.label
            className="relative w-full max-w-md"
            variants={itemVariants}
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7c5d42]" />
            <input
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Busque por anel, pulseira, descricao ou categoria"
              className="w-full rounded-full border border-[#d7c5ae] bg-white/90 py-3 pl-11 pr-4 text-sm text-[#33251e] outline-none transition focus:border-[#9f7948]"
            />
          </motion.label>
        </div>

        <motion.div variants={itemVariants}>
          <Tabs value={categoriaFiltro || "todas"} className="mt-5 w-full">
            <TabsList className="scrollbar-hide flex w-full flex-nowrap gap-2 overflow-x-auto rounded-full border border-[#dccdb9] bg-[#f9f3e9] p-2">
              <TabsTrigger
                value="todas"
                onClick={() => setCategoriaFiltro("")}
                className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-[#6a4e39] data-[state=active]:border-[#2c211b] data-[state=active]:bg-[#2c211b] data-[state=active]:text-[#f5eadb]"
              >
                Todas
              </TabsTrigger>
              {categorias.map((categoria) => (
                <TabsTrigger
                  key={categoria.id}
                  value={String(categoria.id)}
                  onClick={() => setCategoriaFiltro(String(categoria.id))}
                  className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-[#6a4e39] data-[state=active]:border-[#2c211b] data-[state=active]:bg-[#2c211b] data-[state=active]:text-[#f5eadb]"
                >
                  {categoria.nome}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.p
          className="mt-3 text-xs text-[#7e6553]"
          variants={itemVariants}
        >
          Dica: use a seta lateral animada para abrir o painel e trocar de
          categoria em segundos.
        </motion.p>
      </motion.section>

      <motion.section
        id="catalogo"
        className="mt-10"
        initial={{ opacity: 1, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.58, ease: animationEase }}
      >
        <motion.div
          className="mb-6 flex flex-wrap items-end justify-between gap-3"
          variants={itemVariants}
        >
          <div className="animate-float-in">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7f6042]">
              Colecao ativa
            </p>
            <h2 className="luxury-title text-4xl font-semibold text-[#241b16]">
              Catalogo Bella Pratas
            </h2>
          </div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[#d5c1a7] bg-white/80 px-4 py-2 text-sm font-medium text-[#624938]">
            <Gem className="h-4 w-4" />
            {produtosFiltrados.length} item(ns) encontrado(s)
          </p>
        </motion.div>

        {carregandoProdutos && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="luxury-surface animate-pulse rounded-[1.5rem] p-4"
              >
                <div className="aspect-square rounded-2xl bg-[#e9dece]" />
                <div className="mt-4 h-6 w-3/4 rounded bg-[#e9dece]" />
                <div className="mt-2 h-4 w-full rounded bg-[#f0e7db]" />
                <div className="mt-2 h-4 w-4/5 rounded bg-[#f0e7db]" />
              </div>
            ))}
          </div>
        )}

        {!carregandoProdutos && produtosFiltrados.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {produtosFiltrados.map((produto, index) => (
              <motion.article
                key={produto.id}
                id={`produto-${produto.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.44,
                  delay: getWaveDelay(index),
                  ease: animationEase,
                }}
                className="group luxury-surface rounded-[1.5rem] p-3"
                whileHover={{
                  y: -8,
                  boxShadow: "0 28px 56px rgba(34,18,10,0.2)",
                }}
                whileTap={{ scale: 0.992 }}
              >
                <button
                  type="button"
                  onClick={() => setProdutoSelecionado(produto)}
                  className="w-full text-left"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-[#e3d6c4] bg-white">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={produto.imagem_url}
                        alt={produto.nome}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 46vw, 32vw"
                        quality={60}
                        loading="lazy"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                      <span className="luxury-soft-shimmer absolute inset-y-0 -left-1/2 w-1/2" />
                    </div>
                    <span className="absolute left-3 top-3 rounded-full bg-[#201711]/85 px-3 py-1 text-[11px] font-semibold text-[#f7ecde]">
                      {produto.categorias?.nome || "Sem categoria"}
                    </span>
                  </div>

                  <h3 className="luxury-title mt-4 text-3xl font-semibold leading-[1] text-[#2c2019]">
                    {produto.nome}
                  </h3>

                  <p
                    className="mt-2 text-sm leading-relaxed text-[#5d473b]"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.7rem",
                    }}
                  >
                    {produto.descricao || "Descricao indisponivel."}
                  </p>
                </button>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <p className="text-lg font-semibold text-[#1e1512]">
                    {formatCurrency(produto.preco)}
                  </p>
                  <motion.a
                    href={buildWhatsappLink(produto.nome)}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center rounded-full bg-[#7e3147] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#622437]"
                    whileHover={{ y: -2, scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.2, ease: animationEase }}
                  >
                    Quero esta peca
                  </motion.a>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {!carregandoProdutos && produtosFiltrados.length === 0 && (
          <div className="luxury-surface rounded-[1.8rem] p-10 text-center">
            <p className="text-xl font-semibold text-[#3b2a21]">
              Nenhuma peca foi encontrada com esse filtro.
            </p>
            <p className="mt-2 text-sm text-[#5f4a3f]">
              Troque a categoria ou ajuste a busca para ver novas opcoes
              disponiveis.
            </p>
          </div>
        )}
      </motion.section>

      <motion.a
        href="#inicio"
        aria-label="Voltar ao inicio"
        className="fixed bottom-6 right-6 z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-[#be9b73] bg-[#2a1e17] text-[#f7ebdc] shadow-lg transition hover:bg-black sm:inline-flex"
        animate={{
          y: [0, -3, 0],
          boxShadow: [
            "0 10px 24px rgba(30,18,10,0.2)",
            "0 16px 28px rgba(30,18,10,0.28)",
            "0 10px 24px rgba(30,18,10,0.2)",
          ],
        }}
        transition={{ duration: 2.8, ease: "easeInOut", repeat: Infinity }}
        whileHover={{ scale: 1.08, rotate: 6 }}
        whileTap={{ scale: 0.94 }}
      >
        <ArrowUp className="h-4 w-4" />
      </motion.a>

      <motion.div
        className="mt-14 grid gap-4 rounded-[1.8rem] border border-[#dcccb7] bg-[#fffaf1]/80 p-4 text-sm text-[#584335] sm:grid-cols-3 sm:p-6"
        variants={sectionVariants}
        {...inViewProps}
      >
        <p className="inline-flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-[#7e3147]" />
          Copy e layout focados em aumentar interesse e pedidos.
        </p>
        <p className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#7e3147]" />
          Fluxo administrativo preservado com acesso seguro ao painel do dono.
        </p>
        <p className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#7e3147]" />
          Experiencia boutique, elegante e responsiva em qualquer tela.
        </p>
      </motion.div>

      <Dialog.Root
        open={Boolean(produtoSelecionado)}
        onOpenChange={(open) => {
          if (!open) {
            setProdutoSelecionado(null);
          }
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-50 grid place-items-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#d9cab7] bg-[#fffaf1] p-4 shadow-[0_24px_80px_rgba(18,12,8,0.4)] sm:p-6"
              onClick={(event) => event.stopPropagation()}
            >
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full border border-[#d8c9b5] bg-white/90 text-xl font-semibold text-[#443129] transition hover:bg-white"
                  aria-label="Fechar"
                >
                  x
                </button>
              </Dialog.Close>

              {produtoSelecionado && (
                <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-start">
                  <div className="overflow-hidden rounded-[1.4rem] border border-[#e3d6c4] bg-white">
                    <Image
                      src={produtoSelecionado.imagem_url}
                      alt={produtoSelecionado.nome}
                      width={920}
                      height={920}
                      sizes="(max-width: 768px) 92vw, 55vw"
                      quality={75}
                      className="h-full max-h-[520px] w-full object-cover"
                    />
                  </div>

                  <div className="pt-8 md:pt-4">
                    <p className="inline-flex rounded-full border border-[#c9ae8d] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#6c4f38]">
                      {produtoSelecionado.categorias?.nome || "Sem categoria"}
                    </p>

                    <Dialog.Title asChild>
                      <h2 className="luxury-title mt-4 text-4xl font-semibold leading-[0.95] text-[#261b16]">
                        {produtoSelecionado.nome}
                      </h2>
                    </Dialog.Title>

                    <p className="mt-4 text-sm leading-relaxed text-[#5b453a]">
                      {produtoSelecionado.descricao ||
                        "Descricao indisponivel para este item."}
                    </p>

                    <p className="mt-6 text-3xl font-semibold text-[#1f1714]">
                      {formatCurrency(produtoSelecionado.preco)}
                    </p>

                    <a
                      href={buildWhatsappLink(produtoSelecionado.nome)}
                      target="_blank"
                      rel="noopener"
                      className="mt-6 inline-flex rounded-full bg-[#7e3147] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#612336]"
                    >
                      Reservar no WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {!produtoSelecionado && (
                <p className="py-16 text-center text-sm text-[#5f4a3f]">
                  Selecione um produto para ver detalhes.
                </p>
              )}

              {produtoSelecionado && (
                <div className="mt-5 rounded-2xl border border-[#e4d8c8] bg-white/75 px-4 py-3 text-xs text-[#644d3f]">
                  Clique em Reservar no WhatsApp para atendimento rapido e
                  prioridade no pedido.
                </div>
              )}
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
