"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Character {
  id: number;
  name: string;
  class_name: string;
  race: string;
  level: number;
  hp_max: number;
  hp_current: number;
  ac: number;
  initiative: number;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  status: string;
  owner_id: number;
}

interface DeleteCharacters {
  owner_id: number;
  character_name: string;
  character_id: number;
}

const ShowCharactersPage: React.FC = () => {
  const [userCharacters, setUserCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<DeleteCharacters[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const fetchUserCharacters = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/character/show', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner_id: userId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setUserCharacters(Array.isArray(data.user_characters) ? data.user_characters : []);
    } catch (error) {
      console.error('Error fetching user characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCharacters = () => {
    setIsDeleting(true);
  };

  const handleToggleSelect = (character: Character) => {
    setSelectedCharacters(prev => {
      // Verifica se o personagem já está selecionado
      const isSelected = prev.some(item => item.character_id === character.id);

      if (isSelected) {
        // Remove o personagem do array de seleção
        return prev.filter(item => item.character_id !== character.id);
      } else {
        // Adiciona o personagem no array de seleção
        return [
          {
            owner_id: Number(userId), // Converte userId para número
            character_id: character.id,
            character_name: character.name
          },
          ...prev
        ];
      }
    });
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
    setSelectedCharacters([]);
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedCharacters.map(async (character) => {
        const response = await fetch('http://127.0.0.1:8000/character/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            owner_id: Number(userId),
            character_name: character.character_name,
            character_id: character.character_id
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      }));

      fetchUserCharacters();
      setIsDeleting(false);
      setSelectedCharacters([]);
    } catch (error) {
      console.error('Error deleting selected characters:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserCharacters();
    }
  }, [userId]);

  if (loading) {
    return <div className="w-screen h-screen bg-gray-900 text-white flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6">Seus Personagens</h1>

      <div className="flex space-x-4 mb-6">
        {!isDeleting ? (
          <>
            <button
              onClick={() => router.push('/character/create')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Criar Personagem
            </button>
            <button
              onClick={handleDeleteCharacters}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
            >
              Deletar Personagens
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              disabled={selectedCharacters.length === 0}
            >
              Deletar Selecionados
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

      <div className="w-full max-w-6xl">
        {userCharacters.length === 0 ? (
          <div className="text-center">Nenhum personagem encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {userCharacters.map((character) => (
              <div
                key={character.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col"
              >
                {isDeleting && (
                  <input
                    type="checkbox"
                    checked={selectedCharacters.some(item => item.character_id === character.id)}
                    onChange={() => handleToggleSelect(character)}
                    className="mb-4"
                  />
                )}
                <h2 className="text-xl font-bold mb-2 underline text-center">{character.name}</h2>
                <p><strong>Classe:</strong> {character.class_name}</p>
                <p><strong>Raça:</strong> {character.race}</p>
                <p><strong>Nível:</strong> {character.level}</p>
                <p><strong>HP Máximo:</strong> {character.hp_max}</p>
                <p><strong>AC:</strong> {character.ac}</p>
                <p><strong>Iniciativa:</strong> {character.initiative}</p>
                <p><strong>Força:</strong> {character.strength}</p>
                <p><strong>Destreza:</strong> {character.dexterity}</p>
                <p><strong>Constituição:</strong> {character.constitution}</p>
                <p><strong>Inteligência:</strong> {character.intelligence}</p>
                <p><strong>Sabedoria:</strong> {character.wisdom}</p>
                <p><strong>Carisma:</strong> {character.charisma}</p>
                <div className='flex flex-col self-center items-center'>
                  <p><strong>Status:</strong></p>
                  <p>{character.status}</p>
                </div>
                <div className="mt-auto flex justify-between items-center self-center">
                  <button
                    onClick={() => router.push(`/character/edit/${character.id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowCharactersPage;
