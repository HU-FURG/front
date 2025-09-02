/* eslint-disable prettier/prettier */
import { Search, Tag, Building } from "lucide-react"
import { tiposSala, blocosSala } from '@renderer/types/RoomType'
type ActiveFilter = "all" | "active" | "inactive"

interface SearchFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void

  tipoSelecionado: string
  onTipoChange: (value: string) => void
  blocosSelecionado: string
  onBlocoChange: (value: string) => void

  activeFilter?: ActiveFilter
  onActiveFilterChange?: (value: ActiveFilter) => void

  showStatusFilter?: boolean
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function SearchFilters({
  searchValue,
  onSearchChange,
  tipoSelecionado,
  onTipoChange,
  blocosSelecionado,
  onBlocoChange,
  activeFilter = "all",
  onActiveFilterChange,
  showStatusFilter = false,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 bg-white border py-4 px-2 rounded items-center">
      {/* Campo de busca */}
      <div className="flex items-center border-b-2 border-black-700 w-36 px-2">
        <Search className="text-gray-500 mr-2" size={18} />
        <input
          type="text"
          placeholder="Buscar"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="p-1 outline-none w-full"
        />
      </div>

      {/* Tipo de sala */}
      <div className="flex items-center min-w-50 px-2">
        <Tag className="text-gray-500 mr-2" size={18} />
        <select
          value={tipoSelecionado}
          onChange={(e) => onTipoChange(e.target.value)}
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

      {/* Bloco */}
      <div className="flex items-center w-50 px-2">
        <Building className="text-gray-500 mr-2" size={18} />
        <select
          value={blocosSelecionado}
          onChange={(e) => onBlocoChange(e.target.value)}
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

      {/* Filtro de status (opcional) */}
      {showStatusFilter && onActiveFilterChange && (
        <div className="flex items-center w-30 px-2">
          <label className="text-gray-700 mr-2 font-medium">Status:</label>
          <select
            value={activeFilter}
            onChange={(e) =>
              onActiveFilterChange(e.target.value as ActiveFilter)
            }
            className="p-1 outline-none w-full bg-transparent"
          >
            <option value="all">Todos</option>
            <option value="active">Ativas</option>
            <option value="inactive">Inativas</option>
          </select>
        </div>
      )}
    </div>
  )
}
