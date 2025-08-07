/* eslint-disable prettier/prettier */
// icones
import { Plus, Search, Tag, Building } from 'lucide-react'
// hooks
import { useState, useEffect } from 'react'
// Modal
import { RoomModal } from '@renderer/modal/RoomModal'
// Types
import { tiposSala, blocosSala, Room } from '@renderer/types/RoomType'
// Componentes
import  RoomCard  from '@renderer/components/RoomCard'
// Api
import { searchRooms, deleteRooms } from '@renderer/services/RoomRequests'

function Rooms(): React.JSX.Element {
  const [rooms, setRooms] = useState<Room[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');


  // Especificidades
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("");
  const [blocoSelecionado, setBlocoSelecionado] = useState<string>("");
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  // selectRooms
  const [salasSelecionadas, setSalasSelecionadas] = useState<Room[]>([]);

  const toggleSelecaoSala = (room: Room):void => {
    const jaSelecionada = salasSelecionadas.some(sala => sala.id === room.id);

    if (jaSelecionada) {
      setSalasSelecionadas(salasSelecionadas.filter(sala => sala.id !== room.id));
    } else {
      setSalasSelecionadas([...salasSelecionadas, room]);
    }
  };

  // Busca filtrada
  async function handleSearch(page: number): Promise<void>{
    try {
      const result = await searchRooms({
        number: search || undefined,
        tipo: tipoSelecionado || undefined,
        bloco: blocoSelecionado || undefined,
        page,
        active:
        activeFilter === 'all' ? undefined :
        activeFilter === 'active' ? true :
        false,
      })
      setRooms(result.data)
      setCurrentPage(result.currentPage)
      setTotalPages(result.totalPages)
      setTotalItems(result.total)
    } catch (error) {
      console.error('Erro ao buscar salas:', error)
    }
  }

  useEffect(() => {
  setCurrentPage(1);
  handleSearch(1);
  }, [search, tipoSelecionado, blocoSelecionado, activeFilter]);

  const filteredRooms = rooms.filter(room =>
    room.number.toString().includes(search)
  )

  // Controle de paginação
  function goToPreviousPage():void {
    if (currentPage > 1) {
      handleSearch(currentPage - 1)
    }
  }

  function goToNextPage():void {
    if (currentPage < totalPages) {
      handleSearch(currentPage + 1)
    }
  }

  return (
    <div className="flex-1 h-full overflow-y-hidden">
      {/* Campo de busca + botão */}
      <div className="flex flex-wrap gap-4 bg-white border p-4 rounded  items-center">
        <div className="flex items-center border-b-2 border-black-700 w-47 px-2">
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Número Sala"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="p-1 outline-none w-full"
          />
        </div>

        {/* Select do tipo da sala com ícone */}
        <div className="flex items-center min-w-50 px-2">
          <Tag className="text-gray-500 mr-2" size={18} />
          <select
            value={tipoSelecionado}
            onChange={(e) => setTipoSelecionado(e.target.value)}
            className="p-1 outline-none w-full bg-transparent"
          >
            <option value="">Tipo de Sala</option>
            {tiposSala.map((sala, index) => (
              <option key={index} value={sala}>
                {sala}
              </option>
            ))}
          </select>
        </div>

        {/* Select do bloco com ícone */}
        <div className="flex items-center w-50 px-2">
          <Building className="text-gray-500 mr-2" size={18} />
          <select
            value={blocoSelecionado}
            onChange={(e) => setBlocoSelecionado(e.target.value)}
            className="p-1 outline-none w-full bg-transparent"
          >
            <option value="">Bloco da Sala</option>
            {blocosSala.map((bloco, index) => (
              <option key={index} value={bloco}>
                {bloco}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center w-30 px-2">
          <label className="text-gray-700 mr-2 font-medium">Status:</label>
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as 'all' | 'active' | 'inactive')}
            className="p-1 outline-none w-full bg-transparent"
          >
            <option value="all">Todos</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>
        </div>
      </div>

      {/* barra */}
      <div className="flex justify-between p-3 h-14 border-b-2 mb-10 ">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            {salasSelecionadas.length} sala(s) selecionada(s)
          </span>

          <button
            onClick={() => setSalasSelecionadas([])}
            className="text-sm px-3 py-1 rounded border text-gray-700 hover:bg-gray-100 transition"
          >
            Limpar seleção
          </button>

          <button
            onClick={async () => {
              const confirm = window.confirm(`Deseja excluir ${salasSelecionadas.length} sala(s)?`);
              if (confirm) {
                try {
                  const ids = salasSelecionadas
                    .map((sala) => sala.id)
                    .filter((id): id is number => typeof id === 'number');

                  if (ids.length === 0) {
                    alert('Nenhuma sala válida selecionada.');
                    return;
                  }

                  await deleteRooms(ids);
                  alert('Sala(s) excluída(s) com sucesso!');
                  setSalasSelecionadas([]);
                  handleSearch(currentPage);
                } catch (error) {
                  console.error('Erro ao deletar salas:', error);
                  alert('Erro ao excluir sala(s). Verifique o console.');
                }
              }
            }}
            disabled={salasSelecionadas.length === 0}
            className={`text-sm px-3 py-1 rounded text-white bg-red-600 hover:bg-red-700 transition ${salasSelecionadas.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Excluir selecionadas
          </button>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="text-sm flex items-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="mr-2" size={15} /> Nova Sala
        </button>
      </div>

      {/* Grid de salas */}
      <RoomCard filteredRooms={filteredRooms} onSearch={() => handleSearch(currentPage)} salasSelecionadas={salasSelecionadas} toggleSelecaoSala={(room) => toggleSelecaoSala(room)} />
      
      {/* Paginação */}
      <div className="flex justify-between items-center gap-4 mt-6 mb-8 mx-auto max-w-[1500px]">
        <span className='text-sm text-gray-600 pl-5'>
          Página {currentPage} de {totalPages} — Total: {totalItems} salas
        </span>
        <div className='flex gap-2 pr-5'>
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 border rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-600'}`}
          >
            <span>Anterior</span>
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-300'}`}
          >
            <span>Próximo</span>
          </button>
        </div>
        
      </div>

      {/* Modal de Criação*/}
      <RoomModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          handleSearch(currentPage);
        }}
        tiposSala={tiposSala}
        blocosSala={blocosSala} 
      />
    </div>
  )
}

export default Rooms
