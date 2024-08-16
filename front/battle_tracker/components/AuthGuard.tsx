// components/AuthGuard.tsx

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Função para verificar se o token está presente e é válido
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');

        // Se não houver token, redireciona para a página de login
        if (!token) {
          router.push('/users/login_user');
          return;
        }

        // Aqui você pode fazer uma chamada à API para validar o token, se necessário
        // Exemplo de validação simples
        const response = await fetch('http://127.0.0.1:8000/validate_token', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token inválido, redireciona para a página de login
          router.push('/users/login_user');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        router.push('/users/login_user');
      }
    };

    checkAuth();
  }, [router]);

  // Exibe o conteúdo se o usuário estiver autenticado
  if (isAuthenticated === null) {
    return <p>Loading...</p>; // Você pode usar um spinner ou uma tela de carregamento
  }

  return <>{children}</>;
};

export default AuthGuard;