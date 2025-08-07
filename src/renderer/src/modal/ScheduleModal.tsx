/* eslint-disable prettier/prettier */
import { useState } from 'react'
// modal
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
// icons
import { CalendarClock, X } from 'lucide-react'
// date
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
// types & validations
import { Periodo } from '@renderer/types/RoomType'
import { existePeriodoIgual, validarIntervalo, existeConflitoHorario } from '@renderer/hooks/dataValidator'

import { Listbox } from '@headlessui/react'

interface Props {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onAddPeriodo: (periodo: Periodo[]) => void
}

function getHoje(): string {
  return new Date().toISOString().split('T')[0]
}

export default function ScheduleModal({ isOpen, setIsOpen, onAddPeriodo }: Props): React.JSX.Element {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00')
  const [dataSelecionada, setDataSelecionada] = useState(getHoje())
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFim, setHoraFim] = useState('')
  const [periodos, setPeriodos] = useState<Periodo[]>([])

  function handleFinalizar(): void {
    if (periodos.length === 0) return
    onAddPeriodo(periodos)
    setPeriodos([])
    setIsOpen(false)
  }

  function handleClose(): void {
    setPeriodos([])
    setHoraInicio('')
    setHoraFim('')
    setDataSelecionada(getHoje())
    setIsOpen(false)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  function HourSelect({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: string[] }) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-left">
          {value || 'Selecione'}
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-lg bg-white border border-slate-200 shadow-lg text-sm">
          {options.map((option) => (
            <Listbox.Option key={option} value={option} className="px-3 py-2 hover:bg-slate-100 cursor-pointer">
              {option}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}

  const isValidInterval = validarIntervalo(horaInicio, horaFim)

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                <CalendarClock className="w-5 h-5 text-slate-600" />
              </div>
              <DialogTitle className="text-lg font-semibold text-slate-900">Agendar Horários</DialogTitle>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-3">
            {/* Data */}
            <div className="py-2">
              <div className="flex justify-center">
                <div className="inline-block">
                  <DatePicker
                    selected={new Date(dataSelecionada)}
                    onChange={(date) => date && setDataSelecionada(date.toISOString().split('T')[0])}
                    minDate={new Date()}
                    inline
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>
            </div>

            {/* Horários */}
            <div className="grid grid-cols-2 gap-4 pb-2">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Hora Inicial</label>
                <HourSelect value={horaInicio} onChange={setHoraInicio} options={hours} />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Hora Final</label>
                <HourSelect value={horaFim} onChange={setHoraFim} options={hours} />
              </div>
            </div>

            {/* Validação */}
            {!isValidInterval && horaInicio && horaFim && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                A hora final deve ser depois da inicial.
              </div>
            )}

            {/* Adicionar */}
            <button
              onClick={() => {
                if (!isValidInterval) return

                const novoPeriodo = { data: dataSelecionada, horaInicio, horaFim }

                if (existePeriodoIgual(periodos, novoPeriodo)) {
                  alert('Este horário já foi adicionado.')
                  return
                }

                if (existeConflitoHorario(periodos, novoPeriodo)) {
                  alert('Este horário conflita com outro já marcado.')
                  return
                }

                setPeriodos([...periodos, novoPeriodo])
                setHoraInicio('')
                setHoraFim('')
              }}
              disabled={!isValidInterval}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Adicionar Horário
            </button>

            {/* Lista de horários */}
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-700">Horários Adicionados ({periodos.length})</h3>
              {periodos.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-lg text-center text-sm text-slate-500">
                  Nenhum horário adicionado ainda.
                </div>
              ) : (
                <div className="space-y-2 max-h-16 overflow-y-scroll">
                  {periodos.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="text-sm text-slate-700">
                        <span className="font-medium">{p.data}</span>
                        <span className="mx-2 text-slate-500">•</span>
                        {p.horaInicio} às {p.horaFim}
                      </div>
                      <button
                        onClick={() => setPeriodos(periodos.filter((_, i) => i !== idx))}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 transition-colors"
                      >
                        <X className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 bg-slate-50 border-t border-slate-100">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleFinalizar}
              disabled={periodos.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Finalizar ({periodos.length})
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
