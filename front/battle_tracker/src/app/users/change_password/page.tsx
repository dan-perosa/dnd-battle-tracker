"use client";

import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/users/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          username: username,
          email: email,
          password: password,
        }),
      });

      if (response.status === 200) {
        // Se a resposta for OK, limpar os campos e a mensagem de erro
        setFirstName('');
        setLastName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setErrorMessage(''); // Limpar mensagem de erro se a criação foi bem-sucedida
        console.log('Conta criada com sucesso');
        router.push('/users/login_user');
      } else {
        // Caso contrário, tratar o erro
        const data = await response.json();
        if (data.erro) {
          setErrorMessage(data.erro); // Atualizar a mensagem de erro com base na resposta da API
        } else {
          setErrorMessage('Ocorreu um erro desconhecido.'); // Mensagem de erro padrão
        }
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      setErrorMessage('Erro ao criar conta. Verifique o console para mais detalhes.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <Head>
        <title>Criar Conta</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Criar Conta</h1>
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
            <label htmlFor="firstName" className="block text-sm font-medium">Primeiro Nome</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400"
              placeholder="Seu primeiro nome"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium">Último Nome</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400"
              placeholder="Seu último nome"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400"
              placeholder="Seu email"
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
            Criar Conta
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
