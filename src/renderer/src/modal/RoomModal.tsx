/* eslint-disable prettier/prettier */
import { X } from "lucide-react";
import React, { useState } from "react";
import { createRoom } from "@renderer/services/RoomRequests";

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  tiposSala: string[];
  blocosSala: string[];
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  tiposSala,
  blocosSala,
}) => {
  const [number, setNumber] = useState("");
  const [description, setDescription] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState<string>("");
  const [blocoSelecionado, setBlocoSelecionado] = useState<string>("");

  if (!isOpen) return null;

  const handleAddRoom = async (): Promise<void> => {
    try {
      await createRoom({
        number,
        description,
        tipo: tipoSelecionado,
        bloco: blocoSelecionado,
      });
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.message) {
        alert("Erro: " + error.response.data.message);
      } else {
        alert("Erro ao criar sala, tente novamente.");
      }
      console.error("Erro ao criar sala:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Nova Sala</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Campos */}
        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Número da sala"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />

          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />

          <select
            value={tipoSelecionado}
            onChange={(e) => setTipoSelecionado(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="">Tipo de Sala</option>
            {tiposSala.map((sala, index) => (
              <option key={index} value={sala}>
                {sala}
              </option>
            ))}
          </select>

          <select
            value={blocoSelecionado}
            onChange={(e) => setBlocoSelecionado(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          >
            <option value="">Bloco da Sala</option>
            {blocosSala.map((bloco, index) => (
              <option key={index} value={bloco}>
                {bloco}
              </option>
            ))}
          </select>
        </div>

        {/* Botões */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddRoom}
            className="flex-1 px-4 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors shadow"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};
