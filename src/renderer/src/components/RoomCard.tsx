/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { tiposSala, Room } from '@renderer/types/RoomType';
import { RoomEditModal } from '@renderer/modal/EditRoomModal';
import { editRoom, deleteRooms } from '@renderer/services/RoomRequests';

import './RoomCard.css'
// Ícones
import {Filter, Download, Search, Ellipsis } from 'lucide-react';

const getTypeColor = (type: string): string => {
  switch (type) {
    case "Reunião":
      return "bg-blue-100 text-blue-800"
    case "Comum":
      return "bg-green-100 text-green-800"
    default:
      return "bg-purple-100 text-purple-800"
  }
}

interface RoomCardProps {
  searchValue,
  onSearchChange,
  filteredRooms: Room[];
  onSearch?: (term: string) => unknown;
  salasSelecionadas: Room[];
  toggleSelecaoSala: (room: Room) => unknown;
  onToggleFilter?: () => void;
}

const RoomCard = ({searchValue, onSearchChange, filteredRooms, onSearch, salasSelecionadas, toggleSelecaoSala, onToggleFilter }: RoomCardProps): React.JSX.Element => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState<Room | null>(null);

  function abrirEdicaoSala(sala: Room): void {
    setSalaSelecionada(sala);
    setEditModalOpen(true);
  }

  async function salvarEdicao(data: {
    id: number;
    number: string;
    description: string;
    tipo: string;
    bloco: string;
    active: boolean;
  }): Promise<void> {
    try {
      await editRoom(data.id, {
        description: data.description,
        tipo: data.tipo,
        active: data.active
      });

      onSearch?.('')
      setEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao editar a sala:', error);
      alert('Erro ao editar a sala.');
    }
  }

  async function deleteRoom(sala: Room): Promise<void> {
    const confirmDelete = window.confirm(`Tem certeza que deseja deletar a Sala ${sala.number}?`);
    if (!confirmDelete) return;

    try {
      if (sala.id !== undefined) {
        await deleteRooms([sala.id]);
        onSearch?.('');
      } else {
        alert('Erro: ID da sala está indefinido.');
      }
    } catch (error) {
      console.error('Erro ao deletar a sala:', error);
      alert('Erro ao deletar a sala.');
    }
  }

  return (
    <div className="bg-white  mx-auto max-w-[1500px] rounded-xl mt-2 p-2 border border-gray-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 ">
      {/* Barra de ações */}
      <div className="flex justify-between w-full items-center p-3">
        {/* Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Pesquisar sala..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10 pr-3 py-2 border-b border-gray-500 text-sm focus:outline-none  focus:border-emerald-700"
          />
        </div>

        {/* Ações */}
        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            onClick={onToggleFilter}
          >
            <Filter size={16} /> Filtros
          </button>
          <button
            className="flex items-center gap-2 px-3 py-2 text-gray-100 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-sm"
            onClick={() => alert("Exportar CSV futuramente")}
          >
            <Download size={16} /> Exportar
          </button>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
      <table className="min-w-full bg-white  overflow-hidden lg:text-[16px] sm:text-[15px]">
        <thead className="text-gray-600 text-sm bg-gray-100">
          <tr>
            <th className="px-2 py-3 text-center">✓</th>
            <th className="text-left px-4 py-3">Sala</th>
            <th className="text-left px-4 py-3">Bloco</th>
            <th className="text-left px-4 py-3">Descrição</th>
            <th className="text-left px-4 py-3">Tipo</th>
            <th className="text-center px-4 py-3">Status</th>
            <th className="text-center px-4 py-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room) => (
            <tr key={room.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-2 py-3 text-center">
                <input
                  className="cursor-pointer w-4 h-4"
                  type="checkbox"
                  checked={salasSelecionadas.some(s => s.id === room.id)}
                  onChange={() => toggleSelecaoSala(room)}
                />
              </td>
              <td className="px-4 py-3 font-semibold">{room.number}</td>
              <td className="px-4 py-3">{room.bloco ?? '-'}</td>
              <td className="px-4 py-3 text-gray-700">
                {room.description
                  ? room.description.length > 45
                    ? room.description.slice(0, 45) + '...'
                    : room.description
                  : 'Sem descrição'}
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-2xl px-2 py-1 text-xs ${getTypeColor(room.tipo)}`}>
                  {room.tipo ?? '-'}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${room.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                  {room.active ? 'Ativa' : 'Inativa'}
                </span>
              </td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => abrirEdicaoSala(room)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Editar"
                >
                  <Ellipsis size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {/* Modal de edição */}
      <RoomEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={salvarEdicao}
        tiposSala={tiposSala}
        salaData={salaSelecionada as any}
        deleteRoom={deleteRoom}
      />
    </div>
  );
};

export default RoomCard;
