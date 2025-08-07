/* eslint-disable prettier/prettier */
import { useEffect, useState } from 'react'
import { Plus, Search, CalendarDays, Tag, Building } from 'lucide-react'

import ScheduleModal from '@renderer/modal/ScheduleModal'
import BookingModal from '@renderer/modal/BookingModal'

import { buscarSalasDisponiveisPorHorario, handleConfirmAgendamento } from '@renderer/services/ScheduleRequests'

import { Sala, HorarioBusca, tiposSala, blocosSala } from '@renderer/types/RoomType'


function Scheduling(): React.JSX.Element {
  // paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [search, setSearch] = useState('')
  const [tipoSelecionado, setTipoSelecionado] = useState('')
  const [blocoSelecionado, setBlocoSelecionado] = useState('')

  const [isOpen, setIsOpen] = useState(false)
  const [horariosBusca, setHorariosBusca] = useState<HorarioBusca[]>([])

  const [showBookingModal, setShowBookingModal] = useState(false)
  const [salaSelecionada, setSalaSelecionada] = useState<Sala | null>(null)

  const [salasDisponiveis, setSalasDisponiveis] = useState<Sala[]>([])

  const salasFiltradas = salasDisponiveis.filter((sala) => {
  const nomeMatch = sala.nome.toLowerCase().includes(search.toLowerCase())
  const tipoMatch = tipoSelecionado ? sala.tipo === tipoSelecionado : true
  const blocoMatch = blocoSelecionado ? sala.bloco === blocoSelecionado : true

    return nomeMatch && tipoMatch && blocoMatch 
  })

  const totalItems = salasFiltradas.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)


  

  const goToNextPage = ():void => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const goToPreviousPage = ():void => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  // Paginação da lista de salas
  const salasPaginadas = salasFiltradas.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
  )

  useEffect(() => {
  setCurrentPage(1)
  }, [search, tipoSelecionado, blocoSelecionado])

  async function buscarSalasLivres(horarios: HorarioBusca[]): Promise<void> {
    try {
    const salasLivres = await buscarSalasDisponiveisPorHorario(horarios)
    setSalasDisponiveis(salasLivres)
    } catch (error) {
      console.error('Erro ao buscar salas:', error)
    }
  }

  function onAddPeriodo(novosPeriodos: HorarioBusca[]): void {
    setHorariosBusca([...novosPeriodos])
    buscarSalasLivres(novosPeriodos)
  }

  return (
    <main className="flex-1 h-full p-5 bg-gray-100">

      {/* header */}
      <div className="flex flex-wrap gap-4 bg-white border p-3 rounded items-center">
        {/* Campo busca */}
        <div className="flex items-center border-b-2 border-black-700 w-47 px-2">
          <Search className="text-gray-500 mr-2" size={18} />
          <input
            type="text"
            placeholder="Buscar Salas"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-1 outline-none w-full"
          />
        </div>

        {/* Filtro Tipo de Sala */}
        <div className="flex items-center min-w-50 px-2">
          <Tag className="text-gray-500 mr-2" size={18} />
          <select
            value={tipoSelecionado}
            onChange={(e) => setTipoSelecionado(e.target.value)}
            className="p-1 outline-none w-full bg-transparent"
          >
            <option value="">Tipo de Sala</option>
            {tiposSala.map((tipo, i) => (
              <option key={i} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro Bloco */}
        <div className="flex items-center w-50 px-2">
          <Building className="text-gray-500 mr-2" size={18} />
          <select
            value={blocoSelecionado}
            onChange={(e) => setBlocoSelecionado(e.target.value)}
            className="p-1 outline-none w-full bg-transparent"
          >
            <option value="">Bloco da Sala</option>
            {blocosSala.map((bloco, i) => (
              <option key={i} value={bloco}>
                {bloco}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Linha com horários + botão */}
      <div className="flex justify-between gap-6 flex-wrap md:flex-nowrap items-center py-2 border-b">
        <div
          className="flex-1  overflow-x-auto pl-2"
        >
          <div className="flex gap-4 w-max">
            {horariosBusca.length === 0 ? (
              <div className="text-gray-500 text-sm italic">
                Nenhum horário adicionado.
              </div>
            ) : (
              horariosBusca.map((item, index) => (
                <div
                  key={index}
                  className=""
                >
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <CalendarDays className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.data}</span>
                    <span className="text-sm">
                      {item.horaInicio}/{item.horaFim}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="text-sm flex items-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          <Plus className="inline-block mr-1" size={16} /> Adicionar Horário
        </button>
      </div>

      {/* Grid de Salas */}
      <div className="bg-white rounded border mt-2">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium text-gray-800">
            Salas Encontradas
          </h3>
      </div>

      {(salasDisponiveis.length == 0) ?
      <div className="p-8 text-center text-gray-500">
        <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Nenhuma sala disponível ou busca feita.</p>
      </div>
      : 
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 p-2">
        {salasPaginadas.map((sala) => (
          <div key={sala.id} onClick={() => {setSalaSelecionada(sala); setShowBookingModal(true);}} className="border rounded-lg p-4 hover:shadow-md min-w-60 max-w-80 transition-shadow bg-white">
            <div className="flex justify-between items-start mb-3" >
              <div>
                <h3 className="font-medium text-gray-800">{sala.nome}</h3>
                <p className="text-sm text-gray-500">{sala.tipo}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                Disponível
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <span>{sala.bloco}</span>
            </div>
          </div>
            ))}
          </div>
        }
      </div>

      {/* paginação */}
      <div className="flex justify-between items-center gap-2 mt-2 mb-8 mx-auto max-w-[1500px]">
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

      {/* modals */}
      <ScheduleModal isOpen={isOpen} setIsOpen={setIsOpen} onAddPeriodo={onAddPeriodo} />
      {showBookingModal && salaSelecionada && (
        <BookingModal
          isOpen={showBookingModal}
          setIsOpen={setShowBookingModal}
          sala={salaSelecionada}
          horariosSelecionados={horariosBusca} // << Adicionado aqui
          onConfirmAgendamento={handleConfirmAgendamento}
        />
      )}
    </main>
  )
}

export default Scheduling
