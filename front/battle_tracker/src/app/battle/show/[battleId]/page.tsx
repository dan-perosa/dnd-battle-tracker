"use client";

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Interfaces para os participantes
interface ParticipantMonsters {
  name: string;
  dexterity: number;
}

interface ParticipantMappedMonsters {
  monster_id: number;
  monster_name: string;
}

interface ParticipantMappedCharacters {
  participant_character_id: number;
  character_id: number;
  character_name: string;
}

interface ParticipantCharacters {
  id: number;
  name: string;
  dexterity: number;
}

interface OngoingBattle {
  battle_id: number;
  battle_name: string;
  participant_characters: ParticipantCharacters[];
  participant_monsters: ParticipantMonsters[];
}

interface InitiativeParticipant {
  participant_generic_id: number | null;
  participant_name: string;
  participant_character_id: number | null;
  participant_monster_id: number | null;
  type: string;
  total_init: number;
  battle_position: number | null;
}

const TrackerPage: React.FC = () => {
  const [battle, setBattle] = useState<OngoingBattle | null>(null);
  const [loading, setLoading] = useState(true);
  const [participantCharactersStringedList, setParticipantCharactersStringedList] = useState<string>('');
  const [participantMonstersStringedList, setParticipantMonstersStringedList] = useState<string>('');
  const [initiativeMap, setInitiativeMap] = useState<Record<string, { initiative: number; roll: number; inputed: number; total_init: number }>>({});
  const router = useRouter();
  const { battleId } = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [participantMappedCharactersList, setParticipantMappedCharactersList] = useState<ParticipantMappedCharacters[]>([]);
  const [participantMappedMonstersList, setParticipantMappedMonstersList] = useState<ParticipantMappedMonsters[]>([]);
  const [allParticipants, setAllParticipants] = useState<InitiativeParticipant[]>([]);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const fetchBattleData = async () => {
    try {
      const transformedBattleId = Number(battleId);
      const response = await fetch(`http://127.0.0.1:8000/battle/fetch_ongoing/${transformedBattleId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setParticipantCharactersStringedList(data.participant_characters);
      setParticipantMonstersStringedList(data.participant_monsters);
      setBattle(data);
    } catch (error) {
      console.error('Error fetching battle data:', error);
    }
  };

  const fetchMappedParticipants = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/fetch/mapped_participants/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_id: userId,
          participant_characters: participantCharactersStringedList.trim(),
          participant_monsters: participantMonstersStringedList.trim(),
        }),
      });


      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setParticipantMappedCharactersList(data.mapped_characters);
      setParticipantMappedMonstersList(data.mapped_monsters);
      console.log(data)
    } catch (error) {
      console.error('Error fetching mapped participants:', error);
    }
  };

  const fetchDexterities = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/fetch/participant_dexterities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner_id: userId,
          participant_characters: participantCharactersStringedList,
          participant_monsters: participantMonstersStringedList,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const updatedInitiativeMap: Record<string, { participant_monster_id: number | null; participant_character_id: number | null; initiative: number; roll: number; inputed: number; total_init: number }> = {};

      data.characters_initiative.forEach((item: { [id: string]: number }) => {
        const id = Object.entries(item)[0][1]
        const [name, initiative] = Object.entries(item)[1];
        updatedInitiativeMap[`${id}-${name}`] = { participant_monster_id: null, participant_character_id: id, initiative, roll: 0, inputed: 0, total_init: initiative };
      });

      data.monsters_initiative.forEach((item: { [id: string]: number }) => {
        const id = Object.entries(item)[0][1]
        const [name, initiative] = Object.entries(item)[1];
        updatedInitiativeMap[`${id}-${name}`] = { participant_monster_id: id, participant_character_id: null, initiative, roll: 0, inputed: 0, total_init: initiative };
      });

      setInitiativeMap(updatedInitiativeMap);
    } catch (error) {
      console.error('Error fetching dexterities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(participantMappedMonstersList);
  }, [participantMappedMonstersList]);
  

  useEffect(() => {
    fetchBattleData();
  }, [battleId]);


  useEffect(() => {
    if (battle) {
      fetchDexterities();
      fetchMappedParticipants();
    }
  }, [battle]);

  const handleRollInitiative = (id: number, name: string) => {
    const roll = Math.floor(Math.random() * 20) + 1; // Rolagem de d20
    setInitiativeMap((prev) => {
      const currentInitiative = prev[`${id}-${name}`]?.initiative || 0;
      return {
        ...prev,
        [`${id}-${name}`]: { initiative: currentInitiative, roll, inputed: 0, total_init: currentInitiative + roll },
      };
    });
  };

  const handleChangeInitiative = (id: number, name: string, value: number) => {
    setInitiativeMap((prev) => {
      const newTotalInit = value + prev[`${id}-${name}`]?.initiative || 0;
      return {
        ...prev,
        [`${id}-${name}`]: { initiative: prev[`${id}-${name}`]?.initiative || 0, roll: 0, inputed: value, total_init: newTotalInit },
      };
    });
  };

  useEffect(() => {
    const participants: InitiativeParticipant[] = [
      ...(participantMappedCharactersList || []).map(participant => ({
        participant_generic_id: null,
        participant_name: participant.character_name,
        participant_character_id: participant.participant_character_id,
        participant_monster_id: null,
        type: 'character',
        total_init: initiativeMap[`${participant.participant_character_id}-${participant.character_name}`]?.total_init || 0,
        battle_position: null,
      })),
      ...(participantMappedMonstersList || []).map(participant => ({
        participant_generic_id: null,
        participant_name: participant.monster_name,
        participant_character_id: null,
        participant_monster_id: participant.monster_id,
        type: 'monster',
        total_init: initiativeMap[`${participant.monster_id}-${participant.monster_name}`]?.total_init || 0,
        battle_position: null,
      })),
    ];

    // Ordena os participantes por total_init
    participants.sort((a, b) => b.total_init - a.total_init);

    // Atualiza a posição na batalha
    participants.forEach((participant, index) => {
      participant.battle_position = index + 1;
      if (participant.participant_generic_id === null) {
        participant.participant_generic_id = index + 1;
      }
    });

    setAllParticipants(participants);
  }, [initiativeMap]);

  const handleFinishInitiativeRolls = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/battle/transform_to_after_initiative/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({'battle_id': battleId,
                              'owner_id': userId,
                              'initiative_info': allParticipants})
      });

      router.push(`/battle/show/after_initiative/${battleId}`)

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error fetching battle data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-800 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!battle) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-800 text-white">
        <p>Batalha não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center p-6 overflow-auto">
      <Head>
        <title>{battle.battle_name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="text-4xl font-bold mb-6">{battle.battle_name}</h1>

      <div className="w-full max-w-4x2 flex justify-center space-x-2">
        <div className="flex-1 p-4">
          <h2 className="text-3xl font-semibold mb-4 text-center">Personagens</h2>
          <ul className="space-y-4">
            {participantMappedCharactersList && participantMappedCharactersList.map((participant) => (
              <li
                key={participant.character_id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{participant.character_name}</h3>
                </div>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                  <button
                    onClick={() => handleRollInitiative(participant.participant_character_id, participant.character_name)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Roll
                  </button>
                  <input
                    type="number"
                    value={initiativeMap[`${participant.participant_character_id}-${participant.character_name}`]?.roll || initiativeMap[`${participant.participant_character_id}-${participant.character_name}`]?.inputed || ''}
                    onChange={(e) => handleChangeInitiative(participant.participant_character_id, participant.character_name, Number(e.target.value))}
                    className="w-24 px-2 py-1 rounded-md border border-gray-600 text-black text-center"
                    placeholder="Iniciativa"
                  />
                  <span className="text-gray-400">
                    Bônus: {initiativeMap[`${participant.participant_character_id}-${participant.character_name}`]?.initiative || 0}
                  </span>
                  <span className="text-gray-400">
                    Total: {initiativeMap[`${participant.participant_character_id}-${participant.character_name}`]?.total_init || 0}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 p-4">
          <h2 className="text-3xl font-semibold mb-4 text-center">Monstros</h2>
          <ul className="space-y-4">
            {participantMappedMonstersList && participantMappedMonstersList.map((participant) => (
              <li
                key={participant.monster_id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4"
              >
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{participant.monster_name}</h3>
                </div>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                  <button
                    onClick={() => handleRollInitiative(participant.monster_id, participant.monster_name)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                  >
                    Roll
                  </button>
                  <input
                    type="number"
                    value={initiativeMap[`${participant.monster_id}-${participant.monster_name}`]?.roll || initiativeMap[`${participant.monster_id}-${participant.monster_name}`]?.inputed || ''}
                    onChange={(e) => handleChangeInitiative(participant.monster_id, participant.monster_name, Number(e.target.value))}
                    className="w-24 px-2 py-1 rounded-md border border-gray-600 text-black text-center"
                    placeholder="Iniciativa"
                  />
                  <span className="text-gray-400">
                    Bônus: {initiativeMap[`${participant.monster_id}-${participant.monster_name}`]?.initiative || 0}
                  </span>
                  <span className="text-gray-400">
                    Total: {initiativeMap[`${participant.monster_id}-${participant.monster_name}`]?.total_init || 0}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 flex-col p-4">
          <h2 className="text-3xl font-semibold mb-4 text-center">Ordem</h2>
          <ul className="space-y-4">
            {allParticipants.map(participant => (
              <li
                key={participant.participant_generic_id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg"
              >
                <div className="flex flex-row">
                  <h3 className="text-xl font-semibold">{participant.participant_name}</h3>
                  <h3 className="text-xl font-semibold ml-auto">Iniciativa: {participant.total_init}</h3>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => {
            handleFinishInitiativeRolls()
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default TrackerPage;
