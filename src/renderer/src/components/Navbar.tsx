/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { useState, useRef, useEffect } from 'react'
import { UsersRound } from 'lucide-react'

interface NavbarProps {
  handleLogout: () => void
}

function Navbar({ handleLogout }: NavbarProps): React.JSX.Element {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fecha dropdown se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-white text-black shadow-sm shadow-black-200 z-40 relative">


      {/* User dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 transition"
        >
          <UsersRound />
          <span>Usuário</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-md">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white transition rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
