'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { UserIcon } from '@heroicons/react/24/solid';

export default function Header() {
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    async function verificarLogin() {
      const { data } = await supabase.auth.getUser();
      setAutenticado(!!data?.user);
    }
    verificarLogin();
  }, []);

  async function handleAdminClick() {
    if (autenticado) {
      window.location.href = '/pagina-administrativa';
    } else {
      window.location.href = '/login';
    }
  }

  return (
    <header className="bg-black py-4 px-6 flex items-center justify-between">
      <img
        src="https://vjjcrivjvwaqjvmbfueq.supabase.co/storage/v1/object/public/produtos/Imagens-do-site/logo.webp"
        alt="Bella Pratas"
        className="h-12 cursor-pointer"
        onClick={() => window.location.href = '/'}
      />
      <button
        onClick={handleAdminClick}
        className="bg-gray-600 p-3 rounded-full hover:bg-gray-700 transition flex items-center justify-center"
        aria-label="Painel Administrativo"
      >
        <UserIcon className="h-6 w-6 text-white" />
      </button>
    </header>
  );
}