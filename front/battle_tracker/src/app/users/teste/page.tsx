// pages/dashboard.tsx

import Head from 'next/head';
import AuthGuard from '../../../../components/AuthGuard';

const DashboardPage: React.FC = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Head>
          <title>Dashboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>
          <p>Bem-vindo ao seu painel de controle!</p>
        </main>
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;