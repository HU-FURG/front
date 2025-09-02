/* eslint-disable prettier/prettier */
// icones
import { Plus} from 'lucide-react'
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
import { SearchFilters } from '@renderer/components/searchFilters'
import { Pagination } from '@renderer/components/Pagination'

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <SearchFilters
        searchValue={search}
        onSearchChange={setSearch}
        tipoSelecionado={tipoSelecionado}
        onTipoChange={setTipoSelecionado}
        blocosSelecionado={blocoSelecionado}
        onBlocoChange={setBlocoSelecionado}
        activeFilter={activeFilter}
        onActiveFilterChange={setActiveFilter}
        showStatusFilter={true}
      />

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
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        label="salas"
      />

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
