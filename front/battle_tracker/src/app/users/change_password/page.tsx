"use client";

import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/users/change_password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (data.erro) {
        setErrorMessage(data.erro);
      } else {
        localStorage.removeItem('authToken'); // Remove o token de autenticação
        localStorage.removeItem('userId'); // Remove o token de autenticação
        router.push('/users/login_user');
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      setErrorMessage('Erro ao criar conta. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <Head>
        <title>Trocar senha</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Trocar Senha</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium">Nome de Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400"
              placeholder="Seu nome de usuário"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400"
              placeholder="Sua senha"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium">Senha</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400"
              placeholder="Sua senha"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Trocar senha
          </button>
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-600 text-white rounded-md text-center">
              {errorMessage}
            </div>
          )}
        </form>
      </main>
    </div>
  );
};

export default RegisterPage;
