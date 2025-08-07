/* eslint-disable prettier/prettier */
import { useState, useRef, useEffect  } from 'react';
import { tiposSala, Room } from '@renderer/types/RoomType';
import { RoomEditModal } from '@renderer/modal/EditRoomModal';
import { editRoom, deleteRooms } from '@renderer/services/RoomRequests';

import './RoomCard.css'

// Import dos ícones do lucide-react
import { Edit2, Trash2 } from 'lucide-react';

// color type
const getTypeColor = (type: string):string => {
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
  filteredRooms: Room[];
  onSearch?: (term: string) => unknown;
  salasSelecionadas: Room[];
  toggleSelecaoSala: (room: Room) => unknown;
}

const RoomCard = ({ filteredRooms, onSearch, salasSelecionadas, toggleSelecaoSala }: RoomCardProps): React.JSX.Element => {
  // modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [salaSelecionada, setSalaSelecionada] = useState<Room | null>(null);

  // Scroll

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  useEffect(() => {
  const scrollContainer = scrollRef.current;
  if (!scrollContainer) return;

  const handleMouseDown = (e: MouseEvent):void => {
    isDragging.current = true;
    startY.current = e.pageY - scrollContainer.offsetTop;
    scrollTop.current = scrollContainer.scrollTop;
    scrollContainer.style.cursor = 'grabbing';
    scrollContainer.style.userSelect = 'none';
  };

  const handleMouseLeave = ():void => {
    isDragging.current = false;
    scrollContainer.style.cursor = 'default';
    scrollContainer.style.removeProperty('user-select');
  };

  const handleMouseUp = ():void => {
    isDragging.current = false;
    scrollContainer.style.cursor = 'default';
    scrollContainer.style.removeProperty('user-select');
  };

  const handleMouseMove = (e: MouseEvent):void => {
    if (!isDragging.current) return;
    e.preventDefault();
    const y = e.pageY - scrollContainer.offsetTop;
    const walkY = y - startY.current;
    scrollContainer.scrollTop = scrollTop.current - walkY;
  };

  scrollContainer.addEventListener('mousedown', handleMouseDown);
  scrollContainer.addEventListener('mouseleave', handleMouseLeave);
  scrollContainer.addEventListener('mouseup', handleMouseUp);
  scrollContainer.addEventListener('mousemove', handleMouseMove);

  return () => {
    scrollContainer.removeEventListener('mousedown', handleMouseDown);
    scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    scrollContainer.removeEventListener('mouseup', handleMouseUp);
    scrollContainer.removeEventListener('mousemove', handleMouseMove);
  };
}, []);

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

      console.log('Sala editada com sucesso!');
      onSearch?.('')
      setEditModalOpen(false);
    } catch (error) {
      console.error('Erro ao editar a sala:', error);
      alert('Erro ao editar a sala.');
    }
  }

  async function deletarSala(sala: Room): Promise<void> {
  const confirmDelete = window.confirm(`Tem certeza que deseja deletar a Sala ${sala.number}?`);
  if (!confirmDelete) return;

  try {
    if (sala.id !== undefined) {
      await deleteRooms([sala.id]);
      console.log(`Sala ${sala.number} deletada com sucesso.`);
      onSearch?.(''); 
    } else {
      console.error('ID da sala está indefinido.');
      alert('Erro: ID da sala está indefinido.');
    }
  } catch (error) {
    console.error('Erro ao deletar a sala:', error);
    alert('Erro ao deletar a sala.');
  }
}

  return (
    <div ref={scrollRef} className="overflow-auto mx-auto max-w-[1500px] max-h-[calc(100vh-350px)] min-h-[60%] px-4">
      <table className="min-w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        <thead className="">
          <tr>
            <th className="px-2 py-3 border-b border-gray-200 text-center">✓</th>
            <th className="text-left px-4 py-3 border-b border-gray-200">Sala</th>
            <th className="text-left px-4 py-3 border-b border-gray-200">Bloco</th>
            <th className="text-left px-4 py-3 border-b border-gray-200">Descrição</th>
            <th className="text-left px-4 py-3 border-b border-gray-200">Tipo</th>
            <th className="text-center px-4 py-3 border-b border-gray-200">Status</th>
            <th className="text-center px-4 py-3 border-b border-gray-200">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredRooms.map((room) => (
            <tr key={room.id} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-2 py-3 border-b border-gray-100 text-center">
                <input
                  className='cursor-pointer w-3 h-3 scale-150'
                  type="checkbox"
                  checked={salasSelecionadas.some(s => s.id === room.id)}
                  onChange={() => toggleSelecaoSala(room)}
                />
              </td>
              <td className="px-4 py-3 border-b border-gray-100 font-semibold">Sala {room.number}</td>
              <td className="px-4 py-3 border-b border-gray-100">{room.bloco ?? '-'}</td>
              <td className="px-4 py-3 border-b border-gray-100 text-gray-700">
                {room.description
                  ? room.description.length > 45
                    ? room.description.slice(0, 45) + '...'
                    : room.description
                  : 'Sem descrição'}
              </td>
              <td className={`px-4 py-3 border-b border-gray-100 text-gray-800`}><div className={"flex"}><span className={"rounded-2xl px-2 "+ getTypeColor(room.tipo)}>{room.tipo ?? '-'}</span></div></td>
              <td className="px-4 py-3 border-b border-gray-100 text-center">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  room.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {room.active ? 'Ativa' : 'Inativa'}
                </span>
              </td>
              <td className="px-4 py-3 border-b border-gray-100 text-center space-x-2">
                <button
                  onClick={() => abrirEdicaoSala(room)}
                  className="text-blue-600 hover:text-blue-800"
                  aria-label={`Editar Sala ${room.number}`}
                  title="Editar"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => deletarSala(room)}
                  className="text-red-600 hover:text-red-800"
                  aria-label={`Deletar Sala ${room.number}`}
                  title="Excluir"
                >
                  <Trash2 size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edição */}
      <RoomEditModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={salvarEdicao}
        tiposSala={tiposSala}
        salaData={salaSelecionada as { id: number; number: string; description: string; tipo: string; bloco: string; active: boolean; } | null}
      />
    </div>
  );
};

export default RoomCard;
