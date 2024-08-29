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
    checkAuth();
  }, []);

  const handleCreateAccount = () => {
    router.push('/users/create_user');
  };

  const handleLogin = () => {
    router.push('/users/login_user');
  };

  const handleViewBattles = () => {
    router.push('/battle/show');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    router.push('/');
  };

  const handleCreateBattle = () => {
    router.push('/battle/create');
  };

  const handleCreateCharacter = () => {
    router.push('/character/create');
  };

  const handleShowCharacters = () => {
    router.push('/character/show_all');
  };

  const handleChangePassword = () => {
    router.push('/users/change_password');
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
        <div className="flex flex-col items-center space-y-4">
          {!isAuthenticated ? (
            <>
              <button
                onClick={handleCreateAccount}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Criar Conta
              </button>
              <button
                onClick={handleLogin}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Login
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleCreateBattle}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Criar Batalha
              </button>
              <button
                onClick={handleCreateCharacter}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Criar Personagem
              </button>
              <button
                onClick={handleChangePassword}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Trocar Senha
              </button>
              <button
                onClick={handleViewBattles}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Ver Batalhas
              </button>
              <button
                onClick={handleShowCharacters}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Ver Personagens
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
