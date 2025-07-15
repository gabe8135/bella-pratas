export default function Footer() {
  return (
    <footer className="mt-16 py-4 text-center bg-black text-white text-sm ">
      <div>
        <span className="text-sm font-semibold">Bella Pratas</span> © {new Date().getFullYear()} Todos os direitos reservados | Feito com <span className="text-red-700">♥</span> de Gabriel para <a href="https://instagram.com/bellapratas" target="_blank" rel="noopener" >Sellane</a>
      </div>
      <div className="text-sm mt-2">
        <a href="https://wa.me/5513997033980" target="_blank" rel="noopener" className="text-gray-400 hover:underline">
          <i className="fab fa-whatsapp"></i> Fale conosco
        </a>
      </div>
    </footer>
  );
}