/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react'
import { Plus, CalendarDays, Building } from 'lucide-react'

import ScheduleModal from '@renderer/modal/ScheduleModal'
import BookingModal from '@renderer/modal/BookingModal'

import { buscarSalasDisponiveisPorHorario, handleConfirmAgendamento } from '@renderer/services/ScheduleRequests'

import { Sala, HorarioBusca} from '@renderer/types/RoomType'
import { SearchFilters } from '@renderer/components/searchFilters'
import { Pagination } from '@renderer/components/Pagination'


function Scheduling(): React.JSX.Element {
  // paginação
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12 

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

   // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
   async function onConfirmAgendamentoWrapper(dados: any) {
    try {
      await handleConfirmAgendamento(dados)

      // Pergunta se vai agendar outra sala no mesmo horário
      const manterHorarios = window.confirm("Deseja agendar outra sala para os mesmos horários?")

      if (!manterHorarios) {
        // Limpa todos os campos
        setHorariosBusca([])
        setSalasDisponiveis([])
        setSalaSelecionada(null)
        setSearch("")
        setTipoSelecionado("")
        setBlocoSelecionado("")
      }

      setShowBookingModal(false) // fecha modal de agendamento
    } catch (err) {
      console.error("Erro ao confirmar agendamento:", err)
    }
  }

  return (
    <main className="flex-1 h-full p-5 bg-gray-100">

      {/* header */}
      <SearchFilters
        searchValue={search}
        onSearchChange={setSearch}
        tipoSelecionado={tipoSelecionado}
        onTipoChange={setTipoSelecionado}
        blocosSelecionado={blocoSelecionado}
        onBlocoChange={setBlocoSelecionado}
      />

      {/* Linha com horários + botão */}
      <div className="flex justify-between gap-6 flex-wrap md:flex-nowrap items-center py-2 border-b">
        <div className="flex-1 overflow-x-auto pl-2">
          <div className="flex gap-4 w-max">
            {horariosBusca.length === 0 ? (
              <div className="text-gray-500 text-sm italic">
                Nenhum horário adicionado.
              </div>
            ) : (
              horariosBusca.map((item, index) => (
                <div key={index}>
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

      {/* Grid de Salas Header*/}
      <div className="bg-white rounded border mt-1">
        <div className="py-2 px-4 border-b">
          <h3 className="text-lg font-medium text-gray-800">
            Salas Encontradas
          </h3>
        </div>

        {(salasDisponiveis.length === 0) ? (
          <div className="p-3 text-center text-gray-500">
            <Building className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma sala disponível ou busca feita.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-2 p-4 max-h-[calc(100vh-350px)] overflow-y-scroll">
            {salasPaginadas.map((sala) => (
              <div
                key={sala.id}
                onClick={() => { setSalaSelecionada(sala); setShowBookingModal(true); }}
                className="border rounded-lg p-4 hover:cursor-pointer hover:shadow-md min-w-40 max-w-52 max-h-28 transition-shadow bg-white"
              >
                <div className="flex justify-between items-start mb-1">
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
        )}
      </div>

      {/* paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        label="salas"
      />

      {/* modals */}
      <ScheduleModal isOpen={isOpen} setIsOpen={setIsOpen} onAddPeriodo={onAddPeriodo} />
      {showBookingModal && salaSelecionada && (
        <BookingModal
          isOpen={showBookingModal}
          setIsOpen={setShowBookingModal}
          sala={salaSelecionada}
          horariosSelecionados={horariosBusca} 
          onConfirmAgendamento={onConfirmAgendamentoWrapper}
        />
      )}
    </main>
  )
}

export default Scheduling
