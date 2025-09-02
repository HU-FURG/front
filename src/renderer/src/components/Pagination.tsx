/* eslint-disable prettier/prettier */

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPrevious: () => void
  onNext: () => void
  label?: string // ex: "salas", "reservas" etc
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPrevious,
  onNext,
  label = 'itens'
}: PaginationProps) {
  return (
    <div className="flex justify-between items-center gap-4 mt-6 mb-8 mx-auto max-w-[1500px]">
      {/* Texto de status */}
      <span className="text-sm text-gray-600 pl-5">
        Página {currentPage} de {totalPages} — Total: {totalItems} {label}
      </span>

      {/* Botões */}
      <div className="flex gap-2 pr-5">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded-lg transition ${
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          <span>Anterior</span>
        </button>

        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded-lg transition ${
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          <span>Próximo</span>
        </button>
      </div>
    </div>
  )
}
