/* eslint-disable prettier/prettier */
import { tiposSala, blocosSala } from '@renderer/types/RoomType'

type ActiveFilter = "all" | "active" | "inactive"

interface SearchFiltersProps {
  tipoSelecionado: string
  onTipoChange: (value: string) => void
  blocosSelecionado: string
  onBlocoChange: (value: string) => void

  activeFilter?: ActiveFilter
  onActiveFilterChange?: (value: ActiveFilter) => void

  showStatusFilter?: boolean
  setIsfilter: (boolean) => void
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function RoomFilters({
  tipoSelecionado,
  onTipoChange,
  blocosSelecionado,
  onBlocoChange,
  activeFilter = "all",
  onActiveFilterChange,
  showStatusFilter = false,
  setIsfilter
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-3 bg-white py-5 px-4 rounded-lg shadow-md w-full max-w-sm">
      <h2 className="text-center text-gray-800 font-semibold text-lg mb-2">Filtros</h2>

      {/* Tipo de sala */}
      <div className="flex items-center w-full">
        
        <select
          value={tipoSelecionado}
          onChange={(e) => onTipoChange(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-700 outline-none focus:ring-1 focus:ring-emerald-700 transition"
        >
          <option value="">Tipo de Sala</option>
          {tiposSala.map((tipo, i) => (
            <option key={i} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </div>

      {/* Bloco */}
      <div className="flex items-center w-full">
        
        <select
          value={blocosSelecionado}
          onChange={(e) => onBlocoChange(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-700 outline-none focus:ring-1 focus:ring-emerald-700 transition"
        >
          <option value="">Bloco da Sala</option>
          {blocosSala.map((bloco, i) => (
            <option key={i} value={bloco}>
              {bloco}
            </option>
          ))}
        </select>
      </div>

      {/* Filtro de status (opcional) */}
      {showStatusFilter && onActiveFilterChange && (
        <div className="flex items-center w-full">
          
          <select
            value={activeFilter}
            onChange={(e) => onActiveFilterChange(e.target.value as ActiveFilter)}
            className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-700 outline-none focus:ring-1 focus:ring-emerald-700 transition"
          >
            <option value="all">Status</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>
        </div>
      )}

      {/* Botão Limpar */}
      <button
        onClick={() => {
          onTipoChange("")
          onBlocoChange("")
          onActiveFilterChange?.("all")
        }}
        className="w-full mt-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-md transition-colors"
      >
        Limpar Filtros
      </button>

      <div className="flex justify-end">
        <button
          onClick={() => setIsfilter(false)}
          className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
