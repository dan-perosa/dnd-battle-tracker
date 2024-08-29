"use client";

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CreateBattlePage: React.FC = () => {
  const [view, setView] = useState<'initial' | 'characters' | 'selected' | 'monsters'>('initial');
  const [selectedItems, setSelectedItems] = useState<{ id: string, name: string }[]>([]) // Alterar tipo conforme necessidade
  const [viewFinal, setViewFinal] = useState<true | false>(false)
  const [activeBoard, setActiveBoard] = useState<'characters' | 'monsters'>()
  const [userCharacters, setUserCharacters] = useState<{id: string, name: string}[]>([]);
  const [allMonsters, setAllMonsters] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>();
  const [battleName, setBattleName] = useState('');
  const [participantCharacters, setParticipantCharacters] = useState<{ id: string, name: string }[]>([])
  const [participantMonsters, setParticipantMonsters] = useState<{ id: string, name: string }[]>([])
  const router = useRouter();

  const fetchUserCharacters = async () => {
    try {
      console.log(JSON.stringify({ owner_id: userId }))
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
      setUserCharacters(data.user_characters); // Atualiza o estado com os dados recebidos
      console.log(data)
      console.log(userCharacters)
    } catch (error) {
      console.error('Error fetching user characters:', error);
    } finally {
      setLoading(false); // Atualiza o estado de carregamento para false após a tentativa de busca
    }
  };
  
  
  const fetchAllMonsters = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/monster/show', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setAllMonsters(data.monster_list); // Atualiza o estado com os dados recebidos
    } catch (error) {
      console.error('Error fetching user characters:', error);
    } finally {
      setLoading(false); // Atualiza o estado de carregamento para false após a tentativa de busca
    }
  };

  useEffect(() => { 
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    fetchUserCharacters();
  }, [userId]);
  
  useEffect(() => {
    fetchAllMonsters();
  }, []);
  

  const handleCreateBattle = async () => {
    const mappedList = selectedItems.map(item => item.name)
    const mappedStringList = mappedList.join(', ')
    const mappedCharacters = participantCharacters.map(item => item.name)
    const mappedStringCharacters = mappedCharacters.join(', ')
    const mappedMonsters = participantMonsters.map(item => item.name)
    const mappedStringMonsters = mappedMonsters.join(', ')
    try {
      const response = await fetch('http://127.0.0.1:8000/battle/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: battleName,
          participant_list: mappedStringList,
          participant_monsters: mappedStringMonsters,
          participant_characters: mappedStringCharacters,
          owner_id: userId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      router.push('/battle/show')
    } catch (error) {
      console.error('Error fetching user characters:', error);
    } 
  };

  const handleAddCharacter = () => {
    setView('characters');
    setActiveBoard('characters');
    console.log(view, viewFinal, userCharacters, userId)
  };

  const handleAddMonster = () => {
    setView('monsters');
    setActiveBoard('monsters');
    console.log(view, viewFinal)
  };

  const handleSelectCharacter = (id: string, item: string) => {
    // Adiciona o item selecionado à lista
    setSelectedItems(prev => [...prev, {id: id, name:item }]);
    setParticipantCharacters(prev => [...prev, {id: id, name:item }]);
    setView('selected');
    setViewFinal(true);
    console.log(participantCharacters, participantMonsters)

  };

  const handleSelectMonster = (id: string, item: string) => {
    // Adiciona o item selecionado à lista
    setSelectedItems(prev => [...prev, {id: id, name:item }]);
    setParticipantMonsters(prev => [...prev, {id: id, name:item }]);
    setView('selected');
    setViewFinal(true);
    console.log(participantCharacters, participantMonsters)

  };

  const handleDeleteSelected = (index: number, item: string) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));

    setParticipantCharacters(prev =>
      prev.filter(character => character.name !== item)
    );

    setParticipantMonsters(prev =>
      prev.filter(character => character.name !== item)
    );

    console.log(participantCharacters, participantMonsters)
  };


  const transformClassInitial = (view === 'initial' && viewFinal === false)
  ? 'translate-x-0'
  : view === 'characters' && viewFinal === false
  ? 'translate-x-[-55%]'
  : view === 'monsters' && viewFinal === false
  ? 'translate-x-[-55%]'
  : view === ('characters') && viewFinal === true
  ? 'translate-x-[-110%]'
  : view === ('monsters') && viewFinal === true
  ? 'translate-x-[-110%]'
  : 'translate-x-[-110%]';


  const transformClassCharacters = (view === 'initial' && viewFinal === false)
  ? 'translate-x-[900%]'
  : view === 'characters' && viewFinal === false
  ? 'translate-x-[55%]'
  : view === 'monsters' && viewFinal === false
  ? 'translate-y-[300%] translate-x-[55%]' 
  : view === 'selected' && viewFinal === true && activeBoard === 'characters'
  ? 'translate-x-[0%]'
  : view === 'characters' && viewFinal === true && activeBoard === 'characters'
  ? 'translate-x-[0%]'
  : 'translate-y-[300%]';

  const transformClassSelected = (view === 'initial' && viewFinal === false)
  ? 'translate-x-[300%]'
  : view === 'characters' && viewFinal === false
  ? 'translate-x-[300%]'
  : view === 'monsters' && viewFinal === false
  ? 'translate-x-[300%]'
  : view === 'characters' && viewFinal === true
  ? 'translate-x-[110%]'
  : view === 'monsters' && viewFinal === true
  ? 'translate-x-[110%]'
  : 'translate-x-[110%]';
  
  const transformClassMonsters = (view === 'initial' && viewFinal === false)
  ? 'translate-x-[900%]'
  : (view === 'characters' && viewFinal === false)
  ? 'translate-y-[300%] translate-x-[55%]'
  : (view === 'monsters' && viewFinal === false)
  ? 'translate-x-[55%]'
  : view === 'selected' && viewFinal === true && activeBoard === 'monsters'
  ? 'translate-x-[0%]'
  : view === 'monsters' && viewFinal === true && activeBoard === 'monsters'
  ? 'translate-x-[0%]'
  : 'translate-y-[300%]';

  if (loading) {
    // Renderiza uma mensagem de carregamento ou um spinner enquanto os dados estão sendo carregados
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden relative w-screen h-screen bg-gray-900 text-white flex items-center justify-center">
      <Head>
        <title>Criar Batalha</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="absolute top-4 w-full flex justify-center">
        <div className="w-[25%] max-w-md">
          <input
            type="text"
            placeholder="Nome da Batalha"
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
            value={battleName}
            onChange={(e) => setBattleName(e.target.value)}
          />
        </div>
      </div>
        {/* Painel Inicial */}
        <div
          className={`absolute w-[25%] h-[70%] flex transition-transform duration-500 ease-in-out ${transformClassInitial}`}
        >
          <div className="p-4 flex-none w-full max-w-md bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Criar Batalha</h1>
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={handleAddCharacter}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Adicionar Personagem
              </button>
              <button
                onClick={handleAddMonster}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                Adicionar Monstro
              </button>
            </div>
          </div>
        </div>

        {/* Painel de Personagens*/}
        
        <div
          className={`absolute w-[25%] h-[70%] flex transition-transform duration-500 ease-in-out ${transformClassCharacters}`}
        >
          <div className="flex-none w-full max-w-md bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Personagens</h2>
            {/* Exemplo de lista, substituir pelo conteúdo real */}
            <div className="flex flex-col space-y-4">
            {userCharacters && userCharacters.map(character => (
              <button
                key={character.id}
                onClick={() => handleSelectCharacter(character.id, character.name)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                {character.name}
              </button>
            ))}
            </div>
          </div>
        </div>

        {/* Painel de Monstros */}
        
        <div
          className={`absolute w-[25%] h-[70%] flex transition-transform duration-500 ease-in-out ${transformClassMonsters}`}
        >
          <div className="flex-none w-full max-w-md bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Monstros</h2>
            {/* Exemplo de lista, substituir pelo conteúdo real */}
            <div className="flex flex-col space-y-4 overflow-auto w-[90%] hide-scrollbar">
            {allMonsters.map(monster => (
              <button
                key={monster.id}
                onClick={() => handleSelectMonster(monster.id, monster.name)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                {monster.name}
              </button>
            ))}
            </div>
          </div>
        </div>

        {/* Painel de Itens Selecionados */}
        <div
          className={`absolute w-[25%] h-[70%] flex transition-transform duration-500 ease-in-out ${transformClassSelected}`}
        >
          <div className=" flex-none w-full max-w-md bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Itens Selecionados</h2>
            {/* Exemplo de lista, substituir pelo conteúdo real */}
            <div className="flex flex-col space-y-4 overflow-auto w-[90%] hide-scrollbar">
              {selectedItems.map((item, index) => (
                <button key={index} className="text-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors duration-300" onClick={() => handleDeleteSelected(index, item.name)}>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Botão Criar Batalha */}
        <div className="absolute flex justify-center items-center p-4 bg-gray-900 bottom-0 bg-transparent">
          <button
            onClick={handleCreateBattle}
            className={`bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors duration-300 ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedItems.length === 0}
          >
            Criar Batalha
          </button>
        </div>
      </div>
  );
};

export default CreateBattlePage;
