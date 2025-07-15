export default function Footer() {
  return (
    <footer className="bg-black py-6 mt-12 text-center text-white border-t">
      <div>
        <span className="font-semibold">Bella Pratas</span> © {new Date().getFullYear()} Todos os direitos reservados | Feito com <span className="text-pink-500">♥</span> de Gabriel para <a href="https://instagram.com/bellapratas" target="_blank" rel="noopener" >Sellane</a>
      </div>
      <div className="mt-2">
        <a href="https://wa.me/5513997033980" target="_blank" rel="noopener" className="text-green-600 hover:underline">
          <i className="fab fa-whatsapp"></i> Fale conosco
        </a>
      </div>
    </footer>
  );
}