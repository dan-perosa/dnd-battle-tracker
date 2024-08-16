"use client";

import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'username': username,
          'password': password,
        },
      });

      if (response.status === 200) {
        // Lógica de sucesso, por exemplo, redirecionar para a página principal ou dashboard
        const data = await response.json();
        const token = data.token; // Supondo que a resposta inclua um campo 'token'
        const userId = data.id
        localStorage.setItem('authToken', token); // Armazena o token no localStorage
        localStorage.setItem('userId', userId); // Armazena o token no localStorage
        router.push('/')
        console.log('Login bem-sucedido');
      } else {
        const data = await response.json();
        if (data.erro) {
          setErrorMessage(data.erro); // Atualizar a mensagem de erro com base na resposta da API
        } else {
          setErrorMessage('Ocorreu um erro desconhecido.'); // Mensagem de erro padrão
        }
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErrorMessage('Erro ao fazer login. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
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
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Login
          </button>
          {/* Exibição da mensagem de erro abaixo do botão */}
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

export default LoginPage;
