"use client";

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Battle {
    id: number;
    name: string;
    participant_list: string[];
}

interface BattleDelete {
    owner_id: number;
    battle_id: number;
    battle_name: string;
}

interface ReturnedBattleInfo {
  battle_status: string;
  participant_characters: string;
  participant_monsters: string;
  battle_id: number
}

const BattlesPage: React.FC = () => {
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedBattles, setSelectedBattles] = useState<BattleDelete[]>([]);
  const router = useRouter();

  useEffect(() => { 
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const fetchBattles = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/battle/show', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner_id: userId }), // Enviar o ID do usuário para a API
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const processedBattles = data.user_battles.map((battle: any) => ({
        id: battle.id,
        name: battle.name,
        participant_list: battle.participant_list.split(',').map((participant: string) => participant.trim()), // Divide a string em array e remove espaços extras
      }));

      setBattles(processedBattles); // Atualiza o estado com as batalhas recebidas
    } catch (error) {
      console.error('Error fetching battles:', error);
    } finally {
      setLoading(false);
    }
  };

  const decideHandleBattle = async (battle_id: number) => {
    try {
      console.log(JSON.stringify({ owner_id: userId, battle_id: battle_id}))
      const response = await fetch('http://127.0.0.1:8000/battle/check_if_ongoing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner_id: userId, battle_id: battle_id}), // Enviar o ID do usuário para a API
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const battle_info: ReturnedBattleInfo = {'battle_status': data.status,
                           'participant_characters': data.participant_characters,
                           'participant_monsters': data.participant_monsters,
                           'battle_id': data.id,
      }
      return battle_info

    } catch (error) {
      console.error('Error fetching battles:', error);
    } 
  };

  const transformBattleToOngoing = async (battle_info: ReturnedBattleInfo) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/battle/transform_to_ongoing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner_id: userId, 
                               battle_id: battle_info.battle_id,
                               participant_characters: battle_info.participant_characters,
                               participant_monsters: battle_info.participant_monsters,
                               status: 'initiative_roll'}),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const battle_status: string = data.battle_status
      return battle_status

    } catch (error) {
      console.error('Error fetching battles:', error);
    } 
  };

  const handleDeleteBattles = () => {
    setIsDeleting(true);
  };

  const handleEnterBattleButton = async (battle_id: number) => {
    const battle_info = await decideHandleBattle(battle_id)
    console.log(battle_info)
    if (battle_info && battle_info.battle_status == 'not_started') {
      transformBattleToOngoing(battle_info)
      router.push(`/battle/show/${battle_id}`)
    }
    else if (battle_info && battle_info.battle_status == 'initiative_roll') {
      router.push(`/battle/show/${battle_id}`)
    }
    else if (battle_info && battle_info.battle_status == 'after_initiative') {
      router.push(`/battle/show/after_initiative/${battle_id}`)
    }
  };

  const handleToggleSelect = (battle: Battle) => {
    setSelectedBattles((prev: BattleDelete[]) => {
      // Verifica se a batalha já está selecionada
      const isSelected = prev.some(item => item.battle_id === battle.id);
  
      if (isSelected) {
        // Remove a batalha do array de seleção
        return prev.filter(item => item.battle_id !== battle.id);
      } else {
        // Adiciona a batalha no início do array de seleção
        const newSelection: BattleDelete[] = [{
          owner_id: Number(userId), // Converte userId para número
          battle_id: battle.id,
          battle_name: battle.name
        }, ...prev];
        return newSelection;
      }
    });
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setSelectedBattles([]);
  };

  const handleDeleteSelected = async () => {
    try {
      // Mapeia as batalhas selecionadas para um array de promessas
      const deletePromises = selectedBattles.map(async (battle) => {
        const response = await fetch('http://127.0.0.1:8000/battle/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            owner_id: battle.owner_id,
            battle_name: battle.battle_name,
            battle_id: battle.battle_id,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      });
  
      // Aguarda todas as promessas de exclusão serem resolvidas
      await Promise.all(deletePromises);
  
      // Recarrega as batalhas após a exclusão
      fetchBattles();
  
      // Reseta o estado de exclusão e seleção
      setIsDeleting(false);
      setSelectedBattles([]);
    } catch (error) {
      console.error('Error deleting selected battles:', error);
    }
  };

  useEffect(() => {
    fetchBattles();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center overflow-auto p-6">
      <Head>
        <title>Minhas Batalhas</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-3xl font-bold mb-6">Minhas Batalhas</h1>

      <div className="flex space-x-4 mb-6">
        {!isDeleting ? (
          <>
            <button
              onClick={() => router.push('/battle/create')} // Redireciona para a página de criação de batalhas
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Criar Nova Batalha
            </button>
            <button
              onClick={handleDeleteBattles}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Deletar Batalhas
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              disabled={selectedBattles.length === 0}
            >
              Deletar Selecionadas
            </button>
            <button
              onClick={handleCancelDelete}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Cancelar
            </button>
          </>
        )}
      </div>

      <div className="w-full max-w-3xl">
        {battles.length === 0 ? (
          <p className="text-center">Você ainda não tem batalhas.</p>
        ) : (
          <ul className="space-y-4">
            {battles.map((battle) => (
              <li
                key={battle.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
              >
                {isDeleting && (
                  <input
                    type="checkbox"
                    checked={selectedBattles.some(item => item.battle_id === battle.id)}
                    onChange={() => handleToggleSelect(battle)}
                    className="mr-4"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{battle.name}</h2>
                  <p className="mt-2 text-gray-400">Participantes: {battle.participant_list.join(', ')}</p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleEnterBattleButton(battle.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Entrar na Batalha
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BattlesPage;
