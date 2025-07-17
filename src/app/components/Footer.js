export default function Footer() {
  return (
    <footer className="mt-16 py-4 px-2 text-center bg-black text-white text-[0.7rem]">
      <div>
        <span className="text-[0.7rem] font-semibold">
          Bella Pratas © {new Date().getFullYear()} - Todos os direitos reservados
        </span>
        <div>
          Feito com <span className="text-red-700">♥</span> de Gabriel para{' '}
          <a href="https://instagram.com/bellapratas.br" target="_blank" rel="noopener">Sellane</a>
        </div>
      </div>
      <div className="text-[0.7rem] mt-2">
        <a href="https://wa.me/5513997033980" target="_blank" rel="noopener" className="text-gray-400 hover:underline">
          <i className="fab fa-whatsapp"></i> Fale conosco
        </a>
      </div>
    </footer>
  );
}