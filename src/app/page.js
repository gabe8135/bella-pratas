"use client";
import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Heart,
  Search,
  X,
  Sparkles,
  Gem,
  Sun,
  Droplets,
  Box,
} from "lucide-react";
import { products, categories } from "@/lib/products";
import GlareButton from "@/components/GlareButton";
function productWhatsappUrl(product) {
  const message = `Olá! Vi a peça ${product.name} no site da Bella Pratas e gostaria de comprar. Pode me informar o valor e a disponibilidade?`;
  return `https://wa.me/5513997033980?text=${encodeURIComponent(message)}`;
}
const desktopQuery = "(min-width: 1024px)";
function subscribeDesktop(callback) {
  const query = window.matchMedia(desktopQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getDesktop = () => window.matchMedia(desktopQuery).matches;
const getServerDesktop = () => false;
function Reveal({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65 }}
    >
      {children}
    </motion.div>
  );
}
export default function Home() {
  const desktop = useSyncExternalStore(subscribeDesktop, getDesktop, getServerDesktop);
  const reducedMotion = useReducedMotion();
  const [category, setCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const normalized = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = products.filter(
    (p) =>
      (category === "Todas" || p.category === category) &&
      normalized(p.name + " " + p.category).includes(normalized(search)) &&
      (!onlyFavorites || favorites.includes(p.id)),
  );
  const visible = expanded ? filtered : filtered.slice(0, 8);
  const favorite = (id) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  return (
    <MotionConfig reducedMotion="user">
      <div id="inicio">
        <section className="hero">
          <div className="hero-copy">
            <Reveal>
              <span className="eyebrow">
                <span className="tiny-line" /> O EXTRAORDINÁRIO ESTÁ NOS DETALHES
              </span>
              <h1>
                Feita de prata.
                <br />
                Cheia de <em>você.</em>
              </h1>
              <p>
                Joias que não pedem uma ocasião especial.
                <br className="desktop-break" /> Elas fazem de cada dia uma.
              </p>
              <GlareButton as="a" href="#colecao" className="button button-dark">
                Descubra a coleção <ArrowUpRight size={18} />
              </GlareButton>
              <div className="hero-footnote">
                <span className="mini-star">✳</span>
                <span>
                  Leve no toque.
                  <br />
                  <strong>Eterna no significado.</strong>
                </span>
              </div>
            </Reveal>
          </div>
          <div className="hero-photo">
            <Image
              src="/1752534044231-anel2.jpg"
              alt="Anel de prata com detalhes Bali sobre tecido acetinado"
              fill
              priority
              sizes="(max-width: 700px) 100vw, 55vw"
            />
            <div className="photo-top">
              <span>THE EVERYDAY COLLECTION</span>
              <span>ACERVO Nº 01</span>
            </div>
            <span className="photo-note">Um brilho só seu.</span>
            <a className="photo-bottom" href="#colecao">
              <span>UM NOVO OLHAR PARA O ESSENCIAL</span>
              <span className="round-arrow">
                <ArrowDown size={18} />
              </span>
            </a>
          </div>
        </section>
        <div className="values-strip">
          <span>Beleza que acompanha você</span>
          <Sparkles size={16} />
          <span>Essência atemporal</span>
          <Sparkles size={16} />
          <span>Detalhes com significado</span>
          <Sparkles size={16} />
          <span>Sua próxima peça favorita</span>
        </div>
        <section id="colecao" className="collection section-wrap">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">ESCOLHAS QUE DIZEM MUITO</span>
              <h2>
                Seu jeito de <em>brilhar.</em>
              </h2>
            </div>
            <p>
              Do primeiro detalhe à sua combinação favorita.
              <br />
              Encontre as peças que têm a ver com você.
            </p>
          </Reveal>
          <div className="catalog-toolbar">
            <div className="category-tabs" aria-label="Categorias">
              {categories.map((c) => (
                <GlareButton
                  key={c}
                  className={c === category ? "active" : ""}
                  aria-pressed={c === category}
                  onClick={() => {
                    setCategory(c);
                    setExpanded(false);
                  }}
                >
                  {c}
                </GlareButton>
              ))}
            </div>
            <div className="search-controls">
              <label className="search-field">
                <Search size={16} />
                <input
                  aria-label="Buscar joias"
                  placeholder="Encontre sua joia"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <GlareButton aria-label="Limpar busca" onClick={() => setSearch("")}>
                    <X size={14} />
                  </GlareButton>
                )}
              </label>
              <GlareButton
                className={`icon-button favorite-filter ${onlyFavorites ? "selected" : ""}`}
                aria-label="Mostrar favoritos"
                aria-pressed={onlyFavorites}
                onClick={() => setOnlyFavorites(!onlyFavorites)}
              >
                <Heart size={18} fill={onlyFavorites ? "currentColor" : "none"} />
                <span>{favorites.length}</span>
              </GlareButton>
            </div>
          </div>
          <div className="results-meta" aria-live="polite">
            <span>
              {filtered.length} {filtered.length === 1 ? "peça" : "peças"} para descobrir
            </span>
            <span>CURADORIA BELLA PRATAS</span>
          </div>
          <div className="product-grid">
            {visible.map((p, i) => (
              <motion.article
                key={p.id}
                className="product-card"
                initial={reducedMotion ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.65,
                  delay: desktop && !reducedMotion ? (i % 4) * 0.14 : 0,
                }}
              >
                <div className="product-image">
                  <GlareButton
                    className="product-open"
                    onClick={() => setSelected(p)}
                    aria-label={`Ver detalhes de ${p.name}`}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 700px) 50vw, (max-width: 1000px) 33vw, 25vw"
                    />
                    <span className="view-piece">
                      Conheça a peça <ArrowUpRight size={16} />
                    </span>
                  </GlareButton>
                  {i === 0 && <span className="product-tag">ESCOLHA BELLA</span>}
                  <GlareButton
                    className="favorite-button"
                    aria-label={`${favorites.includes(p.id) ? "Remover" : "Adicionar"} ${p.name} ${favorites.includes(p.id) ? "dos" : "aos"} favoritos`}
                    aria-pressed={favorites.includes(p.id)}
                    onClick={() => favorite(p.id)}
                  >
                    <Heart size={17} fill={favorites.includes(p.id) ? "currentColor" : "none"} />
                  </GlareButton>
                </div>
                <div className="product-info">
                  <span>{p.category}</span>
                  <GlareButton onClick={() => setSelected(p)}>
                    <h3>{p.name}</h3>
                    <ArrowUpRight size={17} />
                  </GlareButton>
                </div>
              </motion.article>
            ))}
          </div>
          {!filtered.length && (
            <div className="empty-state">
              <Gem size={32} />
              <h3>
                {onlyFavorites ? "Sua seleção começa aqui." : "Ainda não encontramos essa joia."}
              </h3>
              <p>
                {onlyFavorites
                  ? "Toque no coração das peças que você ama."
                  : "Experimente outro nome ou explore todas as categorias."}
              </p>
              <GlareButton
                className="button button-outline"
                onClick={() => {
                  setSearch("");
                  setCategory("Todas");
                  setOnlyFavorites(false);
                }}
              >
                Explorar a coleção <ArrowRight size={16} />
              </GlareButton>
            </div>
          )}
          {filtered.length > 8 && (
            <div className="collection-more">
              <GlareButton className="button button-outline" onClick={() => setExpanded(!expanded)}>
                {expanded ? "Ver menos peças" : "Explore mais peças"}{" "}
                <ArrowDown
                  size={16}
                  style={{ transform: expanded ? "rotate(180deg)" : undefined }}
                />
              </GlareButton>
            </div>
          )}
        </section>
        <section id="essencia" className="essence">
          <div className="essence-photo">
            <Image
              src="/1752763227126-Pingentedepena.webp"
              alt="Pingente de pena em prata sobre tecido claro"
              fill
              sizes="(max-width:700px) 100vw, 50vw"
            />
            <span>BELEZA EM SUA FORMA MAIS LEVE</span>
          </div>
          <Reveal className="essence-copy">
            <span className="eyebrow">A ESSÊNCIA BELLA</span>
            <h2>
              Não é só sobre joias.
              <br />É sobre o que elas
              <br />
              <em>fazem sentir.</em>
            </h2>
            <p>
              Aquela peça que vira parte de você. Que guarda uma lembrança, celebra uma conquista ou
              simplesmente deixa a terça-feira mais bonita.
            </p>
            <p>
              Acreditamos na beleza que acontece naturalmente. No brilho discreto. Na liberdade de
              misturar, experimentar e ser quem você é.
            </p>
            <a href="#colecao" className="text-link">
              Encontre algo que é a sua cara <ArrowUpRight size={18} />
            </a>
            <span className="signature">Com carinho, Bella.</span>
          </Reveal>
        </section>
        <section className="care section-wrap" id="cuidado">
          <Reveal className="section-heading">
            <div>
              <span className="eyebrow">PARA FICAR COM VOCÊ</span>
              <h2>
                O brilho também merece <em>cuidado.</em>
              </h2>
            </div>
          </Reveal>
          <div className="care-grid">
            {[
              [
                Droplets,
                "01",
                "Menos química, mais brilho",
                "Evite o contato com perfumes, cremes e produtos de limpeza. Vista suas joias por último.",
              ],
              [
                Sun,
                "02",
                "Uma pausa faz bem",
                "Retire suas peças antes do banho, da piscina e de atividades físicas.",
              ],
              [
                Box,
                "03",
                "Um lugar só delas",
                "Guarde cada peça separadamente, em um local seco e protegido da luz.",
              ],
            ].map(([Icon, n, title, description]) => (
              <Reveal key={n} className="care-card">
                <div>
                  <Icon size={24} strokeWidth={1} />
                  <span>{n}</span>
                </div>
                <h3>{title}</h3>
                <p>{description}</p>
              </Reveal>
            ))}
          </div>
        </section>
        <section className="closing">
          <span className="eyebrow">SEU ESTILO. SUA HISTÓRIA.</span>
          <h2>
            O próximo detalhe
            <br />é <em>todo seu.</em>
          </h2>
          <GlareButton as="a" href="#colecao" className="button button-dark">
            Encontre sua peça favorita <ArrowUpRight size={18} />
          </GlareButton>
          <span className="closing-star" aria-hidden="true">
            ✳
          </span>
        </section>
        <Dialog.Root
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        >
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="product-dialog">
              {selected && (
                <>
                  <div className="dialog-image">
                    <Image
                      src={selected.image}
                      alt={selected.name}
                      fill
                      sizes="(max-width:700px) 90vw, 420px"
                    />
                  </div>
                  <div className="dialog-copy">
                    <span className="eyebrow">{selected.category} · BELLA PRATAS</span>
                    <Dialog.Title>{selected.name}</Dialog.Title>
                    <Dialog.Description>{selected.description}</Dialog.Description>
                    <GlareButton as="a" className="button button-dark" href={productWhatsappUrl(selected)} target="_blank" rel="noopener noreferrer">
                      Comprar pelo WhatsApp <ArrowUpRight size={18} />
                    </GlareButton>
                    <GlareButton
                      className="button button-outline"
                      onClick={() => favorite(selected.id)}
                    >
                      <Heart
                        size={18}
                        fill={favorites.includes(selected.id) ? "currentColor" : "none"}
                      />
                      {favorites.includes(selected.id)
                        ? "Remover dos favoritos"
                        : "Guardar nos favoritos"}
                    </GlareButton>
                  </div>
                  <Dialog.Close asChild>
                    <GlareButton className="dialog-close icon-button" aria-label="Fechar detalhes">
                      <X size={22} />
                    </GlareButton>
                  </Dialog.Close>
                </>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </MotionConfig>
  );
}
