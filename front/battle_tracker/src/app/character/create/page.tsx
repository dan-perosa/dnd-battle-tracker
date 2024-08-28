"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CreateCharacterPage: React.FC = () => {
  const [formValues, setFormValues] = useState({
    name: '',
    class_name: '',
    race: '',
    level: 1,
    hp_max: 0,
    ac: 0,
    initiative: 0,
    strength: 0,
    dexterity: 0,
    constitution: 0,
    intelligence: 0,
    wisdom: 0,
    charisma: 0,
    status: '',
  });
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [dndRaces, setDndRaces] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [noNameErrorMessage, setNoNameErrorMessage] = useState(false);
  const [noRaceErrorMessage, setNoRaceErrorMessage] = useState(false);

  useEffect(() => { 
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const fetchDndRaces = async () => {
    try {
      const response = await fetch('https://www.dnd5eapi.co/api/races', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      const results = data.results;
      const names = results.map((info: { name: string }) => info.name);
      setDndRaces(names);
 
    } catch (error) {
      console.error('Error fetching D&D races:', error);
    } finally {
      setLoading(false); // Atualiza o estado de carregamento para false após a tentativa de busca
    }
  };

  useEffect(() => {
    fetchDndRaces();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: name === 'level' || name === 'hp_max' || name === 'ac' || name === 'initiative' ||
             name === 'strength' || name === 'dexterity' || name === 'constitution' ||
             name === 'intelligence' || name === 'wisdom' || name === 'charisma'
             ? parseInt(value, 10) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formValues);
    setNoNameErrorMessage(false)
    setNoRaceErrorMessage(false)

    const dataToSubmit = {
        ...formValues,
        owner_id: userId
      };

    if (dataToSubmit.name === '') {
      setNoNameErrorMessage(true)      
      return
    }

    if (dataToSubmit.race === '') {
      setNoRaceErrorMessage(true)
      return
    }


    try {
      const response = await fetch('http://127.0.0.1:8000/character/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Redireciona para a página de personagens ou onde você desejar
      router.push('/character/show_all');
    } catch (error) {
      console.error('Error creating character:', error);
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center p-6 overflow-auto">
      <h1 className="text-3xl font-bold mb-6 ml-20">Criar Personagem</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo de Nome ocupando duas colunas */}
        <div className="col-span-full flex items-center">
          <label htmlFor="name" className="w-[12.5%] text-lg text-right pr-4">Nome:</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formValues.name}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="class_name" className="w-1/4 text-lg text-right pr-4">Classe:</label>
          <input
            id="class_name"
            name="class_name"
            type="text"
            value={formValues.class_name}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="race" className="w-1/4 text-lg text-right pr-4">Raça:</label>
          <select
            id="race"
            name="race"
            value={formValues.race}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          >
            <option value="" disabled>Selecione uma raça</option>
            {dndRaces.map((race, index) => (
              <option key={index} value={race}>{race}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="level" className="w-1/4 text-lg text-right pr-4">Nível:</label>
          <input
            id="level"
            name="level"
            type="number"
            min="1"
            value={formValues.level}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="hp_max" className="w-1/4 text-lg text-right pr-4">HP Máximo:</label>
          <input
            id="hp_max"
            name="hp_max"
            type="number"
            min="0"
            value={formValues.hp_max}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="ac" className="w-1/4 text-lg text-right pr-4">AC:</label>
          <input
            id="ac"
            name="ac"
            type="number"
            min="0"
            value={formValues.ac}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="initiative" className="w-1/4 text-lg text-right pr-4">Iniciativa:</label>
          <input
            id="initiative"
            name="initiative"
            type="number"
            min="0"
            value={formValues.initiative}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="strength" className="w-1/4 text-lg text-right pr-4">Força:</label>
          <input
            id="strength"
            name="strength"
            type="number"
            min="0"
            value={formValues.strength}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="dexterity" className="w-1/4 text-lg text-right pr-4">Destreza:</label>
          <input
            id="dexterity"
            name="dexterity"
            type="number"
            min="0"
            value={formValues.dexterity}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="constitution" className="w-1/4 text-lg text-right pr-4">Constituição:</label>
          <input
            id="constitution"
            name="constitution"
            type="number"
            min="0"
            value={formValues.constitution}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="intelligence" className="w-1/4 text-lg text-right pr-4">Inteligência:</label>
          <input
            id="intelligence"
            name="intelligence"
            type="number"
            min="0"
            value={formValues.intelligence}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="wisdom" className="w-1/4 text-lg text-right pr-4">Sabedoria:</label>
          <input
            id="wisdom"
            name="wisdom"
            type="number"
            min="0"
            value={formValues.wisdom}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="charisma" className="w-1/4 text-lg text-right pr-4">Carisma:</label>
          <input
            id="charisma"
            name="charisma"
            type="number"
            min="0"
            value={formValues.charisma}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>
        <div className="col-span-full flex items-center">
          <label htmlFor="status" className="w-[12.5%] text-lg text-right pr-4">Status:</label>
          <input
            id="status"
            name="status"
            type="text"
            value={formValues.status}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>
        {noNameErrorMessage && (
          <div className='text-center text-red-500'>
            NÃO É POSSIVEL CRIAR PERSONAGEM SEM NOME
          </div>
        )}
        {noRaceErrorMessage && (
          <div className='text-center text-red-500'>
            NÃO É POSSIVEL CRIAR PERSONAGEM SEM RAÇA
          </div>
        )}
        <div className="col-span-full flex align-center items-center "> 
          <button
            type="submit"
            className="mx-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-4 rounded-lg transition-colors duration-300"
          >
            Criar Personagem
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCharacterPage;
