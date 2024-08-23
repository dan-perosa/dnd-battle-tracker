"use client";

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Interfaces para os participantes
interface Participant {
  participant_name: string;
  participant_character_id: number | null;
  participant_monster_id: number | null;
  type: string;
  total_init: number;
  battle_position: number;
  participant_generic_id: number;
  max_hp: number;
  current_hp: number;
  ac: number;
}

interface DiceInfo {
  type: string;
  count: number;
  bonus: number;
  completeSum: number;
}

const BattlePage: React.FC = () => {
  const diceInfoInitialState = [{type: 'd4',count: 0,bonus: 0,completeSum: 0},
    {type: 'd6',count: 0,bonus: 0,completeSum: 0},
    {type: 'd8',count: 0,bonus: 0,completeSum: 0},
    {type: 'd10',count: 0,bonus: 0,completeSum: 0},
    {type: 'd12',count: 0,bonus: 0,completeSum: 0},
    {type: 'd20',count: 0,bonus: 0,completeSum: 0}];

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [deadParticipants, setDeadParticipants] = useState<Participant[]>([]);
  const [fixedParticipants, setFixedParticipants] = useState<Participant[]>([]);
  const [activeParticipant, setActiveParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAttackForm, setShowAttackForm] = useState(false);
  const [diceInfo, setDiceInfo] = useState<DiceInfo[]>(diceInfoInitialState);
  const router = useRouter();
  const { battleId } = useParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [totalSum, setTotalSum] = useState<number>(0);
  const [selectedTargetId, setSelectedTargetId] = useState<number | null>(null);
  const [noTargetSelected, setNoTargetSelected] = useState<true | false>(false)

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/battle/fetch_after_initiative_info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ battle_id: Number(battleId), owner_id: Number(userId) }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const jsonString = data.participants_initiative_order.replace(/'/g, '"').replace(/None/g, 'null');
        const participantsInitiativeOrderList: Participant[] = JSON.parse(jsonString);
        setParticipants(participantsInitiativeOrderList);
        setFixedParticipants(participantsInitiativeOrderList);

        // Set the active participant
        const currentTurnParticipant = participantsInitiativeOrderList.find(participant => participant.battle_position === 1) || null;
        setActiveParticipant(currentTurnParticipant);

      } catch (error) {
        console.error('Error fetching participants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [userId, battleId]);

  const handleSkipTurn = () => {
    if (!activeParticipant) return;


    setParticipants(prevParticipants => {
      const updatedParticipants = [...prevParticipants];
      const index = updatedParticipants.findIndex(p => p.participant_name === activeParticipant.participant_name);

      if (index > -1) {
        const [skippedParticipant] = updatedParticipants.splice(index, 1);
        skippedParticipant.battle_position = Math.max(...updatedParticipants.map(p => p.battle_position)) + 1;
        updatedParticipants.push(skippedParticipant);

        updatedParticipants.forEach((p, i) => p.battle_position = i + 1);
        const newActive = updatedParticipants.find(p => p.participant_generic_id !== activeParticipant?.participant_generic_id);
        if (newActive){
          setActiveParticipant(newActive)
        }
        return updatedParticipants;
      }
      return prevParticipants;
    });
  };

  const handleAttack = () => {
    setShowAttackForm(true);
  };

  const dealDamage = (targetId: number, totalSum: number) => {
    const updatedParticipants = participants.map(participant => {
      if (participant.participant_generic_id === targetId) {
        if (totalSum >= participant.current_hp) {
          return { ...participant, current_hp: 0 };
        }
        return { ...participant, current_hp: participant.current_hp - totalSum };
      }
      return participant;
    });

    const aliveParticipants = updatedParticipants.filter(p => p.current_hp > 0);
    const deadParticipantPosition = updatedParticipants.find(p => (p.participant_generic_id === targetId && p.current_hp === 0))?.battle_position;

    if (deadParticipantPosition !== undefined) {
      const reorderedParticipants = aliveParticipants.map(participant => ({
        ...participant,
        battle_position: participant.battle_position > deadParticipantPosition
          ? participant.battle_position + 1
          : participant.battle_position
      }));

      const deadParticipant = updatedParticipants.find(p => p.current_hp === 0)
      if (deadParticipant) {
        setDeadParticipants(prev => [...prev, deadParticipant])
      }

      setParticipants(reorderedParticipants);
      setFixedParticipants(reorderedParticipants.sort((a, b) => a.participant_generic_id - b.participant_generic_id));
    } else {
      setParticipants(aliveParticipants);
      setFixedParticipants(aliveParticipants.sort((a, b) => a.participant_generic_id - b.participant_generic_id));
    }
  };

  const handleSubmitAttack = () => {
    if (selectedTargetId === null) {
      setNoTargetSelected(true)
      return
    }
    let allDicesTotalSum = 0
    diceInfo.map(dice => {
      allDicesTotalSum += dice.completeSum
    })
    dealDamage(selectedTargetId, allDicesTotalSum)

    setDiceInfo(diceInfoInitialState)
    setSelectedTargetId(null)
    setShowAttackForm(false);

    handleSkipTurn()

    setNoTargetSelected(false)
  };

  const handleDiceInfo = (type: string, field: 'count' | 'bonus', value: number) => {
    setDiceInfo(prevDiceInfo => {
      return prevDiceInfo.map(dice => 
        dice.type === type 
          ? { ...dice, [field]: value }
          : dice
      );
    });
  };

  const handleCountDiceSum = (type: string) => {
    let faces = 0;
    if (type === 'd4') faces = 4;
    else if (type === 'd6') faces = 6;
    else if (type === 'd8') faces = 8;
    else if (type === 'd10') faces = 10;
    else if (type === 'd12') faces = 12;
    else faces = 20;

    const diceAmount = diceInfo.find(dice => dice.type === type)?.count || 0;
    const diceBonus = diceInfo.find(dice => dice.type === type)?.bonus || 0;

    let rolledSum = 0;

    for (let i = 0; i < diceAmount; i++) {
      const roll = Math.floor(Math.random() * faces) + 1;
      rolledSum += roll;
    }

    const totalSum = rolledSum + diceBonus;
    setDiceInfo(prevDiceInfo =>
      prevDiceInfo.map(dice =>
        dice.type === type
          ? { ...dice, completeSum: totalSum }
          : dice
      )
    );
    return totalSum;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-gray-900 text-white">
        <p>Loading...</p>
      </div>
    );
  }

  let possibleTargets = participants.filter(p => p.participant_generic_id !== activeParticipant?.participant_generic_id);

  return (
    <div className="flex w-screen h-screen text-white">
      <div className="w-[25%] bg-gray-800 p-4 h-screen overflow-auto">
        <Head>
          <title>Batalha</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <h1 className="text-3xl font-bold mb-6 text-center">Batalha {battleId}</h1>

        <h2 className="text-2xl font-semibold mb-4 text-center">Ordem dos Turnos</h2>
        {fixedParticipants.length === 0 ? (
          <p className="text-center">Nenhum participante encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {fixedParticipants.map((participant) => (
              <li key={participant.participant_generic_id} className={`bg-gray-800 p-4 rounded-lg shadow-md ${participant.battle_position === 1 ? 'border-2 border-yellow-500' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{participant.participant_name}</h3>
                    <p className="text-gray-400">ID na batalha: {participant.participant_generic_id}</p>
                    {participant.battle_position && participant.battle_position > 1
                    ? <p className="text-gray-400">Turnos restantes para jogar: {participant.battle_position - 1}</p>
                    : <p className="text-gray-400">Turno atual</p>}
                    <p className="text-gray-400">Vida máxima: {participant.max_hp}</p>
                    <p className="text-gray-400">Vida atual: {participant.current_hp}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex-grow bg-gray-900 p-4 overflow-auto h-screen">
        {activeParticipant && (
          <div className="p-4 bg-gray-800 rounded-lg mb-4">
            <h2 className="text-2xl font-semibold text-center">Turno atual</h2>
            <p className="text-xl">Nome: {activeParticipant.participant_name}</p>
            <p>ID na batalha: {activeParticipant.participant_generic_id}</p>
            {activeParticipant && (
              <>
              <p>Vida Máxima: {activeParticipant.max_hp}</p>
              <p>Vida Atual: {activeParticipant.current_hp}</p>
              <p>Classe de Armadura: {activeParticipant.ac}</p>
              </>
            )}
            <div className="mt-4 flex space-x-4">
              <button onClick={handleAttack} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-300">Atacar</button>
              <button onClick={handleSkipTurn} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-300">Pular Turno</button>
            </div>
          </div>
        )}

        {showAttackForm && (
          <div className="flex space-x-4 p-4 bg-gray-800 rounded-lg mt-4">
            <div className="w-1/2">
              <h2 className="text-2xl font-semibold mb-4">Ataque</h2>
              <div>
                {['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].map((type, index) => (
                  <div key={type} className="mb-4">
                    <label className="block text-gray-400 mb-2">{type}</label>
                    <input
                      type="number"
                      placeholder="Quantidade"
                      className="bg-gray-700 text-white p-2 rounded-lg w-[20%] mr-2"
                      onChange={e => handleDiceInfo(type, 'count', Number(e.target.value))}
                      value={diceInfo.find(dice => dice.type === type)?.count || 0}
                    />
                    <input
                      type="number"
                      placeholder="Adicional"
                      className="bg-gray-700 text-white p-2 rounded-lg w-[20%]"
                      onChange={e => handleDiceInfo(type, 'bonus', Number(e.target.value))}
                      value={diceInfo.find(dice => dice.type === type)?.bonus || 0}
                    />
                    <button
                      type="submit"
                      className="bg-green-500 text-white p-2 ml-2 rounded-lg w-[20%]"
                      onClick={() => handleCountDiceSum(type)}
                    >
                      Rolar
                    </button>
                    <span className="p-2">{diceInfo.find(dice => dice.type === type)?.completeSum}</span>
                  </div>
                ))}
                  <div className='flex flex-col'>
                    {noTargetSelected && (
                      <span className="text-red-600 p-2">SELECIONE UM ALVO</span>
                    )}
                    <button
                      onClick={handleSubmitAttack}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-300 w-[70%]"
                    >
                      Enviar Ataque
                    </button>
                  </div>
              </div>
            </div>
            <div className="w-3/4">
              <h2 className="text-2xl font-semibold mb-4">Alvo</h2>
              <ul className="space-y-4">
                {possibleTargets.map(target => {
                  return (
                    <li
                      key={target.participant_generic_id}
                      className={`bg-gray-700 p-4 rounded-lg cursor-pointer ${selectedTargetId === target.participant_generic_id ? 'bg-blue-600' : ''}`}
                      onClick={() => setSelectedTargetId(target.participant_generic_id)}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xl">{target.participant_name}</p>
                        <p className="text-xl">ID: {target.participant_generic_id}</p>
                        {selectedTargetId === target.participant_generic_id && (
                          <span className="text-white">Selecionado</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="w-[25%] bg-gray-800 p-4 h-screen overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Mortes</h1>
          {deadParticipants.length === 0 ? (
            <p className="text-center">Nenhum participante morto.</p>
          ) : (
            <ul className="space-y-4">
              {deadParticipants.map((participant) => (
                <li key={participant.participant_generic_id} className={`bg-gray-800 p-4 rounded-lg shadow-md ${participant.battle_position === 1 ? 'border-2 border-yellow-500' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{participant.participant_name}</h3>
                      <p className="text-gray-400">ID na batalha: {participant.participant_generic_id}</p>
                      <p className="text-gray-400">Vida máxima: {participant.max_hp}</p>
                      <p className="text-gray-400">Vida atual: {participant.current_hp}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </div>
    </div>
  );
};

export default BattlePage;
