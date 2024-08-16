"use client";

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Index() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);


  const checkAuth = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verifica a autenticação na montagem do componente
    checkAuth();
  }, []);

  const handleCreateAccount = () => {
    router.push('/users/create_user'); // Redireciona para a página de criação de conta
  };

  const handleLogin = () => {
    router.push('/users/login_user'); // Redirecionar para a página de login (certifique-se de adicionar a página de login)
  };
  const handleViewBattles = () => {
    router.push('/battle/show'); // Redirecionar para a página de login (certifique-se de adicionar a página de login)
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Remove o token de autenticação
    localStorage.removeItem('userId'); // Remove o token de autenticação
    setIsAuthenticated(false); // Atualiza o estado de autenticação
    router.push('/'); // Redireciona para a página inicial
  };

  const handleCreateBattle = () => {
    router.push('/battle/create'); // Redirecionar para a página de login (certifique-se de adicionar a página de login)
  };

  const handleCreateCharacter = () => {
    router.push('/character/create'); // Redirecionar para a página de login (certifique-se de adicionar a página de login)
  };

  const handleShowCharacters = () => {
    router.push('/character/show_all'); // Redirecionar para a página de login (certifique-se de adicionar a página de login)
  };

  if (loading) {
    return <div className="w-screen h-screen bg-gray-900 text-white flex items-center justify-center">Carregando...</div>;
  }


  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <Head>
        <title>Tracker de Batalhas D&D</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-8">Bem-vindo ao Tracker de Batalhas D&D</h1>
        <p className="text-lg mb-8">Gerencie suas batalhas de Dungeons & Dragons de forma eficiente!</p>
        <div className="flex justify-center space-x-4">
        {!isAuthenticated ? (
            <>
              <button
                onClick={handleCreateAccount}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Criar Conta
              </button>
              <button
                onClick={handleLogin}
                className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Login
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCreateBattle}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Criar Batalha
              </button>
              <button
                onClick={handleCreateCharacter}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Criar Personagem
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Logout
              </button>
              <button
                onClick={handleViewBattles}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                 Ver batalhas
              </button>
              <button
                onClick={handleShowCharacters}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                 Ver personagens
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
