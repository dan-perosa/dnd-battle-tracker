"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const EditCharacterPage: React.FC = () => {
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
    status: '', // Adicionado campo status
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams(); // Obtém o ID do personagem da URL

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchCharacterData();
    }
  }, [userId]);

  const fetchCharacterData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/character/show_specific`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ owner_id: userId, character_id: id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setFormValues(data); // Supondo que o retorno da API tem um objeto `character`
    } catch (error) {
      console.error('Error fetching character data:', error);
    } finally {
      setLoading(false); // Atualiza o estado de carregamento para false após a tentativa de busca
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const dataToSubmit = {
        ...formValues,
        owner_id: userId,
        character_id: id
      };

    try {
      const response = await fetch(`http://127.0.0.1:8000/character/edit_character`, {
        method: 'PUT',
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
      console.error('Error updating character:', error);
    }
  };

  if (loading) {
    return <div className="w-screen h-screen bg-gray-900 text-white flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Editar Personagem</h1>

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
          <input
            id="race"
            name="race"
            type="text"
            value={formValues.race}
            onChange={handleChange}
            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg"
          />
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

        {/* Novo campo para Status */}
        <div className="col-span-full flex items-center mt-4">
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

        <button
          type="submit"
          className="col-span-full mx-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-center"
        >
          Atualizar Personagem
        </button>
      </form>
    </div>
  );
};

export default EditCharacterPage;
