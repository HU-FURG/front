/* eslint-disable prettier/prettier */
"use client"

import React, { useState, useEffect } from "react"
import { X, Edit3, Trash2 } from "lucide-react"
import { Room } from "@renderer/types/RoomType"

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
  salaData: Room | null
  deleteRoom: (room: Room) => Promise<void>
}

export const RoomEditModal: React.FC<RoomEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  tiposSala,
  salaData,
  deleteRoom,
}) => {
  const [formData, setFormData] = useState({
    id: 0,
    number: "",
    description: "",
    tipo: "",
    bloco: "",
    active: true,
  })

  useEffect(() => {
    if (salaData) {
      setFormData({
        id: salaData.id ?? 0,
        number: salaData.number,
        description: salaData.description,
        tipo: salaData.tipo,
        bloco: salaData.bloco,
        active: salaData.active,
      })
    }
  }, [salaData])

  if (!isOpen || !salaData) return null

  const handleSubmit = (e: React.FormEvent):void => {
    e.preventDefault()
    if (!formData.id) return
    onSave(formData)
  }

  const handleDelete = async ():Promise<void> => {
    if (!salaData) return
    await deleteRoom(salaData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Editar Sala {formData.number}
            </h2>
          </div>
          <button
            onClick={onClose}
            
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              rows={3}
              
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo da Sala</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              
            >
              <option value="">Selecione o tipo</option>
              {tiposSala.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Sala ativa
            </label>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="sr-only peer"
                
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-emerald-600 transition-colors"></div>
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform peer-checked:translate-x-5"></div>
            </label>
          </div>

          {/* Ações */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleDelete}
              
              className="flex-1 px-4 py-2 flex items-center justify-center gap-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> Deletar
            </button>
            <button
              type="button"
              onClick={onClose}
              
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
