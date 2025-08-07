/* eslint-disable prettier/prettier */
import { X, Edit3 } from "lucide-react"
import React, { useState, useEffect } from "react"

interface RoomEditModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: {
    id: number
    number: string
    description: string
    tipo: string
    bloco: string
    active: boolean
  }) => void
  tiposSala: string[]
  salaData: {
    id: number          
    number: string
    description: string
    tipo: string
    bloco: string
    active: boolean 
  } | null
}

export const RoomEditModal: React.FC<RoomEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tiposSala,
  salaData,
}) => {
  const [id, setId] = useState<number | null>(null)
  const [number, setNumber] = useState("")
  const [bloco, setBloco] = useState("")
  const [description, setDescription] = useState("")
  const [tipoSelecionado, setTipoSelecionado] = useState("")
  const [active, setActive] = useState(true)

  useEffect(() => {
    if (salaData) {
      setId(salaData.id)
      setNumber(salaData.number)
      setBloco(salaData.bloco)
      setDescription(salaData.description)
      setTipoSelecionado(salaData.tipo)
      setActive(salaData.active)
    }
  }, [salaData])

  if (!isOpen || !salaData) return null

  const handleSave = (): void => {
    if (id === null) return

    onSave({
      id,
      number,
      bloco,
      description,
      tipo: tipoSelecionado,
      active,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/60 to-black/80">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fade-in">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Ícone topo */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-b from-white to-gray-200 rounded-full shadow-lg border border-gray-300">
            <Edit3 className="text-green-600" size={32} />
          </div>
        </div>

        {/* Cabeçalho com número e bloco */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            Sala <span className="text-green-600">{number}</span> / Bloco <span className="text-green-600">{bloco}</span>
          </h2>
        </div>

        {/* Campos editáveis */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          />

          <select
            value={tipoSelecionado}
            onChange={(e) => setTipoSelecionado(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            <option value="">Tipo de Sala</option>
            {tiposSala.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
            ))}
          </select>

           <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={active}
              onChange={e => setActive(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-gray-700">Sala ativa</span>
          </label>
        </div>

        {/* Botão salvar */}
        <button
          onClick={handleSave}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  )
}
