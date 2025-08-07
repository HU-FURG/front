/* eslint-disable prettier/prettier */
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { CalendarClock, X } from 'lucide-react'
import { useState } from 'react'

type Props = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  sala: {
    id: string
    nome: string
    tipo: string
    bloco: string
  }
  horariosSelecionados: {
    data: string
    horaInicio: string
    horaFim: string
  }[]
  onConfirmAgendamento: (agendamento: {
    salaId: string
    responsavel: string
    horarios: {
      data: string
      horaInicio: string
      horaFim: string
    }[]
  }) => void
}

export default function BookingModal({ isOpen, setIsOpen, sala, horariosSelecionados, onConfirmAgendamento }: Props): React.JSX.Element {
  const [responsavel, setResponsavel] = useState('')

  function handleClose(): void {
    setResponsavel('')
    setIsOpen(false)
  }

  function handleConfirmar(): void {
    if (!responsavel.trim()) return

    onConfirmAgendamento({
      salaId: sala.id,
      responsavel,
      horarios: horariosSelecionados
    })

    handleClose()
  }

  const isValid = responsavel.trim().length > 0

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
              <DialogTitle className="text-lg font-semibold text-slate-900">Agendar Sala</DialogTitle>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="px-3 pt-3 space-y-4">
            <div className="text-sm text-slate-600 space-y-1">
              <div>
                <strong>{sala.nome}</strong> ({sala.tipo}) – {sala.bloco}
              </div>
              {horariosSelecionados.map((h, i) => (
                <div key={i} className="text-slate-500">
                  📅 {h.data} | ⏰ {h.horaInicio} - {h.horaFim}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Responsável</label>
              <input
                type="text"
                placeholder="Nome ou matrícula"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-4 bg-slate-50 border-t border-slate-100">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={!isValid}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Agendar
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
