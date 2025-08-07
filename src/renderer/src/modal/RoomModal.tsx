/* eslint-disable prettier/prettier */
import { X, HousePlus } from "lucide-react";
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

  const handleAddRoom = async ():Promise<void> => {
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
    // Mostra o erro e mantém o modal aberto
    if (error.response && error.response.data && error.response.data.message) {
      // Caso o backend retorne uma mensagem específica
      alert("Erro: " + error.response.data.message);
    } else {
      alert("Erro ao criar sala, tente novamente.");
    }
    console.error("Erro ao criar sala:", error);
  }
};

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
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-b from-white to-gray-200 rounded-full shadow-lg border border-gray-300">
            <HousePlus className="text-blue-600" size={32} />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">Nova Sala</h2>

        {/* Campos */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Número da sala"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <input
            type="text"
            placeholder="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <select
            value={tipoSelecionado}
            onChange={(e) => setTipoSelecionado(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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
            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Bloco da Sala</option>
            {blocosSala.map((bloco, index) => (
              <option key={index} value={bloco}>
                {bloco}
              </option>
            ))}
          </select>
        </div>

        {/* Botão salvar */}
        <button
          onClick={handleAddRoom}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 shadow-md"
        >
          Salvar Sala
        </button>
      </div>
    </div>
  );
};
